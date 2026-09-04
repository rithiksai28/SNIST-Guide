// ============================================================================
// SNIST GUIDE - Full-Stack Express Server with Vite Middleware
// File: /server.ts
// ============================================================================

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { SubjectInput } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------------------------------
interface AuthenticatedRequest extends Request {
  adminEmail?: string;
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token required.' });
  }

  const token = authHeader.substring(7).trim();
  const email = db.validateSession(token);

  if (!email) {
    return res.status(401).json({ success: false, error: 'Invalid or expired admin session.' });
  }

  req.adminEmail = email;
  next();
}

// ----------------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------------

// 1. PUBLIC: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. PUBLIC: Get all subjects
app.get('/api/subjects', (req, res) => {
  try {
    const subjects = db.getPublicSubjects();
    res.json({ success: true, subjects });
  } catch (err: any) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve subjects.' });
  }
});

// 3. ADMIN: Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    const configuredEmail = process.env.ADMIN_EMAIL || 'rithiksai608060@gmail.com';
    const configuredPassword = process.env.ADMIN_PASSWORD || 'Admin@SNIST2026!';

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (
      email.trim().toLowerCase() !== configuredEmail.trim().toLowerCase() ||
      password !== configuredPassword
    ) {
      return res.status(401).json({ success: false, error: 'Invalid administrator credentials.' });
    }

    const token = db.createSession(email);
    return res.json({
      success: true,
      token,
      user: {
        email: configuredEmail,
        role: 'Administrator',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login authentication error.' });
  }
});

// 4. ADMIN: Verify active session (Me)
app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: {
      email: req.adminEmail,
      role: 'Administrator',
    },
  });
});

// 5. ADMIN: Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (token) {
    db.destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 6. ADMIN: Add Subject
app.post('/api/subjects', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const {
      name,
      code,
      yearId,
      semesterId,
      departments,
      status,
      driveUrl,
      description,
    } = req.body as SubjectInput;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Subject name is required.' });
    }
    if (!yearId) {
      return res.status(400).json({ success: false, error: 'Academic Year is required.' });
    }
    if (!semesterId) {
      return res.status(400).json({ success: false, error: 'Semester is required.' });
    }
    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one department must be selected.' });
    }

    const created = db.createSubject({
      name,
      code,
      yearId,
      semesterId,
      departments,
      status: status || 'RESOURCES AVAILABLE',
      driveUrl: driveUrl || '',
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
      subject: created,
    });
  } catch (err: any) {
    console.error('Create subject error:', err);
    res.status(500).json({ success: false, error: 'Failed to create subject.' });
  }
});

// 7. ADMIN: Edit Subject
app.put('/api/subjects/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      yearId,
      semesterId,
      departments,
      status,
      driveUrl,
      description,
    } = req.body as SubjectInput;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Subject name is required.' });
    }
    if (!yearId || !semesterId) {
      return res.status(400).json({ success: false, error: 'Year and Semester are required.' });
    }
    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one department must be selected.' });
    }

    const updated = db.updateSubject(id, {
      name,
      code,
      yearId,
      semesterId,
      departments,
      status: status || 'RESOURCES AVAILABLE',
      driveUrl: driveUrl || '',
      description,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Subject not found.' });
    }

    res.json({
      success: true,
      message: 'Subject updated successfully.',
      subject: updated,
    });
  } catch (err: any) {
    console.error('Update subject error:', err);
    res.status(500).json({ success: false, error: 'Failed to update subject.' });
  }
});

// 8. ADMIN: Delete Subject
app.delete('/api/subjects/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteSubject(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Subject not found or already deleted.' });
    }

    res.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (err: any) {
    console.error('Delete subject error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete subject.' });
  }
});

// ----------------------------------------------------------------------------
// VITE INTEGRATION & SERVER STARTUP
// ----------------------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SNIST GUIDE server running at http://0.0.0.0:${PORT}`);
  });
}

start();
