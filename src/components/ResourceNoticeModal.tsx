import { Clock, X, Info } from 'lucide-react';
import { Subject } from '../types';

interface ResourceNoticeModalProps {
  subject: Subject | null;
  onClose: () => void;
}

export default function ResourceNoticeModal({
  subject,
  onClose,
}: ResourceNoticeModalProps) {
  if (!subject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded border border-slate-200 bg-white p-6 text-left shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        id="resource-notice-modal"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 border border-blue-100 text-blue-600">
            <Clock className="h-6 w-6" />
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close dialog"
            id="modal-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <span className="inline-block rounded border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
            COMING SOON
          </span>
          <h3
            id="modal-title"
            className="font-display mt-2 text-xl font-bold text-[#0A192F] tracking-tight"
          >
            {subject.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {subject.code && <span className="font-mono font-bold text-blue-600">{subject.code}</span>}
            <span>•</span>
            <span>{subject.yearTitle}</span>
            <span>•</span>
            <span>{subject.semesterTitle}</span>
          </div>

          {subject.departments && subject.departments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {subject.departments.map((dept) => (
                <span
                  key={dept}
                  className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700 uppercase"
                >
                  {dept}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Resources for this subject are currently being organised. Check back soon.
            </p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Our student curators are actively collecting, indexing, and verifying lecture slides, handwritten notes, and previous question papers for this subject.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-[#0A192F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-blue-600 transition"
            id="modal-understand-btn"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
