import { GraduationCap, ArrowUpRight } from 'lucide-react';
import { AcademicYear } from '../types';
import { ACADEMIC_YEARS } from '../data/academicData';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateGuide: () => void;
  onNavigateAbout: () => void;
  onSelectYear: (year: AcademicYear) => void;
  onNavigateAdmin: () => void;
}

// ============================================================================
// CREATOR CONFIGURATION
// To attach a LinkedIn profile, replace the empty string with the profile URL.
// Example: 'https://www.linkedin.com/in/your-profile-name'
// ============================================================================
const CREATOR_CONFIG = {
  name: 'Rithik Sai',
  role: 'Designed & Developed by',
  department: 'Data Science Department, SNIST',
  linkedInUrl: '', // Add LinkedIn profile URL here (e.g., 'https://www.linkedin.com/in/...')
};

export default function Footer({
  onNavigateHome,
  onNavigateGuide,
  onNavigateAbout,
  onSelectYear,
  onNavigateAdmin,
}: FooterProps) {
  const scrollTo = (id: string, callback?: () => void) => {
    if (callback) callback();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleYearJump = (year: AcademicYear) => {
    onSelectYear(year);
    const element = document.getElementById('guide');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#0A192F] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand & Tagline */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 font-bold text-base text-white">
                S
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SNIST <span className="text-blue-400 uppercase font-bold">Guide</span>
              </span>
            </div>

            <p className="font-display text-xs font-bold tracking-widest text-blue-400">
              STUDY SMART. SCORE BETTER.
            </p>

            <p className="max-w-md text-xs text-slate-400 leading-relaxed">
              An independent student-built academic resource navigation platform. Helping students navigate courses, semesters, and direct Google Drive folders with zero hassle.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('hero', onNavigateHome)}
                  className="hover:text-white transition"
                  id="footer-link-home"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('guide', onNavigateGuide)}
                  className="hover:text-white transition"
                  id="footer-link-guide"
                >
                  Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about', onNavigateAbout)}
                  className="hover:text-white transition"
                  id="footer-link-about"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Years Quick Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Academic Years
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {ACADEMIC_YEARS.map((year) => (
                <li key={year.id}>
                  <button
                    onClick={() => handleYearJump(year)}
                    className="flex items-center gap-1.5 hover:text-white transition text-left"
                    id={`footer-link-${year.id}`}
                  >
                    <span>{year.title}</span>
                    {year.status === 'RESOURCES AVAILABLE' && (
                      <span className="rounded border border-emerald-500/20 bg-emerald-950/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 uppercase">
                        Available
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Creator Attribution Section (Subtle & Professional) */}
        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1.5 sm:gap-2 text-center sm:text-left">
            <span className="text-slate-400 text-xs">
              {CREATOR_CONFIG.role}
            </span>
            {CREATOR_CONFIG.linkedInUrl ? (
              <a
                href={CREATOR_CONFIG.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-blue-400 transition-colors duration-200"
                id="creator-credit-link"
                title={`View ${CREATOR_CONFIG.name}'s LinkedIn Profile`}
              >
                <span className="underline decoration-slate-600 underline-offset-4 group-hover:decoration-blue-400 transition-colors">
                  {CREATOR_CONFIG.name}
                </span>
                <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <span
                className="group inline-flex items-center font-semibold text-slate-300 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                id="creator-credit-name"
                title={`${CREATOR_CONFIG.name} — ${CREATOR_CONFIG.department}`}
              >
                <span className="transition-colors border-b border-transparent hover:border-blue-400/50">
                  {CREATOR_CONFIG.name}
                </span>
              </span>
            )}
            <span className="hidden sm:inline text-slate-600 text-xs">•</span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              {CREATOR_CONFIG.department}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            Independent initiative • Not officially affiliated with SNIST
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-4 pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 SNIST GUIDE. An independent student-built academic resource platform.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateAdmin}
              className="text-[11px] text-slate-400/80 hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
              id="footer-admin-link"
              title="Administrator Content Management System"
            >
              Admin Access
            </button>
            <span className="text-slate-700">•</span>
            <p className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
              STUDY SMART. SCORE BETTER.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

