import { ArrowRight, CheckCircle2, Clock, FolderOpen } from 'lucide-react';
import { Subject } from '../types';

interface SubjectCardProps {
  key?: string;
  subject: Subject;
  onSelectComingSoon: (subject: Subject) => void;
  showContextMeta?: boolean; // When rendered inside search results, show Year/Semester context
}

export default function SubjectCard({
  subject,
  onSelectComingSoon,
  showContextMeta = false,
}: SubjectCardProps) {
  const isAvailable = subject.status === 'RESOURCES AVAILABLE';

  const handleClick = () => {
    if (isAvailable && subject.driveUrl) {
      window.open(subject.driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelectComingSoon(subject);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded border p-5 transition-all duration-200 bg-white ${
        isAvailable
          ? 'border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-lg'
          : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
      }`}
      id={`subject-card-${subject.id}`}
    >
      <div>
        {/* Context metadata (useful in search mode) */}
        {showContextMeta && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {subject.yearTitle}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {subject.semesterTitle}
            </span>
          </div>
        )}

        {/* Top Status & Code Badge */}
        <div className="flex items-start justify-between gap-3">
          {subject.code ? (
            <span className="font-mono text-xs font-bold tracking-wider text-blue-600">
              {subject.code}
            </span>
          ) : (
            <span className="font-mono text-xs font-bold tracking-wider text-slate-400">
              SNIST
            </span>
          )}

          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              RESOURCES AVAILABLE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600">
              <Clock className="h-3 w-3 text-blue-500" />
              COMING SOON
            </span>
          )}
        </div>

        {/* Subject Title */}
        <h4 className="font-display mt-3 text-base font-bold tracking-tight text-[#0A192F] group-hover:text-blue-600 transition">
          {subject.name}
        </h4>

        {/* Department Tags */}
        {subject.departments && subject.departments.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {subject.departments.map((dept) => {
              const isCommon = dept.toUpperCase() === 'COMMON';
              return (
                <span
                  key={dept}
                  className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase transition-colors ${
                    isCommon
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                  title={isCommon ? 'Common Subject for all departments' : `Department: ${dept}`}
                >
                  {dept}
                </span>
              );
            })}
          </div>
        )}

        {/* Optional Description */}
        {subject.description && (
          <p className="mt-2.5 line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {subject.description}
          </p>
        )}

        {/* Category tags */}
        {subject.categoryTags && subject.categoryTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subject.categoryTags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Button: EXPLORE RESOURCES → */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        {isAvailable ? (
          <button
            onClick={handleClick}
            className="group/btn inline-flex w-full items-center justify-between rounded bg-[#0A192F] px-3.5 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white transition hover:bg-blue-600 shadow-xs"
            id={`btn-explore-${subject.id}`}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
              EXPLORE RESOURCES
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="group/btn inline-flex w-full items-center justify-between rounded border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11px] font-bold tracking-widest uppercase text-slate-700 transition hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] shadow-xs"
            id={`btn-explore-${subject.id}`}
          >
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-300" />
              EXPLORE RESOURCES
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}

