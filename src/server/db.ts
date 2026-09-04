// ============================================================================
// Server Relational Database Storage Engine (D1-Compatible Local Store)
// File: /src/server/db.ts
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Subject, SubjectInput } from '../types';
import { ACADEMIC_YEARS, DEPARTMENTS_LIST, getAllSubjects } from '../data/academicData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface StoredSubject {
  id: string;
  name: string;
  code: string;
  year_id: string;
  year_title: string;
  semester_id: string;
  semester_title: string;
  status: 'RESOURCES AVAILABLE' | 'COMING SOON';
  drive_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StoredSubjectDepartment {
  subject_id: string;
  department_id: string;
}

export interface StoredAdminSession {
  token: string;
  email: string;
  created_at: string;
  expires_at: string;
}

interface DatabaseSchema {
  subjects: StoredSubject[];
  subject_departments: StoredSubjectDepartment[];
  admin_sessions: StoredAdminSession[];
}

class DatabaseManager {
  private data: DatabaseSchema = {
    subjects: [],
    subject_departments: [],
    admin_sessions: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading database.json, re-seeding...', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private seedInitialData() {
    console.log('Seeding initial SNIST GUIDE academic subjects into database...');
    const initialSubjects = getAllSubjects();
    const storedSubjects: StoredSubject[] = [];
    const storedDepts: StoredSubjectDepartment[] = [];

    const now = new Date().toISOString();

    for (const sub of initialSubjects) {
      storedSubjects.push({
        id: sub.id,
        name: sub.name,
        code: sub.code || '',
        year_id: sub.yearId,
        year_title: sub.yearTitle,
        semester_id: sub.semesterId,
        semester_title: sub.semesterTitle,
        status: sub.status,
        drive_url: sub.driveUrl,
        description: sub.description || '',
        created_at: now,
        updated_at: now,
      });

      for (const dept of sub.departments || []) {
        storedDepts.push({
          subject_id: sub.id,
          department_id: dept,
        });
      }
    }

    this.data = {
      subjects: storedSubjects,
      subject_departments: storedDepts,
      admin_sessions: [],
    };

    this.persist();
  }

  // --------------------------------------------------------------------------
  // PUBLIC READ OPERATIONS
  // --------------------------------------------------------------------------
  public getPublicSubjects(): Subject[] {
    // Relational join: subjects + subject_departments
    return this.data.subjects.map((sub) => {
      const depts = this.data.subject_departments
        .filter((sd) => sd.subject_id === sub.id)
        .map((sd) => sd.department_id);

      return {
        id: sub.id,
        name: sub.name,
        code: sub.code,
        yearId: sub.year_id,
        yearTitle: sub.year_title,
        semesterId: sub.semester_id,
        semesterTitle: sub.semester_title,
        departments: depts,
        status: sub.status,
        driveUrl: sub.drive_url,
        description: sub.description,
        createdAt: sub.created_at,
        updatedAt: sub.updated_at,
      };
    });
  }

  // --------------------------------------------------------------------------
  // ADMIN MUTATION OPERATIONS
  // --------------------------------------------------------------------------
  public createSubject(input: SubjectInput): Subject {
    const id = 'sub-' + Date.now().toString(36) + '-' + crypto.randomBytes(3).toString('hex');
    const now = new Date().toISOString();

    const yearTitle =
      input.yearId === 'first-year'
        ? 'First Year'
        : input.yearId === 'second-year'
        ? 'Second Year'
        : input.yearId === 'third-year'
        ? 'Third Year'
        : 'Fourth Year';

    const semesterTitle =
      input.semesterId === 'sem-1' || input.semesterId.includes('sem-1')
        ? 'Semester I'
        : 'Semester II';

    const newSubject: StoredSubject = {
      id,
      name: input.name.trim(),
      code: (input.code || '').trim().toUpperCase(),
      year_id: input.yearId,
      year_title: yearTitle,
      semester_id: input.semesterId,
      semester_title: semesterTitle,
      status: input.status,
      drive_url: (input.driveUrl || '').trim(),
      description: (input.description || '').trim(),
      created_at: now,
      updated_at: now,
    };

    this.data.subjects.push(newSubject);

    // Add multi-department junction mappings
    for (const dept of input.departments) {
      this.data.subject_departments.push({
        subject_id: id,
        department_id: dept,
      });
    }

    this.persist();

    return {
      id,
      name: newSubject.name,
      code: newSubject.code,
      yearId: newSubject.year_id,
      yearTitle: newSubject.year_title,
      semesterId: newSubject.semester_id,
      semesterTitle: newSubject.semester_title,
      departments: input.departments,
      status: newSubject.status,
      driveUrl: newSubject.drive_url,
      description: newSubject.description,
      createdAt: newSubject.created_at,
      updatedAt: newSubject.updated_at,
    };
  }

  public updateSubject(id: string, input: SubjectInput): Subject | null {
    const index = this.data.subjects.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const existing = this.data.subjects[index];

    const yearTitle =
      input.yearId === 'first-year'
        ? 'First Year'
        : input.yearId === 'second-year'
        ? 'Second Year'
        : input.yearId === 'third-year'
        ? 'Third Year'
        : 'Fourth Year';

    const semesterTitle =
      input.semesterId === 'sem-1' || input.semesterId.includes('sem-1')
        ? 'Semester I'
        : 'Semester II';

    this.data.subjects[index] = {
      ...existing,
      name: input.name.trim(),
      code: (input.code || '').trim().toUpperCase(),
      year_id: input.yearId,
      year_title: yearTitle,
      semester_id: input.semesterId,
      semester_title: semesterTitle,
      status: input.status,
      drive_url: (input.driveUrl || '').trim(),
      description: (input.description || '').trim(),
      updated_at: now,
    };

    // Remove existing department mappings and re-insert new ones
    this.data.subject_departments = this.data.subject_departments.filter(
      (sd) => sd.subject_id !== id
    );

    for (const dept of input.departments) {
      this.data.subject_departments.push({
        subject_id: id,
        department_id: dept,
      });
    }

    this.persist();

    return {
      id,
      name: this.data.subjects[index].name,
      code: this.data.subjects[index].code,
      yearId: this.data.subjects[index].year_id,
      yearTitle: this.data.subjects[index].year_title,
      semesterId: this.data.subjects[index].semester_id,
      semesterTitle: this.data.subjects[index].semester_title,
      departments: input.departments,
      status: this.data.subjects[index].status,
      driveUrl: this.data.subjects[index].drive_url,
      description: this.data.subjects[index].description,
      createdAt: this.data.subjects[index].created_at,
      updatedAt: this.data.subjects[index].updated_at,
    };
  }

  public deleteSubject(id: string): boolean {
    const initialLen = this.data.subjects.length;
    this.data.subjects = this.data.subjects.filter((s) => s.id !== id);
    this.data.subject_departments = this.data.subject_departments.filter(
      (sd) => sd.subject_id !== id
    );

    if (this.data.subjects.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION SESSIONS
  // --------------------------------------------------------------------------
  public createSession(email: string): string {
    const token = 'snist_' + crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    this.data.admin_sessions.push({
      token,
      email,
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
    });

    this.persist();
    return token;
  }

  public validateSession(token: string): string | null {
    if (!token) return null;
    const session = this.data.admin_sessions.find((s) => s.token === token);
    if (!session) return null;

    if (new Date(session.expires_at).getTime() < Date.now()) {
      // Expired
      this.destroySession(token);
      return null;
    }

    return session.email;
  }

  public destroySession(token: string) {
    this.data.admin_sessions = this.data.admin_sessions.filter((s) => s.token !== token);
    this.persist();
  }
}

export const db = new DatabaseManager();
