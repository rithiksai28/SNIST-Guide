import { useState } from 'react';
import { GraduationCap, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateGuide: () => void;
  onNavigateAbout: () => void;
}

export default function Navbar({
  onNavigateHome,
  onNavigateGuide,
  onNavigateAbout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string, callback?: () => void) => {
    setMobileMenuOpen(false);
    if (callback) {
      callback();
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A192F] text-white shadow-lg transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => scrollTo('hero', onNavigateHome)}
          className="group flex items-center gap-3 text-left focus:outline-none"
          id="navbar-brand-button"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-600 font-bold text-lg text-white shadow-sm transition group-hover:bg-blue-500">
            S
          </div>
          <div>
            <span className="font-display block text-lg font-bold tracking-tight text-white">
              SNIST <span className="text-blue-400 uppercase font-bold">Guide</span>
            </span>
            <span className="hidden font-body text-[9px] font-bold tracking-widest text-slate-400 sm:block uppercase">
              Academic Dashboard
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollTo('hero', onNavigateHome)}
            className="text-[11px] font-bold tracking-widest text-slate-300 transition-colors hover:text-white"
            id="nav-link-home"
          >
            HOME
          </button>
          <button
            onClick={() => scrollTo('guide', onNavigateGuide)}
            className="text-[11px] font-bold tracking-widest text-slate-300 transition-colors hover:text-white"
            id="nav-link-guide"
          >
            GUIDE
          </button>
          <button
            onClick={() => scrollTo('about', onNavigateAbout)}
            className="text-[11px] font-bold tracking-widest text-slate-300 transition-colors hover:text-white"
            id="nav-link-about"
          >
            ABOUT
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => scrollTo('guide', onNavigateGuide)}
            className="group inline-flex items-center gap-2 rounded-sm bg-blue-600 px-5 py-2.5 text-xs font-bold text-white tracking-wide shadow-md shadow-blue-950/20 transition hover:bg-blue-700 active:scale-98"
            id="nav-cta-explore"
          >
            <span>EXPLORE GUIDE</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-sm border border-slate-700/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0A192F] px-4 pt-3 pb-6 md:hidden">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollTo('hero', onNavigateHome)}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-xs font-bold tracking-wider text-slate-200 hover:bg-slate-800"
              id="mobile-nav-home"
            >
              <span>HOME</span>
            </button>
            <button
              onClick={() => scrollTo('guide', onNavigateGuide)}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-xs font-bold tracking-wider text-slate-200 hover:bg-slate-800"
              id="mobile-nav-guide"
            >
              <span>GUIDE</span>
            </button>
            <button
              onClick={() => scrollTo('about', onNavigateAbout)}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-xs font-bold tracking-wider text-slate-200 hover:bg-slate-800"
              id="mobile-nav-about"
            >
              <span>ABOUT</span>
            </button>
            <div className="pt-2">
              <button
                onClick={() => scrollTo('guide', onNavigateGuide)}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700"
                id="mobile-cta-explore"
              >
                <span>EXPLORE GUIDE</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
