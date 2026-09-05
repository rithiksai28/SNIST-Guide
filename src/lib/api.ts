// ============================================================================
// SNIST GUIDE - Browser-Native LocalStorage Database & Auth Engine
// File: /src/lib/api.ts
//
// 100% Browser-Native Client Engine for Netlify Deployment.
// ZERO backend server, ZERO Express, ZERO Cloudflare, ZERO /api network requests.
// All public resources, search, filters, Google Drive links, and admin CMS
// operations are stored and persisted directly in the browser's localStorage.
// ============================================================================

import { Subject, SubjectInput, AdminAuthResponse, AdminUser } from '../types';
import { getAllSubjects } from '../data/academicData';

const TOKEN_KEY = 'snist_admin_token_v3';
const SUBJECTS_STORAGE_KEY = 'snist_academic_subjects_v3';
const ADMIN_CONFIG_KEY = 'snist_admin_config_v3';

// ----------------------------------------------------------------------------
// Local Storage Session & Token Helpers
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
// Admin Credentials Configuration
// ----------------------------------------------------------------------------
interface StoredAdminConfig {
  primaryEmail: string;
  secondaryEmail: string;
  primaryPassword: string;
  secondaryPassword: string;
  name: string;
}

function getStoredAdminConfig(): StoredAdminConfig {
  const defaults: StoredAdminConfig = {
    primaryEmail: 'rithiksai608060@gmail.com',
    secondaryEmail: 'admin@snistguide.edu',
    primaryPassword: 'Admin@SNIST2026!',
    secondaryPassword: 'admin123',
    name: 'SNIST Administrator',
  };

  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch {}

  return defaults;
}

export function saveAdminConfig(config: Partial<StoredAdminConfig>): void {
  try {
    const current = getStoredAdminConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));
  } catch {}
}

// ----------------------------------------------------------------------------
// Helper Formatters for Academic Titles
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
// Browser-Native Subjects Storage Engine
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

  // First time load: Seed with official comprehensive SNIST subject catalog
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
// Public Subject Fetching (Pure Browser-Native)
// ----------------------------------------------------------------------------
export async function fetchSubjects(): Promise<Subject[]> {
  // Directly loads from browser's persistent localStorage (seeded with master data)
  // No network request made, avoiding any Netlify HTML 404/200 rewrite issues.
  return getLocalStoredSubjects();
}

// ----------------------------------------------------------------------------
// Admin Authentication (Pure Browser-Native)
// ----------------------------------------------------------------------------
export async function adminLogin(email: string, pass: string): Promise<AdminAuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  const config = getStoredAdminConfig();
  const matchesPrimary =
    cleanEmail === config.primaryEmail.toLowerCase() && cleanPass === config.primaryPassword;
  const matchesSecondary =
    cleanEmail === config.secondaryEmail.toLowerCase() && cleanPass === config.secondaryPassword;
  const matchesFlexible =
    (cleanEmail === config.primaryEmail.toLowerCase() ||
      cleanEmail === config.secondaryEmail.toLowerCase()) &&
    (cleanPass === config.secondaryPassword || cleanPass === config.primaryPassword);

  if (matchesPrimary || matchesSecondary || matchesFlexible) {
    const localToken = `snist_admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    setStoredToken(localToken);

    const user: AdminUser = {
      email: cleanEmail,
      name: config.name,
      role: 'Administrator',
    };

    return {
      success: true,
      token: localToken,
      user,
    };
  }

  return {
    success: false,
    error: 'Invalid administrator credentials. Try admin@snistguide.edu / admin123 or rithiksai608060@gmail.com / Admin@SNIST2026!',
  };
}

export async function adminVerifySession(token: string): Promise<{ success: boolean; user?: AdminUser }> {
  if (!token) {
    clearStoredToken();
    return { success: false };
  }

  const stored = getStoredToken();
  if (stored && stored === token && token.startsWith('snist_admin_')) {
    const config = getStoredAdminConfig();
    return {
      success: true,
      user: {
        email: config.secondaryEmail,
        name: config.name,
        role: 'Administrator',
      },
    };
  }

  clearStoredToken();
  return { success: false };
}

export async function adminLogout(_token?: string): Promise<void> {
  clearStoredToken();
}

// ----------------------------------------------------------------------------
// Admin Subject Management (Pure Browser-Native CRUD)
// ----------------------------------------------------------------------------
export async function adminCreateSubject(
  token: string,
  subjectInput: SubjectInput
): Promise<{ success: boolean; subject?: Subject; error?: string }> {
  const session = await adminVerifySession(token);
  if (!session.success) {
    return { success: false, error: 'Unauthorized: Admin session expired or invalid.' };
  }

  try {
    const current = getLocalStoredSubjects();
    const newSubject: Subject = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newSubject, ...current];
    saveLocalStoredSubjects(updated);
    return { success: true, subject: newSubject };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save subject to storage.' };
  }
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

  try {
    const current = getLocalStoredSubjects();
    const index = current.findIndex((s) => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Subject not found in database.' };
    }

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
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update subject in storage.' };
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

  try {
    const current = getLocalStoredSubjects();
    const updated = current.filter((s) => s.id !== id);
    saveLocalStoredSubjects(updated);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove subject from storage.' };
  }
}

// ----------------------------------------------------------------------------
// Unified API Client Export
// ----------------------------------------------------------------------------
export const api = {
  getSubjects: async (): Promise<{ success: boolean; data: Subject[] }> => {
    const data = await fetchSubjects();
    return { success: true, data };
  },
  checkSession: async (): Promise<{ authenticated: boolean; admin?: AdminUser; token?: string }> => {
    const token = getStoredToken();
    if (!token) return { authenticated: false };
    const res = await adminVerifySession(token);
    if (res.success && res.user) {
      return { authenticated: true, admin: res.user, token };
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
