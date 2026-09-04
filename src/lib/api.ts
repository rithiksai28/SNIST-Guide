// ============================================================================
// Frontend API Client for SNIST GUIDE
// File: /src/lib/api.ts
// ============================================================================

import { Subject, SubjectInput, AdminAuthResponse, AdminUser } from '../types';
import { getAllSubjects } from '../data/academicData';

const TOKEN_KEY = 'snist_admin_token';

// ----------------------------------------------------------------------------
// Token Storage Helpers
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
// Public Subject Fetching
// ----------------------------------------------------------------------------
export async function fetchSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch('/api/subjects');
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    if (data.success && Array.isArray(data.subjects)) {
      return data.subjects;
    }
    return getAllSubjects();
  } catch (err) {
    console.warn('Backend API request failed, falling back to static cache:', err);
    return getAllSubjects();
  }
}

// ----------------------------------------------------------------------------
// Admin Authentication
// ----------------------------------------------------------------------------
export async function adminLogin(email: string, pass: string): Promise<AdminAuthResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setStoredToken(data.token);
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: data.error || 'Invalid administrator credentials.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during login.' };
  }
}

export async function adminVerifySession(token: string): Promise<{ success: boolean; user?: AdminUser }> {
  try {
    const res = await fetch('/api/admin/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      clearStoredToken();
      return { success: false };
    }
    const data = await res.json();
    return { success: true, user: data.user };
  } catch {
    return { success: false };
  }
}

export async function adminLogout(token: string): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } finally {
    clearStoredToken();
  }
}

// ----------------------------------------------------------------------------
// Admin Subject Management (Protected Operations)
// ----------------------------------------------------------------------------
export async function adminCreateSubject(
  token: string,
  subjectInput: SubjectInput
): Promise<{ success: boolean; subject?: Subject; error?: string }> {
  try {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subjectInput),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, subject: data.subject };
    }
    return { success: false, error: data.error || 'Failed to create subject.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error creating subject.' };
  }
}

export async function adminUpdateSubject(
  token: string,
  id: string,
  subjectInput: SubjectInput
): Promise<{ success: boolean; subject?: Subject; error?: string }> {
  try {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subjectInput),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, subject: data.subject };
    }
    return { success: false, error: data.error || 'Failed to update subject.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error updating subject.' };
  }
}

export async function adminDeleteSubject(
  token: string,
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true };
    }
    return { success: false, error: data.error || 'Failed to delete subject.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error deleting subject.' };
  }
}

// ----------------------------------------------------------------------------
// Unified API Client Object
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
    const token = getStoredToken();
    if (token) {
      await adminLogout(token);
    } else {
      clearStoredToken();
    }
  },
  createSubject: adminCreateSubject,
  updateSubject: adminUpdateSubject,
  deleteSubject: adminDeleteSubject,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
};
