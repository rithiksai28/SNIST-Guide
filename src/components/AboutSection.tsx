import { FolderCheck, Heart, ShieldAlert, Sparkles, Users, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative border-b border-slate-200 bg-white py-16 sm:py-24 geometric-dot-grid">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 geometric-subtle-glow opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <Users className="h-3.5 w-3.5" />
            INDEPENDENT INITIATIVE
          </span>

          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-[#0A192F] sm:text-4xl lg:text-5xl">
            BUILT BY STUDENTS. FOR STUDENTS.
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed font-medium">
            "SNIST Guide is an independent student-built platform designed to make academic resources easier to find, access and organise."
          </p>

          <p className="font-display mt-3 text-xl font-bold tracking-wide text-blue-600">
            Study smarter. Score better.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 border border-blue-100 text-blue-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display mt-5 text-lg font-bold text-[#0A192F]">
              Zero Friction Navigation
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              No slow login portals, forgotten passwords, or cumbersome interfaces. Reach your year, semester, and subject in less than three clicks.
            </p>
          </div>

          <div className="rounded border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 border border-blue-100 text-blue-600">
              <FolderCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display mt-5 text-lg font-bold text-[#0A192F]">
              Curated Google Drive Folders
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Resources are hosted directly in well-maintained Google Drive repositories. View lecture slides, lab manuals, and previous papers in a high-speed cloud drive.
            </p>
          </div>

          <div className="rounded border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 border border-blue-100 text-blue-600">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display mt-5 text-lg font-bold text-[#0A192F]">
              Student-First Community
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Created to eliminate the stressful scramble before semester exams. Built cleanly to support first year to final year engineers.
            </p>
          </div>
        </div>

        {/* Official Affiliation Disclaimer Box */}
        <div className="mx-auto mt-12 max-w-3xl rounded border border-slate-200 bg-slate-50 p-5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4 text-slate-500" />
            <span>Important Independence Notice</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            SNIST Guide is an independent student-built initiative and is <strong className="text-slate-800">not officially affiliated with, endorsed by, or sponsored by Sreenidhi Institute of Science and Technology (SNIST)</strong>. All academic trademarks and course titles belong to their respective institutions.
          </p>
        </div>
      </div>
    </section>
  );
}
