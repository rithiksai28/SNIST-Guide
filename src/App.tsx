import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GuideSection from './components/GuideSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import ResourceNoticeModal from './components/ResourceNoticeModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { AcademicYear, Semester, Subject, AdminUser } from './types';
import { getAllSubjects, buildAcademicYearsFromSubjects } from './data/academicData';
import { api, getLocalStoredSubjects } from './lib/api';

export default function App() {
  // Current view/route: '/' or '/admin'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/admin') ? '/admin' : '/';
    }
    return '/';
  });

  // Dynamic subjects list from browser-native localStorage (seeded with master data)
  const [subjects, setSubjects] = useState<Subject[]>(() => getLocalStoredSubjects());
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string>(() => api.getStoredToken() || '');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Academic hierarchy state
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
  const [noticeSubject, setNoticeSubject] = useState<Subject | null>(null);

  // Synchronize route with browser history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.startsWith('/admin') ? '/admin' : '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Fetch subjects from database API
  const refreshSubjects = useCallback(async () => {
    try {
      setLoadingSubjects(true);
      const res = await api.getSubjects();
      if (res.success && res.data && res.data.length > 0) {
        setSubjects(res.data);
      }
    } catch (err) {
      console.warn('Using local fallback academic subjects:', err);
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  // Check admin session and fetch subjects on mount
  useEffect(() => {
    refreshSubjects();

    const verifySession = async () => {
      try {
        setAuthChecking(true);
        const res = await api.checkSession();
        if (res.authenticated && res.admin && res.token) {
          setIsAdminAuthenticated(true);
          setAdminUser(res.admin);
          setAdminToken(res.token);
        } else {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
          setAdminToken('');
        }
      } catch (e) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
        setAdminToken('');
      } finally {
        setAuthChecking(false);
      }
    };

    verifySession();
  }, [refreshSubjects]);

  // Dynamically constructed academic years reflecting latest subjects
  const academicYears = useMemo(() => {
    return buildAcademicYearsFromSubjects(subjects);
  }, [subjects]);

  // Derived selected year and semester objects
  const selectedYear = useMemo(() => {
    if (!selectedYearId) return null;
    return academicYears.find((y) => y.id === selectedYearId) || null;
  }, [academicYears, selectedYearId]);

  const selectedSemester = useMemo(() => {
    if (!selectedYear || !selectedSemesterId) return null;
    return selectedYear.semesters.find((s) => s.id === selectedSemesterId) || null;
  }, [selectedYear, selectedSemesterId]);

  // Admin login success handler
  const handleLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminAuthenticated(true);
  };

  // Admin logout handler
  const handleAdminLogout = async () => {
    await api.logout();
    setAdminToken('');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  // Navigation handlers
  const handleScrollToGuide = () => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('guide');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const el = document.getElementById('guide');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateHome = () => {
    setSelectedYearId(null);
    setSelectedSemesterId(null);
    navigateTo('/');
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateGuide = () => {
    handleScrollToGuide();
  };

  const handleNavigateAbout = () => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectYear = (year: AcademicYear | null) => {
    setSelectedYearId(year ? year.id : null);
    setSelectedSemesterId(null);
  };

  const handleSelectSemester = (semester: Semester | null) => {
    setSelectedSemesterId(semester ? semester.id : null);
  };

  const handleSelectComingSoon = (subject: Subject) => {
    setNoticeSubject(subject);
  };

  const handleCloseNoticeModal = () => {
    setNoticeSubject(null);
  };

  // ==========================================================================
  // VIEW ROUTING: ADMIN ROUTE (/admin)
  // ==========================================================================
  if (currentPath === '/admin') {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
            <p className="font-mono text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Verifying Admin Session...
            </p>
          </div>
        </div>
      );
    }

    if (isAdminAuthenticated && adminUser && adminToken) {
      return (
        <AdminDashboard
          token={adminToken}
          adminUser={adminUser}
          subjects={subjects}
          onRefreshSubjects={refreshSubjects}
          onLogout={handleAdminLogout}
          onViewPublicWebsite={handleNavigateHome}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={handleNavigateHome}
      />
    );
  }

  // ==========================================================================
  // VIEW ROUTING: PUBLIC WEBSITE (/)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. Navigation Bar */}
      <Navbar
        onNavigateHome={handleNavigateHome}
        onNavigateGuide={handleNavigateGuide}
        onNavigateAbout={handleNavigateAbout}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onExploreClick={handleScrollToGuide} />

        {/* 3, 4, 5, 6, 7, 8. Guide Section (Years, Semesters, Subjects, Drive Link Redirection & Search) */}
        <GuideSection
          subjects={subjects}
          academicYears={academicYears}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onSelectYear={handleSelectYear}
          onSelectSemester={handleSelectSemester}
          onSelectComingSoon={handleSelectComingSoon}
        />

        {/* 9. About Section */}
        <AboutSection />
      </main>

      {/* 10. Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateGuide={handleNavigateGuide}
        onNavigateAbout={handleNavigateAbout}
        onSelectYear={(year) => {
          setSelectedYearId(year.id);
          setSelectedSemesterId(null);
        }}
        onNavigateAdmin={() => navigateTo('/admin')}
      />

      {/* Resource Coming Soon Dialog / Modal */}
      <ResourceNoticeModal
        subject={noticeSubject}
        onClose={handleCloseNoticeModal}
      />
    </div>
  );
}
