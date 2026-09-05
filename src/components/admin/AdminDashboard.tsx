// ============================================================================
// SNIST GUIDE - Administrator Management Dashboard
// File: /src/components/admin/AdminDashboard.tsx
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Filter,
  FolderOpen,
  Layers,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
  AlertTriangle,
  FolderSync,
  Download,
  RotateCcw,
} from 'lucide-react';
import { Subject, SubjectInput, AdminUser, ResourceStatus } from '../../types';
import { DEPARTMENTS_LIST } from '../../data/academicData';
import {
  adminCreateSubject,
  adminDeleteSubject,
  adminLogout,
  adminUpdateSubject,
  adminResetToMasterData,
} from '../../lib/api';

interface AdminDashboardProps {
  token: string;
  adminUser: AdminUser;
  subjects: Subject[];
  onRefreshSubjects: () => Promise<void>;
  onLogout: () => void;
  onViewPublicWebsite: () => void;
}

const YEAR_OPTIONS = [
  { id: 'first-year', label: 'First Year' },
  { id: 'second-year', label: 'Second Year' },
  { id: 'third-year', label: 'Third Year' },
  { id: 'fourth-year', label: 'Fourth Year' },
];

const SEMESTER_OPTIONS = [
  { id: 'sem-1', label: 'Semester I' },
  { id: 'sem-2', label: 'Semester II' },
];

export default function AdminDashboard({
  token,
  adminUser,
  subjects,
  onRefreshSubjects,
  onLogout,
  onViewPublicWebsite,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('manage');

  // Add Subject Form State
  const [addYear, setAddYear] = useState('first-year');
  const [addSemester, setAddSemester] = useState('sem-1');
  const [addName, setAddName] = useState('');
  const [addCode, setAddCode] = useState('');
  const [addDepartments, setAddDepartments] = useState<string[]>(['COMMON']);
  const [addStatus, setAddStatus] = useState<ResourceStatus>('RESOURCES AVAILABLE');
  const [addDriveUrl, setAddDriveUrl] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Manage Subjects Filter & Search State
  const [searchFilter, setSearchFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Edit Subject Modal State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editYear, setEditYear] = useState('first-year');
  const [editSemester, setEditSemester] = useState('sem-1');
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDepartments, setEditDepartments] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<ResourceStatus>('RESOURCES AVAILABLE');
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const total = subjects.length;
    const available = subjects.filter((s) => s.status === 'RESOURCES AVAILABLE').length;
    const comingSoon = total - available;
    return { total, available, comingSoon };
  }, [subjects]);

  // Filtered subjects for the Manage table
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      // Year filter
      if (yearFilter !== 'ALL' && s.yearId !== yearFilter) return false;

      // Department filter
      if (deptFilter !== 'ALL') {
        if (deptFilter === 'COMMON') {
          if (!s.departments.includes('COMMON')) return false;
        } else {
          // Specific department or common
          if (!s.departments.includes(deptFilter) && !s.departments.includes('COMMON')) {
            return false;
          }
        }
      }

      // Search term
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCode = s.code ? s.code.toLowerCase().includes(query) : false;
        const matchesDept = s.departments.some((d) => d.toLowerCase().includes(query));
        return matchesName || matchesCode || matchesDept;
      }

      return true;
    });
  }, [subjects, yearFilter, deptFilter, searchFilter]);

  // Handle department checkbox toggle for Add Form
  const toggleAddDepartment = (deptId: string) => {
    if (addDepartments.includes(deptId)) {
      if (addDepartments.length === 1) return; // Keep at least one
      setAddDepartments(addDepartments.filter((d) => d !== deptId));
    } else {
      setAddDepartments([...addDepartments, deptId]);
    }
  };

  // Handle department checkbox toggle for Edit Form
  const toggleEditDepartment = (deptId: string) => {
    if (editDepartments.includes(deptId)) {
      if (editDepartments.length === 1) return;
      setEditDepartments(editDepartments.filter((d) => d !== deptId));
    } else {
      setEditDepartments([...editDepartments, deptId]);
    }
  };

  // Submit Add Subject Form
  const handleAddSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!addName.trim()) {
      setFeedback({ type: 'error', message: 'Subject name is required.' });
      return;
    }
    if (addDepartments.length === 0) {
      setFeedback({ type: 'error', message: 'Please select at least one department.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const input: SubjectInput = {
        name: addName.trim(),
        code: addCode.trim().toUpperCase(),
        yearId: addYear,
        semesterId: addSemester,
        departments: addDepartments,
        status: addStatus,
        driveUrl: addDriveUrl.trim(),
        description: addDescription.trim(),
      };

      const res = await adminCreateSubject(token, input);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Subject "${addName}" created successfully! It is now live on the public website.`,
        });
        // Reset form
        setAddName('');
        setAddCode('');
        setAddDriveUrl('');
        setAddDescription('');
        setAddDepartments(['COMMON']);
        setAddStatus('RESOURCES AVAILABLE');

        await onRefreshSubjects();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create subject.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error occurred while saving.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditCode(subject.code || '');
    setEditYear(subject.yearId);
    setEditSemester(subject.semesterId.includes('sem-2') ? 'sem-2' : 'sem-1');
    setEditDepartments(subject.departments || ['COMMON']);
    setEditStatus(subject.status);
    setEditDriveUrl(subject.driveUrl || '');
    setEditDescription(subject.description || '');
  };

  // Submit Edit Form
  const handleEditSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    if (!editName.trim()) {
      alert('Subject name is required.');
      return;
    }

    setIsUpdating(true);
    try {
      const input: SubjectInput = {
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        yearId: editYear,
        semesterId: editSemester,
        departments: editDepartments,
        status: editStatus,
        driveUrl: editDriveUrl.trim(),
        description: editDescription.trim(),
      };

      const res = await adminUpdateSubject(token, editingSubject.id, input);
      if (res.success) {
        setEditingSubject(null);
        await onRefreshSubjects();
      } else {
        alert(res.error || 'Failed to update subject.');
      }
    } catch {
      alert('Network error while updating subject.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingSubject) return;

    setIsDeleting(true);
    try {
      const res = await adminDeleteSubject(token, deletingSubject.id);
      if (res.success) {
        setDeletingSubject(null);
        await onRefreshSubjects();
      } else {
        alert(res.error || 'Failed to delete subject.');
      }
    } catch {
      alert('Network error while deleting subject.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoutClick = async () => {
    await adminLogout(token);
    onLogout();
  };

  // Export Subjects as JSON backup file
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(subjects, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snist_subjects_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to generate export file.');
    }
  };

  // Reset to default SNIST catalog
  const handleResetCatalog = async () => {
    const ok = window.confirm(
      'Are you sure you want to restore the official SNIST subjects catalog? Any custom subjects you created will be reset to default.'
    );
    if (!ok) return;

        const result = await adminResetToMasterData();
    if (!result.success) {
      alert(`Reset failed: ${result.error}`);
      return;
    }
    await onRefreshSubjects();
    alert(`Catalog restored to the official SNIST master dataset (${result.count} subjects).`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body">
      {/* Top Admin Header Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicWebsite}
              className="font-display text-xl font-extrabold tracking-tight text-[#0A192F] hover:text-blue-600 transition flex items-center gap-2"
              title="Return to Public Website"
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>SNIST GUIDE</span>
            </button>
            <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase text-blue-700">
              ADMIN CMS
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicWebsite}
              className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Public Website
            </button>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">{adminUser.email}</span>
              <span className="text-[10px] text-slate-400">Authenticated Administrator</span>
            </div>

            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
              id="btn-admin-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Layers className="h-4 w-4" />
                <span>CONTENT MANAGEMENT SYSTEM</span>
              </div>
              <h1 className="font-display mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#0A192F]">
                SNIST GUIDE ADMIN
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back. Add, edit, and organize academic subjects, department tags, and Google Drive links in real time.
              </p>
            </div>

            {/* Quick Stats Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-center min-w-[100px]">
                <span className="block font-mono text-2xl font-black text-[#0A192F]">
                  {stats.total}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Subjects
                </span>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-center min-w-[100px]">
                <span className="block font-mono text-2xl font-black text-emerald-600">
                  {stats.available}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Available
                </span>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-center min-w-[100px]">
                <span className="block font-mono text-2xl font-black text-blue-600">
                  {stats.comingSoon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex border-b border-slate-200 gap-6">
            <button
              onClick={() => {
                setActiveTab('manage');
                setFeedback(null);
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                activeTab === 'manage'
                  ? 'border-[#0A192F] text-[#0A192F]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              2. Manage Subjects ({subjects.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                setFeedback(null);
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 inline-flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              1. Add Subject
            </button>
          </div>
        </div>

        {/* TAB 1: ADD SUBJECT FORM */}
        {activeTab === 'add' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="font-display text-xl font-bold text-[#0A192F]">
                Add New Academic Subject
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Newly added subjects are immediately committed to the database and will appear on the public website.
              </p>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`mb-6 flex items-start gap-3 rounded border p-4 text-xs font-medium ${
                  feedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleAddSubjectSubmit} className="space-y-6">
              {/* Year & Semester Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Academic Year *
                  </label>
                  <select
                    value={addYear}
                    onChange={(e) => setAddYear(e.target.value)}
                    className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                    required
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Semester *
                  </label>
                  <select
                    value={addSemester}
                    onChange={(e) => setAddSemester(e.target.value)}
                    className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                    required
                  >
                    {SEMESTER_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Name & Subject Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Engineering Mathematics - I or Cloud Computing"
                    className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subject Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={addCode}
                    onChange={(e) => setAddCode(e.target.value)}
                    placeholder="e.g. 22MA101BS"
                    className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-mono font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Multi-Select Departments */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Applicable Departments * (Select one or multiple)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Subjects tagged COMMON will be visible to students in all departments.
                </p>

                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEPARTMENTS_LIST.map((dept) => {
                    const isChecked = addDepartments.includes(dept.id);
                    return (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => toggleAddDepartment(dept.id)}
                        className={`flex items-center justify-between rounded border p-2.5 text-xs text-left transition shadow-xs ${
                          isChecked
                            ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                            : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span className="truncate">{dept.label}</span>
                        <span
                          className={`h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resource Status & Google Drive Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Resource Status *
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as ResourceStatus)}
                    className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                    required
                  >
                    <option value="RESOURCES AVAILABLE">RESOURCES AVAILABLE</option>
                    <option value="COMING SOON">COMING SOON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Google Drive Folder Link
                  </label>
                  <div className="relative mt-1.5 flex items-center">
                    <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <input
                      type="url"
                      value={addDriveUrl}
                      onChange={(e) => setAddDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full rounded border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Public students clicking "EXPLORE RESOURCES →" will open this link in a new tab.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Subject Description / Syllabus Overview (Optional)
                </label>
                <textarea
                  rows={2}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="Key topics, syllabus blueprint, module notes coverage..."
                  className="mt-1.5 w-full rounded border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Form Submit Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded bg-[#0A192F] px-6 py-3 text-xs font-bold tracking-widest uppercase text-white shadow-md transition hover:bg-blue-600 disabled:opacity-50"
                  id="btn-submit-add-subject"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      SAVING TO DATABASE...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      ADD SUBJECT
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE SUBJECTS TABLE & ACTIONS */}
        {activeTab === 'manage' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 top-2.5">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search stored subjects by name, code, or department..."
                  className="w-full rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Selects */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="ALL">All Years</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.label}
                    </option>
                  ))}
                </select>

                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  {DEPARTMENTS_LIST.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setActiveTab('add')}
                  className="inline-flex items-center gap-1.5 rounded bg-[#0A192F] px-3.5 py-2 text-xs font-bold tracking-wider uppercase text-white hover:bg-blue-600 transition shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Subject
                </button>
              </div>
            </div>

            {/* Results Count & Data Tools */}
            <div className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{filteredSubjects.length}</strong> of{' '}
                <strong className="text-slate-800">{subjects.length}</strong> subjects
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2.5 py-1 bg-white shadow-xs transition"
                  title="Download all subjects as JSON backup"
                >
                  <Download className="h-3 w-3 text-slate-500" />
                  Export JSON
                </button>
                <button
                  onClick={handleResetCatalog}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 border border-amber-200 rounded px-2.5 py-1 bg-amber-50/60 shadow-xs transition"
                  title="Restore original official SNIST catalog"
                >
                  <RotateCcw className="h-3 w-3 text-amber-600" />
                  Reset Catalog
                </button>
                <button
                  onClick={onRefreshSubjects}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded px-2.5 py-1 bg-blue-50/60 shadow-xs transition"
                >
                  <FolderSync className="h-3 w-3" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Responsive Table of Subjects */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4">Year & Semester</th>
                    <th className="py-3 px-4">Departments</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Google Drive Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.map((sub) => {
                    const isAvailable = sub.status === 'RESOURCES AVAILABLE';
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Code */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{sub.name}</div>
                          <div className="font-mono text-[10px] font-bold text-blue-600">
                            {sub.code || 'NO CODE'}
                          </div>
                        </td>

                        {/* Year & Semester */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{sub.yearTitle}</span>
                          <span className="block text-[11px] text-slate-400">{sub.semesterTitle}</span>
                        </td>

                        {/* Departments */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {sub.departments && sub.departments.length > 0 ? (
                              sub.departments.map((dept) => (
                                <span
                                  key={dept}
                                  className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                                    dept === 'COMMON'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {dept}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                              <Clock className="h-3 w-3 text-blue-500" />
                              Coming Soon
                            </span>
                          )}
                        </td>

                        {/* Google Drive Link */}
                        <td className="py-3.5 px-4">
                          {sub.driveUrl ? (
                            <a
                              href={sub.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-[150px] truncate text-[11px]"
                              title={sub.driveUrl}
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">Open Folder</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Not Set</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(sub)}
                              className="rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-xs"
                              title="Edit Subject"
                            >
                              <Edit2 className="h-3 w-3 inline mr-1 text-slate-500" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingSubject(sub)}
                              className="rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-100 transition shadow-xs"
                              title="Delete Subject"
                            >
                              <Trash2 className="h-3 w-3 inline mr-1 text-rose-600" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredSubjects.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-600">No matching subjects found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the search filter or add a new subject.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* EDIT SUBJECT MODAL */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A192F]">
                  Edit Subject: {editingSubject.name}
                </h3>
                <p className="text-xs text-slate-500">Update subject properties, departments, or Google Drive folder URL.</p>
              </div>
              <button
                onClick={() => setEditingSubject(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubjectSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Academic Year
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Semester
                  </label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                  >
                    {SEMESTER_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono font-medium text-slate-800 uppercase"
                  />
                </div>
              </div>

              {/* Department Multi-Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Departments (Multi-Select)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEPARTMENTS_LIST.map((dept) => {
                    const isChecked = editDepartments.includes(dept.id);
                    return (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => toggleEditDepartment(dept.id)}
                        className={`flex items-center justify-between rounded border p-2 text-xs text-left transition ${
                          isChecked
                            ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                            : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{dept.label}</span>
                        <span className={`text-[10px] ${isChecked ? 'text-blue-600 font-black' : 'text-transparent'}`}>
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resource Status & Drive Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Resource Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ResourceStatus)}
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                  >
                    <option value="RESOURCES AVAILABLE">RESOURCES AVAILABLE</option>
                    <option value="COMING SOON">COMING SOON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Google Drive Folder URL
                  </label>
                  <input
                    type="url"
                    value={editDriveUrl}
                    onChange={(e) => setEditDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded bg-[#0A192F] px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Are you sure you want to delete this subject?
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  You are about to delete <strong className="text-slate-800">{deletingSubject.name}</strong> ({deletingSubject.yearTitle} • {deletingSubject.semesterTitle}).
                  This action cannot be undone and will immediately remove the subject from the public platform.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
                className="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Delete Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
