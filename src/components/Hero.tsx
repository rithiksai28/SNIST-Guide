import { ArrowRight, BookMarked, FolderGit2, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24 geometric-dot-grid">
      {/* Subtle radial glow accent */}
      <div className="pointer-events-none absolute inset-0 geometric-subtle-glow" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Subtle student platform pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Independent Academic Resource Dashboard</span>
          </div>

          {/* Large Subtitle / Platform Name */}
          <p className="font-display mt-4 text-xs font-bold tracking-[0.25em] text-slate-500 sm:text-sm uppercase">
            SNIST GUIDE
          </p>

          {/* Main Headline: STUDY SMART. SCORE BETTER. */}
          <h1 className="font-display mt-3 text-4xl font-black tracking-tight text-[#0A192F] sm:text-6xl md:text-7xl lg:text-8xl leading-none">
            <span>STUDY SMART. </span>
            <span className="text-blue-600">SCORE BETTER.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl font-medium leading-relaxed">
            Your academic resources, organised in one place.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-400 sm:text-sm">
            Designed for students of SNIST to navigate years, semesters, and subjects directly to curated Google Drive study folders.
          </p>

          {/* Call to Action Button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onExploreClick}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-blue-600 px-8 py-3.5 text-sm font-bold text-white tracking-wide shadow-md shadow-blue-900/20 transition hover:bg-blue-700 active:scale-98 sm:w-auto"
              id="hero-explore-cta"
            >
              <span>EXPLORE THE GUIDE</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Trust & Architecture Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 sm:grid-cols-4">
            <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="block text-2xl font-black text-[#0A192F]">04</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">Academic Years</span>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="block text-2xl font-black text-[#0A192F]">08</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">Semesters Covered</span>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="block text-2xl font-black text-blue-600">Cloud</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">Google Drive Folders</span>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="block text-2xl font-black text-emerald-600">Instant</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">Zero Sign-in Needed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
