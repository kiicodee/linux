import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useOSStore } from '../store/useOSStore';

export const ToastContainer: React.FC = () => {
  const toasts = useOSStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-12 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#181e24]/92 backdrop-blur-md border border-white/15 text-xs text-white shadow-xl animate-window-pop"
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
