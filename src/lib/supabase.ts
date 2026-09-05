// Supabase client for SNIST Guide.
// Credentials come from Vite env vars — NEVER hardcode keys here.
// Only the ANON key is used (safe for browsers, protected by RLS).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Placeholder values only prevent a crash at import time when env is missing
// (e.g. fresh clone). All DB calls are guarded by isSupabaseConfigured.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'missing-anon-key'
);