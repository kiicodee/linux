import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

export const TOUR_STORAGE_KEY = 'marineros_tour_seen_v1';

interface TourStep {
  id: string;
  target?: string;
  title: string;
  description: string;
  placement?: 'bottom' | 'top' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang di MarinerOS!',
    description:
      'Coba tampilan berbagai distro Linux secara interaktif langsung dari browser — tanpa Live USB, tanpa VM. Yuk kenalan singkat dengan area MarinerOS.',
    placement: 'center',
  },
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Cari Distro dengan Cepat',
    description:
      'Ketik nama distro, Desktop Environment (GNOME, KDE, tiling), atau gaya tampilan (Windows, macOS). Tekan Enter untuk langsung boot ke hasil teratas.',
    placement: 'bottom',
  },
  {
    id: 'grid',
    target: '[data-tour="distro-grid"]',
    title: 'Pilih & Coba Distro Linux',
    description:
      'Klik ikon distro mana saja untuk masuk ke simulasi antarmuka aslinya — lengkap dengan menu aplikasi, terminal, file manager, dan pengaturan. Tekan Esc kapan saja untuk kembali ke sini.',
    placement: 'bottom',
  },
  {
    id: 'info',
    target: '[data-tour="info-icon"]',
    title: 'Panduan & Info Distro',
    description:
      'Bingung mau coba yang mana? Klik ikon Info Distro ini (atau tombol "i" di tiap ikon) untuk melihat sejarah, kebutuhan RAM minimum, dan kecocokan tiap distro.',
    placement: 'top',
  },
  {
    id: 'dock',
    target: '[data-tour="dock"]',
    title: 'Dock Akses Cepat',
    description:
      '4 distro populer (Ubuntu, Linux Mint, Kali Linux, Arch Linux) selalu siap diluncurkan cepat dari dock bawah ini. Selamat bereksplorasi!',
    placement: 'top',
  },
];

interface MarinerTourProps {
  open: boolean;
  onClose: () => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const MarinerTour: React.FC<MarinerTourProps> = ({ open, onClose }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const step = TOUR_STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === TOUR_STEPS.length - 1;

  // Reset to step 0 whenever reopened
  useEffect(() => {
    if (open) setStepIdx(0);
  }, [open]);

  // Measure target element for spotlight & bubble positioning
  useLayoutEffect(() => {
    if (!open) return;

    const updateRect = () => {
      if (!step.target) {
        setTargetRect(null);
        return;
      }
      const el = document.querySelector(step.target);
      if (!el) {
        setTargetRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setTargetRect({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [open, step.target]);

  const finishTour = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    onClose();
  };

  const handleNext = () => {
    if (isLast) finishTour();
    else setStepIdx((s) => s + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setStepIdx((s) => s - 1);
  };

  // Keyboard shortcuts while tour is active
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finishTour();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const bubbleWidth = Math.min(350, vw - 28);
  const padding = 10;

  // Compute safe bubble coordinates
  let bubbleStyle: React.CSSProperties;
  let arrowPos: 'top' | 'bottom' | null = null;
  let arrowLeftOffset = bubbleWidth / 2;

  if (!targetRect || step.placement === 'center') {
    bubbleStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: bubbleWidth,
    };
  } else {
    const centerX = targetRect.left + targetRect.width / 2;
    const clampedLeft = Math.max(14, Math.min(vw - bubbleWidth - 14, centerX - bubbleWidth / 2));
    arrowLeftOffset = Math.max(24, Math.min(bubbleWidth - 24, centerX - clampedLeft));

    const preferTop =
      step.placement === 'top' ||
      (targetRect.top + targetRect.height + 215 > vh && targetRect.top > 210);

    if (preferTop) {
      arrowPos = 'bottom';
      bubbleStyle = {
        left: clampedLeft,
        bottom: Math.max(16, vh - targetRect.top + 18),
        width: bubbleWidth,
      };
    } else {
      arrowPos = 'top';
      bubbleStyle = {
        left: clampedLeft,
        top: Math.min(vh - 220, targetRect.top + targetRect.height + 18),
        width: bubbleWidth,
      };
    }
  }

  return (
    <div className="fixed inset-0 z-[950] pointer-events-auto" role="dialog" aria-modal="true">
      {/* Dimmed backdrop (when no target) or Spotlight hole using box-shadow */}
      {targetRect ? (
        <div
          className="fixed rounded-2xl transition-all duration-300 ease-out pointer-events-none ring-2 ring-sky-400/90"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            boxShadow: '0 0 0 9999px rgba(8, 12, 16, 0.72), 0 0 28px rgba(56, 189, 248, 0.45)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-[#080c10]/75 backdrop-blur-[2px] transition-opacity" />
      )}

      {/* Clickable overlay to prevent accidental clicks behind the tour */}
      <div className="fixed inset-0" onClick={(e) => e.stopPropagation()} />

      {/* Speech Bubble Card */}
      <div
        style={bubbleStyle}
        className="fixed z-[960] rounded-2xl bg-[#182129]/96 backdrop-blur-xl border border-sky-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.65)] p-5 text-white animate-window-pop transition-all duration-300"
      >
        {/* Directional Bubble Tail */}
        {arrowPos === 'top' && (
          <div
            style={{ left: arrowLeftOffset - 8 }}
            className="absolute -top-2 w-4 h-4 rotate-45 bg-[#182129] border-l border-t border-sky-400/35"
          />
        )}
        {arrowPos === 'bottom' && (
          <div
            style={{ left: arrowLeftOffset - 8 }}
            className="absolute -bottom-2 w-4 h-4 rotate-45 bg-[#182129] border-r border-b border-sky-400/35"
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                Panduan MarinerOS · {stepIdx + 1}/{TOUR_STEPS.length}
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{step.title}</h3>
            </div>
          </div>

          <button
            onClick={finishTour}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Lewati panduan (Esc)"
            aria-label="Tutup panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-300 leading-relaxed">{step.description}</p>

        {/* Progress Dots */}
        <div className="mt-4 flex items-center gap-1.5">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setStepIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === stepIdx
                  ? 'w-6 bg-sky-400'
                  : idx < stepIdx
                    ? 'w-2 bg-sky-400/50'
                    : 'w-2 bg-white/15 hover:bg-white/30'
              }`}
              aria-label={`Langkah ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer Buttons: Skip, Back, Next / Finish */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={finishTour}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-1.5 py-1"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-medium text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/25 transition-all"
            >
              <span>{isLast ? 'Mulai Eksplorasi' : 'Lanjut'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
