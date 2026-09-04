-- ============================================================================
-- SNIST GUIDE - Cloudflare D1 Relational Schema
-- Migration: 0001_initial_schema.sql
-- ============================================================================

-- 1. Departments Master Table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL
);

-- 2. Academic Years Master Table
CREATE TABLE IF NOT EXISTS academic_years (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  display_number TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1
);

-- 3. Semesters Master Table
CREATE TABLE IF NOT EXISTS semesters (
  id TEXT PRIMARY KEY,
  year_id TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 4. Subjects Main Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT DEFAULT '',
  year_id TEXT NOT NULL,
  year_title TEXT NOT NULL,
  semester_id TEXT NOT NULL,
  semester_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RESOURCES AVAILABLE',
  drive_url TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (year_id) REFERENCES academic_years(id) ON DELETE RESTRICT
);

-- 5. Relational Junction Table for Multi-Department Mapping
-- Enables a single subject to belong to multiple departments (e.g. COMMON, DS, CSE, AIML)
CREATE TABLE IF NOT EXISTS subject_departments (
  subject_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (subject_id, department_id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 6. Administrator Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. Administrator Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- Performance Indexing
CREATE INDEX IF NOT EXISTS idx_subjects_year_sem ON subjects(year_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_subjects_status ON subjects(status);
CREATE INDEX IF NOT EXISTS idx_subject_departments_dept ON subject_departments(department_id);
CREATE INDEX IF NOT EXISTS idx_subject_departments_sub ON subject_departments(subject_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
