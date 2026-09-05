// ============================================================================
// SNIST GUIDE - Supabase Cloud Database & Auth Engine
// File: /src/lib/api.ts
//
// Cloud persistence via Supabase. Public visitors can READ the catalog;
// only the authenticated admin can CREATE / UPDATE / DELETE (enforced by
// Supabase Row Level Security, not by this file).
//
// Exported function names and signatures are identical to the previous
// localStorage engine, so no UI components need to change.
// ============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { Subject, SubjectInput, AdminAuthResponse, AdminUser } from '../types';
import { getAllSubjects } from '../data/academicData';

// Legacy localStorage keys (kept for fallback + migration support)
const TOKEN_KEY = 'snist_admin_token_v3';
const SUBJECTS_STORAGE_KEY = 'snist_academic_subjects_v3';

// ----------------------------------------------------------------------------
// Legacy token helpers (kept so existing UI code keeps working).
// Real security now lives in the Supabase session + RLS.
// ----------------------------------------------------------------------------

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

// ----------------------------------------------------------------------------
// Helper Formatters for Academic Titles (unchanged behavior)
// ----------------------------------------------------------------------------
function getYearTitle(yearId: string): string {
  switch (yearId) {
    case 'first-year':
      return 'First Year';
    case 'second-year':
      return 'Second Year';
    case 'third-year':
      return 'Third Year';
    case 'fourth-year':
      return 'Fourth Year';
    default:
      return 'Academic Year';
  }
}

function getSemesterTitle(semesterId: string): string {
  if (semesterId.includes('2')) return 'Semester II';
  return 'Semester I';
}

// ----------------------------------------------------------------------------
// Row mapping: Supabase (snake_case)  <->  Frontend Subject (camelCase)
// ----------------------------------------------------------------------------
type SubjectRow = {
  id: string;
  name: string;
  code: string | null;
  departments: string[] | null;
  status: string;
  drive_url: string | null;
  category_tags: string[] | null;
  description: string | null;
  semester_id: string;
  semester_title: string;
  year_id: string;
  year_title: string;
  created_at: string;
  updated_at: string;
};

function rowToSubject(row: SubjectRow): Subject {
  return {
    id: row.id,
    name: row.name,
    code: row.code ?? '',
    departments: Array.isArray(row.departments) ? row.departments : [],
    status: row.status === 'COMING SOON' ? 'COMING SOON' : 'RESOURCES AVAILABLE',
    driveUrl: row.drive_url ?? '',
    categoryTags: Array.isArray(row.category_tags) ? row.category_tags : [],
    description: row.description ?? '',
    semesterId: row.semester_id,
    semesterTitle: row.semester_title,
    yearId: row.year_id,
    yearTitle: row.year_title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function subjectToRow(s: Partial<Subject>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.name !== undefined) row.name = s.name;
  if (s.code !== undefined) row.code = s.code;
  if (s.departments !== undefined) row.departments = s.departments;
  if (s.status !== undefined) row.status = s.status;
  if (s.driveUrl !== undefined) row.drive_url = s.driveUrl;
  if (s.categoryTags !== undefined) row.category_tags = s.categoryTags;
  if (s.description !== undefined) row.description = s.description;
  if (s.semesterId !== undefined) row.semester_id = s.semesterId;
  if (s.semesterTitle !== undefined) row.semester_title = s.semesterTitle;
  if (s.yearId !== undefined) row.year_id = s.yearId;
  if (s.yearTitle !== undefined) row.year_title = s.yearTitle;
  if (s.createdAt !== undefined) row.created_at = s.createdAt;
  if (s.updatedAt !== undefined) row.updated_at = s.updatedAt;
  return row;
}

function friendlyDbError(err: any, action: string): string {
  const msg: string = err?.message ?? String(err);
  if (msg.includes('row-level security') || err?.code === '42501') {
    return `Not authorized to ${action}. Please log in as administrator.`;
  }
  if (err?.code === '23505') {
    return 'A subject with this ID already exists.';
  }
  return `Failed to ${action}: ${msg}`;
}

// ----------------------------------------------------------------------------
// Legacy LocalStorage Engine (fallback when Supabase env vars are missing,
// and used by the one-time migration helper)
// ----------------------------------------------------------------------------

export function getLocalStoredSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(SUBJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Unable to load subjects from localStorage:', err);
  }

  const initial = getAllSubjects();
  saveLocalStoredSubjects(initial);
  return initial;
}

export function saveLocalStoredSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.warn('Unable to save subjects to localStorage:', err);
  }
}

export function resetSubjectsToMasterData(): Subject[] {
  const master = getAllSubjects();
  saveLocalStoredSubjects(master);
  return master;
}

// ----------------------------------------------------------------------------
// Public Subject Fetching (Supabase, with graceful fallback)
// ----------------------------------------------------------------------------
export async function fetchSubjects(): Promise<Subject[]> {
  if (!isSupabaseConfigured) {
    return getLocalStoredSubjects();
  }

  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (data ?? []) as SubjectRow[];
    if (rows.length === 0) {
      console.warn(
        '[SNIST] The Supabase "subjects" table is empty. ' +
          'Log in as admin and run migrateToSupabase() in the browser console to load the catalog.'
      );
      return [];
    }
    return rows.map(rowToSubject);
  } catch (err) {
    // Network/Supabase hiccup: degrade gracefully instead of crashing the app.
    console.error('[SNIST] Supabase read failed, falling back to local cache:', err);
    return getLocalStoredSubjects();
  }
}

// ----------------------------------------------------------------------------
// Optional Realtime helper (requires the realtime publication SQL step.
// Returns an unsubscribe function.)
// ----------------------------------------------------------------------------
export function subscribeToSubjects(onChange: () => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel('snist-subjects')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'subjects' },
      () => onChange()
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// ----------------------------------------------------------------------------
// Admin Authentication (Supabase Auth - no passwords in source code)
// ----------------------------------------------------------------------------
export async function adminLogin(email: string, pass: string): Promise<AdminAuthResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: pass.trim(),
  });

  if (error || !data.user) {
    console.error('[SNIST admin login] Supabase error:', error?.message);
    return { success: false, error: 'Invalid administrator email or password.' };
  }

  const token = data.session?.access_token ?? `snist_admin_${Date.now()}`;
  setStoredToken(token); // legacy compatibility for existing UI code

  const user: AdminUser = {
    email: data.user.email ?? cleanEmail,
    name: 'SNIST Administrator',
    role: 'Administrator',
  };

  return { success: true, token, user };
}

export async function adminVerifySession(
  _token?: string
): Promise<{ success: boolean; user?: AdminUser }> {
  if (!isSupabaseConfigured) return { success: false };

  const { data } = await supabase.auth.getSession();
  const u = data.session?.user;
  if (!u) return { success: false };

  return {
    success: true,
    user: {
      email: u.email ?? '',
      name: 'SNIST Administrator',
      role: 'Administrator',
    },
  };
}

export async function adminLogout(_token?: string): Promise<void> {
  clearStoredToken();
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

// ----------------------------------------------------------------------------
// Admin Subject Management (Supabase CRUD)
// ----------------------------------------------------------------------------
export async function adminCreateSubject(
  token: string,
  subjectInput: SubjectInput
): Promise<{ success: boolean; subject?: Subject; error?: string }> {
  const session = await adminVerifySession(token);
  if (!session.success) {
    return { success: false, error: 'Unauthorized: Admin session expired or invalid.' };
  }

  if (!isSupabaseConfigured) {
    const current = getLocalStoredSubjects();
    const newSubject: Subject = buildSubject(subjectInput);
    saveLocalStoredSubjects([newSubject, ...current]);
    return { success: true, subject: newSubject };
  }

  try {
    const newSubject = buildSubject(subjectInput);
    const { data, error } = await supabase
      .from('subjects')
      .insert(subjectToRow(newSubject))
      .select()
      .single();

    if (error) return { success: false, error: friendlyDbError(error, 'add subject') };
    return { success: true, subject: rowToSubject(data as SubjectRow) };
  } catch (err: any) {
    return { success: false, error: friendlyDbError(err, 'add subject') };
  }
}

function buildSubject(subjectInput: SubjectInput): Subject {
  const nowIso = new Date().toISOString();
  return {
    id: `subj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: subjectInput.name.trim(),
    code: subjectInput.code ? subjectInput.code.trim().toUpperCase() : '',
    yearId: subjectInput.yearId,
    yearTitle: getYearTitle(subjectInput.yearId),
    semesterId: subjectInput.semesterId,
    semesterTitle: getSemesterTitle(subjectInput.semesterId),
    departments:
      subjectInput.departments && subjectInput.departments.length > 0
        ? subjectInput.departments
        : ['COMMON'],
    status: subjectInput.status || 'RESOURCES AVAILABLE',
    driveUrl: subjectInput.driveUrl ? subjectInput.driveUrl.trim() : '',
    description: subjectInput.description ? subjectInput.description.trim() : '',
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function adminUpdateSubject(
  token: string,
  id: string,
  subjectInput: SubjectInput
): Promise<{ success: boolean; subject?: Subject; error?: string }> {
  const session = await adminVerifySession(token);
  if (!session.success) {
    return { success: false, error: 'Unauthorized: Admin session expired or invalid.' };
  }

  if (!isSupabaseConfigured) {
    const current = getLocalStoredSubjects();
    const index = current.findIndex((s) => s.id === id);
    if (index === -1) return { success: false, error: 'Subject not found in database.' };
    const updatedSubject: Subject = {
      ...current[index],
      name: subjectInput.name.trim(),
      code: subjectInput.code ? subjectInput.code.trim().toUpperCase() : '',
      yearId: subjectInput.yearId,
      yearTitle: getYearTitle(subjectInput.yearId),
      semesterId: subjectInput.semesterId,
      semesterTitle: getSemesterTitle(subjectInput.semesterId),
      departments:
        subjectInput.departments && subjectInput.departments.length > 0
          ? subjectInput.departments
          : ['COMMON'],
      status: subjectInput.status || 'RESOURCES AVAILABLE',
      driveUrl: subjectInput.driveUrl ? subjectInput.driveUrl.trim() : '',
      description: subjectInput.description ? subjectInput.description.trim() : '',
      updatedAt: new Date().toISOString(),
    };
    current[index] = updatedSubject;
    saveLocalStoredSubjects(current);
    return { success: true, subject: updatedSubject };
  }

  try {
    const updates: Partial<Subject> = {
      name: subjectInput.name.trim(),
      code: subjectInput.code ? subjectInput.code.trim().toUpperCase() : '',
      yearId: subjectInput.yearId,
      yearTitle: getYearTitle(subjectInput.yearId),
      semesterId: subjectInput.semesterId,
      semesterTitle: getSemesterTitle(subjectInput.semesterId),
      departments:
        subjectInput.departments && subjectInput.departments.length > 0
          ? subjectInput.departments
          : ['COMMON'],
      status: subjectInput.status || 'RESOURCES AVAILABLE',
      driveUrl: subjectInput.driveUrl ? subjectInput.driveUrl.trim() : '',
      description: subjectInput.description ? subjectInput.description.trim() : '',
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('subjects')
      .update(subjectToRow(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: friendlyDbError(error, 'update subject') };
    return { success: true, subject: rowToSubject(data as SubjectRow) };
  } catch (err: any) {
    return { success: false, error: friendlyDbError(err, 'update subject') };
  }
}

export async function adminDeleteSubject(
  token: string,
  id: string
): Promise<{ success: boolean; error?: string }> {
  const session = await adminVerifySession(token);
  if (!session.success) {
    return { success: false, error: 'Unauthorized: Admin session expired or invalid.' };
  }

  if (!isSupabaseConfigured) {
    saveLocalStoredSubjects(getLocalStoredSubjects().filter((s) => s.id !== id));
    return { success: true };
  }

  try {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) return { success: false, error: friendlyDbError(error, 'delete subject') };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: friendlyDbError(err, 'delete subject') };
  }
}

// ----------------------------------------------------------------------------
// Unified API Client Export (same shape as before)
// ----------------------------------------------------------------------------
export const api = {
  getSubjects: async (): Promise<{ success: boolean; data: Subject[] }> => {
    const data = await fetchSubjects();
    return { success: true, data };
  },
  checkSession: async (): Promise<{ authenticated: boolean; admin?: AdminUser; token?: string }> => {
    const res = await adminVerifySession();
    if (res.success && res.user) {
      return { authenticated: true, admin: res.user, token: getStoredToken() ?? undefined };
    }
    return { authenticated: false };
  },
  login: adminLogin,
  verifySession: adminVerifySession,
  logout: async (): Promise<void> => {
    await adminLogout();
  },
  createSubject: adminCreateSubject,
  updateSubject: adminUpdateSubject,
  deleteSubject: adminDeleteSubject,
  resetToDefaults: resetSubjectsToMasterData,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
};