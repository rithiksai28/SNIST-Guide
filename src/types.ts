export type ResourceStatus = 'RESOURCES AVAILABLE' | 'COMING SOON';

export type DepartmentCode =
  | 'COMMON'
  | 'DS'
  | 'CSE'
  | 'AIML'
  | 'ECE'
  | 'EEE'
  | 'MECHANICAL'
  | 'CIVIL'
  | string;

export interface DepartmentConfig {
  id: string;
  label: string;
  fullName: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  departments: string[]; // List of departments (e.g. ['COMMON', 'DS', 'CSE', 'AIML'])
  status: ResourceStatus;
  driveUrl: string;
  categoryTags?: string[];
  description?: string;
  semesterId: string;
  semesterTitle: string;
  yearId: string;
  yearTitle: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectInput {
  name: string;
  code?: string;
  yearId: string;
  semesterId: string;
  departments: string[];
  status: ResourceStatus;
  driveUrl: string;
  description?: string;
}

export interface AdminUser {
  email: string;
  role: string;
  name?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}


export interface Semester {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  subjects: Subject[];
}

export interface AcademicYear {
  id: string;
  yearNumber: number;
  displayNumber: string;
  title: string;
  description: string;
  status: ResourceStatus;
  semesters: Semester[];
}

export interface GuideBreadcrumb {
  label: string;
  action?: () => void;
}
