import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Layers,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { AcademicYear, Semester, Subject } from '../types';
import {
  ACADEMIC_YEARS,
  DEPARTMENTS_LIST,
  filterSubjectsByDepartment,
  getAllSubjects,
  searchSubjects,
} from '../data/academicData';
import SubjectCard from './SubjectCard';

interface GuideSectionProps {
  subjects: Subject[];
  academicYears: AcademicYear[];
  selectedYear: AcademicYear | null;
  selectedSemester: Semester | null;
  onSelectYear: (year: AcademicYear | null) => void;
  onSelectSemester: (semester: Semester | null) => void;
  onSelectComingSoon: (subject: Subject) => void;
}

export default function GuideSection({
  subjects,
  academicYears,
  selectedYear,
  selectedSemester,
  onSelectYear,
  onSelectSemester,
  onSelectComingSoon,
}: GuideSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [semesterSearchQuery, setSemesterSearchQuery] = useState('');

  // Use dynamic subjects loaded from database
  const allSubjects = subjects;

  // Filtered global search results (searches by subject name, code, department, tags)
  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];
    return allSubjects.filter((sub) => {
      if (sub.name.toLowerCase().includes(trimmed)) return true;
      if (sub.code && sub.code.toLowerCase().includes(trimmed)) return true;
      if (sub.yearTitle.toLowerCase().includes(trimmed)) return true;
      if (sub.semesterTitle.toLowerCase().includes(trimmed)) return true;
      if (sub.departments.some((d) => d.toLowerCase().includes(trimmed))) return true;
      if (
        DEPARTMENTS_LIST.some(
          (cfg) =>
            cfg.fullName.toLowerCase().includes(trimmed) &&
            sub.departments.includes(cfg.id)
        )
      ) {
        return true;
      }
      if (sub.description && sub.description.toLowerCase().includes(trimmed)) return true;
      if (
        sub.categoryTags &&
        sub.categoryTags.some((tag) => tag.toLowerCase().includes(trimmed))
      ) {
        return true;
      }
      return false;
    });
  }, [searchQuery, allSubjects]);

  const isSearching = searchQuery.trim().length > 0;

  // Subjects filtered dynamically by department and in-semester search
  const displayedSemesterSubjects = useMemo(() => {
    if (!selectedSemester) return [];
    return searchSubjects(
      selectedSemester.subjects,
      semesterSearchQuery,
      selectedDepartment
    );
  }, [selectedSemester, semesterSearchQuery, selectedDepartment]);

  // Counts of subjects available per department in the current semester
  const departmentCounts = useMemo(() => {
    if (!selectedSemester) return {} as Record<string, number>;
    const counts: Record<string, number> = {
      ALL: selectedSemester.subjects.length,
    };
    for (const dept of DEPARTMENTS_LIST) {
      counts[dept.id] = filterSubjectsByDepartment(
        selectedSemester.subjects,
        dept.id
      ).length;
    }
    return counts;
  }, [selectedSemester]);

  const handleYearClick = (year: AcademicYear) => {
    setSearchQuery('');
    setSelectedDepartment('ALL');
    setSemesterSearchQuery('');
    onSelectYear(year);
    onSelectSemester(null);
  };

  const handleSemesterClick = (semester: Semester) => {
    setSelectedDepartment('ALL');
    setSemesterSearchQuery('');
    onSelectSemester(semester);
  };

  const handleResetToYears = () => {
    onSelectYear(null);
    onSelectSemester(null);
    setSearchQuery('');
    setSelectedDepartment('ALL');
    setSemesterSearchQuery('');
  };

  const handleResetToSemesters = () => {
    setSelectedDepartment('ALL');
    setSemesterSearchQuery('');
    onSelectSemester(null);
  };

  return (
    <section id="guide" className="relative border-b border-slate-200 bg-[#F8FAFC] py-16 sm:py-24">
      {/* Subtle dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 geometric-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            ACADEMIC NAVIGATION
          </span>

          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-[#0A192F] sm:text-4xl lg:text-5xl">
            CHOOSE YOUR YEAR
          </h2>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Navigate your academic journey with ease.
          </p>
        </div>

        {/* 8. SEARCH FEATURE - Prominently placed inside the Guide section */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="relative rounded-md border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-4 flex items-center text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search your subject... (e.g. Mathematics, PPS, Chemistry, Data Structures)"
                className="w-full rounded bg-transparent py-3 pl-12 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                id="guide-subject-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  aria-label="Clear search"
                  id="guide-search-clear-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {isSearching && (
            <p className="mt-2 text-center text-xs text-slate-500">
              Found <span className="font-bold text-[#0A192F]">{searchResults.length}</span> matching {searchResults.length === 1 ? 'subject' : 'subjects'}
            </p>
          )}
        </div>

        {/* Dynamic Display: SEARCH RESULTS vs BREADCRUMB / YEAR / SEMESTER HIERARCHY */}
        {isSearching ? (
          /* Live Search Results View */
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#0A192F]">
                  Search Results for "{searchQuery}"
                </h3>
                <p className="text-xs text-slate-500">
                  Click any subject to access resources or view availability
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                Back to Guide View
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onSelectComingSoon={onSelectComingSoon}
                    showContextMeta={true}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-slate-300 bg-white py-16 text-center shadow-xs">
                <Search className="mx-auto h-10 w-10 text-slate-400" />
                <h4 className="font-display mt-4 text-base font-bold text-slate-700">
                  No matching subjects found
                </h4>
                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
                  Try searching with terms like "Mathematics", "Physics", "Chemistry", "Graphics", or subject codes like "22MA101BS".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-5 rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Standard Hierarchical Navigation */
          <div className="mt-12">
            {/* Breadcrumb Bar */}
            {(selectedYear || selectedSemester) && (
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 shadow-xs"
              >
                <button
                  onClick={handleResetToYears}
                  className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                  id="breadcrumb-all-years"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Years
                </button>
                <ChevronRight className="h-4 w-4 text-slate-400" />

                {selectedYear && (
                  <button
                    onClick={handleResetToSemesters}
                    className={`rounded px-2.5 py-1 text-xs transition ${
                      selectedSemester
                        ? 'text-blue-600 hover:text-blue-700 font-medium'
                        : 'bg-blue-50 border border-blue-100 font-bold text-blue-600'
                    }`}
                    id="breadcrumb-selected-year"
                  >
                    {selectedYear.title}
                  </button>
                )}

                {selectedSemester && (
                  <>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-600">
                      {selectedSemester.title}
                    </span>
                  </>
                )}
              </nav>
            )}

            {/* LEVEL 1: YEAR SELECTION (when no year selected) */}
            {!selectedYear && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {academicYears.map((year) => {
                  const isAvailable = year.status === 'RESOURCES AVAILABLE';
                  return (
                    <div
                      key={year.id}
                      onClick={() => handleYearClick(year)}
                      className={`group relative flex cursor-pointer flex-col justify-between rounded border-x border-b border-slate-200 bg-white p-7 shadow-xs hover:shadow-xl transition-all duration-300 ${
                        isAvailable
                          ? 'border-t-4 border-t-blue-600 hover:-translate-y-1'
                          : 'border-t-4 border-t-slate-300 opacity-95 hover:-translate-y-1'
                      }`}
                      id={`year-card-${year.id}`}
                    >
                      {/* Top Number & Status Badge */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-5xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                            {year.displayNumber}
                          </span>
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 rounded border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              RESOURCES AVAILABLE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                              <Clock className="h-3 w-3 text-blue-500" />
                              COMING SOON
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-[#0A192F] group-hover:text-blue-600 transition">
                          {year.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                          {year.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <Layers className="h-3.5 w-3.5 text-blue-600" />
                          <span>{year.semesters.length} Semesters</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          className={`w-full py-2.5 rounded text-[11px] font-bold tracking-widest uppercase transition-colors shadow-xs ${
                            isAvailable
                              ? 'bg-[#0A192F] text-white hover:bg-blue-600'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                          }`}
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LEVEL 2: YEAR DASHBOARD (Year selected, no semester selected) */}
            {selectedYear && !selectedSemester && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-black text-blue-600">
                        {selectedYear.displayNumber}
                      </span>
                      <h3 className="font-display text-2xl font-black tracking-tight text-[#0A192F] sm:text-3xl">
                        {selectedYear.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      "{selectedYear.description}" — Select a semester to view subject resources.
                    </p>
                  </div>

                  <button
                    onClick={handleResetToYears}
                    className="inline-flex items-center gap-2 self-start rounded border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition sm:self-auto shadow-xs"
                    id="btn-back-to-all-years"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Years
                  </button>
                </div>

                {/* Semesters Cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {selectedYear.semesters.map((sem) => (
                    <div
                      key={sem.id}
                      onClick={() => handleSemesterClick(sem)}
                      className="group cursor-pointer rounded border-t-4 border-t-blue-600 border-x border-b border-slate-200 bg-white p-6 sm:p-8 transition-all hover:shadow-xl"
                      id={`semester-card-${sem.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {sem.shortTitle}
                        </span>
                        <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-600 font-semibold">
                          {sem.subjects.length} Subjects
                        </span>
                      </div>

                      <h4 className="font-display mt-4 text-2xl font-bold tracking-tight text-[#0A192F] group-hover:text-blue-600 transition">
                        {sem.title}
                      </h4>

                      <p className="mt-2 text-sm text-slate-500">
                        "{sem.description}"
                      </p>

                      <div className="mt-8">
                        <button
                          type="button"
                          className="w-full bg-[#0A192F] text-white py-3 rounded text-[11px] font-bold tracking-widest uppercase hover:bg-blue-600 transition-colors shadow-md"
                        >
                          Explore Semester →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL 3: SEMESTER SUBJECT DASHBOARD (Semester selected) */}
            {selectedYear && selectedSemester && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                {/* Header with back button */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        {selectedYear.title}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {selectedSemester.title}
                      </span>
                    </div>
                    <h3 className="font-display mt-1 text-2xl font-black tracking-tight text-[#0A192F] sm:text-3xl">
                      {selectedSemester.title} — YOUR SUBJECTS
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Click "EXPLORE RESOURCES →" to open the respective Google Drive folder in a new tab.
                    </p>
                  </div>

                  <button
                    onClick={handleResetToSemesters}
                    className="inline-flex items-center gap-2 self-start rounded border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition sm:self-auto shadow-xs"
                    id="btn-back-to-semesters"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Semesters
                  </button>
                </div>

                {/* DEPARTMENT FILTER & IN-SEMESTER SEARCH */}
                <div className="mt-6 flex flex-col gap-5 border-b border-slate-200 pb-6">
                  {/* Search Bar within Semester */}
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={semesterSearchQuery}
                      onChange={(e) => setSemesterSearchQuery(e.target.value)}
                      placeholder={`Search by subject name or department in ${selectedSemester.shortTitle}... (e.g. Mathematics, DS, CSE, Graphics)`}
                      className="w-full rounded border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                      id="semester-subject-search-input"
                    />
                    {semesterSearchQuery && (
                      <button
                        onClick={() => setSemesterSearchQuery('')}
                        className="absolute right-3 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                        aria-label="Clear semester search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Department Filtering Bar */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                        <Filter className="h-3.5 w-3.5 text-blue-600" />
                        <span>Filter by Department:</span>
                      </div>
                      {(selectedDepartment !== 'ALL' || semesterSearchQuery) && (
                        <button
                          onClick={() => {
                            setSelectedDepartment('ALL');
                            setSemesterSearchQuery('');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>

                    {/* Department Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                      {/* ALL option */}
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment('ALL')}
                        className={`group inline-flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all shadow-xs ${
                          selectedDepartment === 'ALL'
                            ? 'bg-[#0A192F] text-white shadow-sm ring-2 ring-[#0A192F]/20'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        id="filter-dept-ALL"
                      >
                        <span>ALL</span>
                        <span
                          className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                            selectedDepartment === 'ALL'
                              ? 'bg-blue-500/30 text-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {departmentCounts['ALL'] || 0}
                        </span>
                      </button>

                      {/* Each Department from DEPARTMENTS_LIST */}
                      {DEPARTMENTS_LIST.map((dept) => {
                        const isSelected = selectedDepartment === dept.id;
                        const count = departmentCounts[dept.id] || 0;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => setSelectedDepartment(dept.id)}
                            title={dept.fullName}
                            className={`group inline-flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all shadow-xs ${
                              isSelected
                                ? 'bg-[#0A192F] text-white shadow-sm ring-2 ring-[#0A192F]/20'
                                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                            id={`filter-dept-${dept.id}`}
                          >
                            <span>{dept.label}</span>
                            <span
                              className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                                isSelected
                                  ? 'bg-blue-500/30 text-blue-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-0.5">
                    <span>
                      Showing <strong className="text-[#0A192F]">{displayedSemesterSubjects.length}</strong> of{' '}
                      <strong className="text-slate-700">{selectedSemester.subjects.length}</strong> subjects
                      {selectedDepartment !== 'ALL' && (
                        <>
                          {' '}
                          for <span className="font-bold text-blue-600">{selectedDepartment}</span>
                          {selectedDepartment !== 'COMMON' && ' (including COMMON subjects)'}
                        </>
                      )}
                      {semesterSearchQuery && (
                        <>
                          {' '}
                          matching "<span className="font-medium text-slate-800">{semesterSearchQuery}</span>"
                        </>
                      )}
                    </span>

                    {selectedDepartment !== 'ALL' && selectedDepartment !== 'COMMON' && (
                      <span className="text-[11px] text-slate-400">
                        *Subjects common across branches appear for all departments.
                      </span>
                    )}
                  </div>
                </div>

                {/* Subjects Grid or Empty State */}
                {displayedSemesterSubjects.length > 0 ? (
                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {displayedSemesterSubjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        onSelectComingSoon={onSelectComingSoon}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-400" />
                    <h4 className="font-display mt-3 text-sm font-bold text-slate-700">
                      No subjects found
                    </h4>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                      No subjects in {selectedSemester.shortTitle} match your current filter
                      {selectedDepartment !== 'ALL' ? ` (${selectedDepartment})` : ''}
                      {semesterSearchQuery ? ` and search term "${semesterSearchQuery}"` : ''}.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDepartment('ALL');
                        setSemesterSearchQuery('');
                      }}
                      className="mt-4 rounded bg-[#0A192F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition shadow-xs"
                    >
                      Reset Department & Search Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
