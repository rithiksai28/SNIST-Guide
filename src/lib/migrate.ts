// ============================================================================
// SNIST GUIDE - One-time catalog migration: localStorage -> Supabase
//
// HOW TO USE (one time only):
//   1. npm run dev  (with Supabase env vars set)
//   2. Log in as admin in the browser
//   3. Open DevTools console and run:  await migrateToSupabase()
//
// Safe to re-run: it UPSERTS (never deletes). Your local data is untouched.
// Priority: your edited localStorage catalog first, then the built-in master.
// ============================================================================
import { supabase, isSupabaseConfigured } from './supabase';
import { getAllSubjects } from '../data/academicData';
import type { Subject } from '../types';

const LOCAL_KEY = 'snist_academic_subjects_v3';

function collectSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[migrate] Using ${parsed.length} subjects from localStorage (your edited catalog).`);
        return parsed;
      }
    }
  } catch {}
  console.log('[migrate] No edited localStorage catalog found - using the built-in master catalog.');
  return getAllSubjects();
}

export async function migrateToSupabase(): Promise<number> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('Please log in as admin first, then run migrateToSupabase() again.');
  }

  const subjects = collectSubjects();
  const baseTime = Date.now();

  // Stagger created_at so the original catalog order is preserved
  // (public reads order by created_at DESC).
  const rows = subjects.map((s: any, i: number) => {
    const ts = new Date(baseTime - i * 1000).toISOString();
    return {
      id: String(s.id),
      name: String(s.name),
      code: s.code ?? null,
      departments: Array.isArray(s.departments) ? s.departments : ['COMMON'],
      status: s.status === 'COMING SOON' ? 'COMING SOON' : 'RESOURCES AVAILABLE',
      drive_url: s.driveUrl ?? '',
      category_tags: Array.isArray(s.categoryTags) ? s.categoryTags : [],
      description: s.description ?? null,
      semester_id: String(s.semesterId ?? ''),
      semester_title: String(s.semesterTitle ?? ''),
      year_id: String(s.yearId ?? ''),
      year_title: String(s.yearTitle ?? ''),
      created_at: s.createdAt ?? ts,
      updated_at: s.updatedAt ?? ts,
    };
  });

  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const { error } = await supabase.from('subjects').upsert(chunk, { onConflict: 'id' });
    if (error) throw new Error(`Migration failed: ${error.message}`);
  }

  console.log(`✅ [migrate] Successfully uploaded ${rows.length} subjects to Supabase.`);
  return rows.length;
}

// Expose in the browser console (dev only)
if (import.meta.env.DEV) {
  (window as any).migrateToSupabase = migrateToSupabase;
}