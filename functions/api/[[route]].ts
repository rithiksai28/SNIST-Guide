// ============================================================================
// Cloudflare Pages Functions: Full-Stack API Router with Cloudflare D1
// Path: /functions/api/[[route]].ts
// ============================================================================

// Type definitions for Cloudflare D1 environment
interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: any;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch?(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec?(query: string): Promise<D1Result>;
}

interface Env {
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
}

// Helper to standardise JSON responses
function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
}

// Token validation helper for Cloudflare Workers
async function verifyAdminAuth(request: Request, env: Env): Promise<string | null> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  if (!token) return null;

  try {
    const session = await env.DB.prepare(
      `SELECT * FROM admin_sessions WHERE token = ? AND expires_at > datetime('now')`
    )
      .bind(token)
      .first<{ email: string }>();

    return session ? session.email : null;
  } catch {
    // If sessions table not ready, fallback to validating against token structure
    return null;
  }
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  params: { route?: string[] };
}): Promise<Response> {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const pathParts = params.route || url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const resource = pathParts[0]; // 'subjects' or 'admin'
  const subResource = pathParts[1]; // e.g. subject id, or 'login', 'me', 'logout'

  try {
    // ------------------------------------------------------------------------
    // 1. PUBLIC & ADMIN SUBJECT ENDPOINTS
    // ------------------------------------------------------------------------
    if (resource === 'subjects') {
      // GET /api/subjects - Publicly accessible list of all subjects
      if (method === 'GET') {
        const query = `
          SELECT 
            s.id,
            s.name,
            s.code,
            s.year_id as yearId,
            s.year_title as yearTitle,
            s.semester_id as semesterId,
            s.semester_title as semesterTitle,
            s.status,
            s.drive_url as driveUrl,
            s.description,
            s.created_at as createdAt,
            s.updated_at as updatedAt,
            GROUP_CONCAT(sd.department_id) as departments_csv
          FROM subjects s
          LEFT JOIN subject_departments sd ON s.id = sd.subject_id
          GROUP BY s.id
          ORDER BY s.created_at ASC
        `;

        const { results } = await env.DB.prepare(query).all();
        const subjects = (results || []).map((row: any) => ({
          ...row,
          departments: row.departments_csv ? row.departments_csv.split(',') : [],
        }));

        return jsonResponse({ success: true, subjects });
      }

      // MUTATING ENDPOINTS (Requires Admin Authentication)
      const adminEmail = await verifyAdminAuth(request, env);
      if (!adminEmail) {
        return jsonResponse(
          { success: false, error: 'Unauthorized. Admin credentials required.' },
          401
        );
      }

      // POST /api/subjects - Create new subject
      if (method === 'POST') {
        const body: any = await request.json();
        const {
          name,
          code = '',
          yearId,
          semesterId,
          departments = [],
          status = 'RESOURCES AVAILABLE',
          driveUrl = '',
          description = '',
        } = body;

        if (!name || !yearId || !semesterId) {
          return jsonResponse(
            { success: false, error: 'Name, Year, and Semester are required.' },
            400
          );
        }

        const id = 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const yearTitle =
          yearId === 'first-year'
            ? 'First Year'
            : yearId === 'second-year'
            ? 'Second Year'
            : yearId === 'third-year'
            ? 'Third Year'
            : 'Fourth Year';
        const semesterTitle = semesterId === 'sem-1' ? 'Semester I' : 'Semester II';

        const batchStatements = [
          env.DB.prepare(
            `INSERT INTO subjects (id, name, code, year_id, year_title, semester_id, semester_title, status, drive_url, description, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
          ).bind(id, name, code, yearId, yearTitle, semesterId, semesterTitle, status, driveUrl, description),
        ];

        // Add junction department mappings
        for (const dept of departments) {
          batchStatements.push(
            env.DB.prepare(
              `INSERT OR IGNORE INTO subject_departments (subject_id, department_id) VALUES (?, ?)`
            ).bind(id, dept)
          );
        }

        await env.DB.batch(batchStatements);

        return jsonResponse({
          success: true,
          message: 'Subject added successfully',
          subject: {
            id,
            name,
            code,
            yearId,
            yearTitle,
            semesterId,
            semesterTitle,
            departments,
            status,
            driveUrl,
            description,
          },
        });
      }

      // PUT /api/subjects/:id - Edit existing subject
      if (method === 'PUT' && subResource) {
        const id = subResource;
        const body: any = await request.json();
        const {
          name,
          code = '',
          yearId,
          semesterId,
          departments = [],
          status,
          driveUrl = '',
          description = '',
        } = body;

        const yearTitle =
          yearId === 'first-year'
            ? 'First Year'
            : yearId === 'second-year'
            ? 'Second Year'
            : yearId === 'third-year'
            ? 'Third Year'
            : 'Fourth Year';
        const semesterTitle = semesterId === 'sem-1' ? 'Semester I' : 'Semester II';

        const batchStatements = [
          env.DB.prepare(
            `UPDATE subjects SET 
              name = ?, code = ?, year_id = ?, year_title = ?, semester_id = ?, semester_title = ?,
              status = ?, drive_url = ?, description = ?, updated_at = datetime('now')
             WHERE id = ?`
          ).bind(name, code, yearId, yearTitle, semesterId, semesterTitle, status, driveUrl, description, id),
          env.DB.prepare(`DELETE FROM subject_departments WHERE subject_id = ?`).bind(id),
        ];

        for (const dept of departments) {
          batchStatements.push(
            env.DB.prepare(
              `INSERT INTO subject_departments (subject_id, department_id) VALUES (?, ?)`
            ).bind(id, dept)
          );
        }

        await env.DB.batch(batchStatements);

        return jsonResponse({
          success: true,
          message: 'Subject updated successfully',
        });
      }

      // DELETE /api/subjects/:id - Remove subject
      if (method === 'DELETE' && subResource) {
        const id = subResource;
        await env.DB.batch([
          env.DB.prepare(`DELETE FROM subject_departments WHERE subject_id = ?`).bind(id),
          env.DB.prepare(`DELETE FROM subjects WHERE id = ?`).bind(id),
        ]);

        return jsonResponse({
          success: true,
          message: 'Subject deleted successfully',
        });
      }
    }

    // ------------------------------------------------------------------------
    // 2. ADMIN AUTHENTICATION ENDPOINTS
    // ------------------------------------------------------------------------
    if (resource === 'admin') {
      // POST /api/admin/login
      if (method === 'POST' && subResource === 'login') {
        const body: any = await request.json();
        const { email, password } = body;

        const configuredEmail = env.ADMIN_EMAIL || 'rithiksai608060@gmail.com';
        const configuredPass = env.ADMIN_PASSWORD || 'Admin@SNIST2026!';

        if (email !== configuredEmail || password !== configuredPass) {
          return jsonResponse({ success: false, error: 'Invalid admin email or password.' }, 401);
        }

        // Generate token
        const token = 'snist_' + crypto.randomUUID().replace(/-/g, '');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(
          `INSERT INTO admin_sessions (token, email, expires_at) VALUES (?, ?, ?)`
        )
          .bind(token, email, expiresAt)
          .run();

        return jsonResponse({
          success: true,
          token,
          user: { email, role: 'Administrator' },
        });
      }

      // GET /api/admin/me
      if (method === 'GET' && subResource === 'me') {
        const adminEmail = await verifyAdminAuth(request, env);
        if (!adminEmail) {
          return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
        }
        return jsonResponse({
          success: true,
          user: { email: adminEmail, role: 'Administrator' },
        });
      }

      // POST /api/admin/logout
      if (method === 'POST' && subResource === 'logout') {
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace(/^Bearer\s+/, '').trim();
        if (token) {
          await env.DB.prepare(`DELETE FROM admin_sessions WHERE token = ?`).bind(token).run();
        }
        return jsonResponse({ success: true, message: 'Logged out successfully' });
      }
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message || 'Internal Server Error' }, 500);
  }
}
