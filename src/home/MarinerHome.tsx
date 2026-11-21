import React, { useEffect, useMemo, useState } from 'react';
import { Search, Info, X, Sparkles, Keyboard, HelpCircle } from 'lucide-react';
import { DISTROS, HOME_DOCK_DISTROS } from '../distros/registry';
import { DistroLogo, InfoGuideIcon } from '../distros/icons';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { DistroConfig } from '../types/distro';
import { DistroInfoModal } from './DistroInfoModal';
import { MarinerTour, TOUR_STORAGE_KEY } from './MarinerTour';

export const MarinerHome: React.FC = () => {
  const { launchDistro, setInfoModal } = useOSStore();
  const clock = useClock();
  const [query, setQuery] = useState('');
  const [hoveredDistro, setHoveredDistro] = useState<DistroConfig | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Auto-open bubble guide on first visit to MarinerOS
  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => setTourOpen(true), 350);
        return () => clearTimeout(timer);
      }
    } catch {
      setTourOpen(true);
    }
  }, []);

  const filteredDistros = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DISTROS;
    return DISTROS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.desktop.toLowerCase().includes(q) ||
        d.shortDesc.toLowerCase().includes(q) ||
        d.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredDistros.length > 0) {
      launchDistro(filteredDistros[0].id);
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between bg-[#1b2226]"
      style={{
        backgroundImage: 'url(/assets/mariner-wallpaper.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => {
        if (statusOpen) setStatusOpen(false);
      }}
    >
      {/* Subtle vignette to ensure crisp text contrast on any screen size */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

      {/* ===================== TOP BAR (SVG faithful: center clock + 3 right status icons) ===================== */}
      <header className="relative z-20 w-full max-w-[1280px] mx-auto px-5 sm:px-10 pt-5 sm:pt-8 flex items-center justify-between">
        {/* Left subtle brand badge */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/75">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="tracking-wide hidden sm:inline">MarinerOS</span>
        </div>

        {/* Center real-time clock (matching SVG "Sat 13:18") */}
        <div
          className="text-sm sm:text-base font-medium text-white tracking-wide drop-shadow"
          aria-live="polite"
        >
          {clock.dayTime}
        </div>

        {/* Right 3 status icons extracted from SVG */}
        <div className="relative flex items-center gap-3 sm:gap-4" onClick={(e) => e.stopPropagation()}>
          {[
            { src: '/assets/status-icon-3.png', label: 'Status Jaringan' },
            { src: '/assets/status-icon-2.png', label: 'Status Audio' },
            { src: '/assets/status-icon-1.png', label: 'Info Sistem MarinerOS' },
          ].map((icon, idx) => (
            <button
              key={idx}
              onClick={() => setStatusOpen((v) => !v)}
              className="w-6 h-6 sm:w-[25px] sm:h-[25px] rounded-md hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
              title={icon.label}
            >
              <img src={icon.src} alt={icon.label} className="w-5 h-5 sm:w-[22px] sm:h-[22px] object-contain" />
            </button>
          ))}

          {/* Status Popover */}
          {statusOpen && (
            <div className="absolute right-0 top-10 w-72 rounded-2xl bg-[#1e262b]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-4 text-xs text-slate-200 space-y-3 animate-window-pop z-50">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" /> MarinerOS v0.1
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  Browser Native
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Coba antarmuka berbagai distro Linux langsung di browser tanpa instalasi atau VM.
              </p>
              <div className="p-2.5 rounded-xl bg-black/25 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Keyboard className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Tekan <kbd className="px-1 bg-white/15 rounded">Enter</kbd> di search untuk boot cepat</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Keyboard className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Tekan <kbd className="px-1 bg-white/15 rounded">Esc</kbd> di dalam distro untuk kembali</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setStatusOpen(false);
                    setInfoModal('all');
                  }}
                  className="w-full py-2 rounded-xl bg-white/12 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  Buka Panduan Semua Distro
                </button>
                <button
                  onClick={() => {
                    setStatusOpen(false);
                    setTourOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Ulangi Tur MarinerOS
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===================== CENTER AREA: SEARCH BAR + DESKTOP ICON GRID ===================== */}
      <main className="relative z-10 flex-1 w-full max-w-[1100px] mx-auto px-5 sm:px-10 flex flex-col items-center justify-start pt-6 sm:pt-10 pb-4 overflow-y-auto">
        {/* Search Bar Pill (SVG: 409 × 64 px, full radius, stroke #5E5E5E) */}
        <div className="w-full max-w-[409px] mb-8 sm:mb-12" data-tour="search">
          <div className="relative flex items-center h-[52px] sm:h-[60px] rounded-full border border-[#5E5E5E] bg-black/20 backdrop-blur-md px-5 transition-all focus-within:border-white/60 focus-within:bg-black/35 shadow-lg">
            <Search className="w-4 h-4 text-white/45 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search... (Ubuntu, GNOME, Windows, tiling)"
              className="w-full bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-white/40"
              aria-label="Cari distro Linux"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-white/50 hover:text-white"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Icon Grid (SVG: Row 1 = 5 icons, Row 2 = 2+ icons, responsive on mobile/tablet) */}
        <div className="w-full max-w-[880px]" data-tour="distro-grid">
          {filteredDistros.length === 0 ? (
            <div className="text-center py-12 text-slate-300 text-sm">
              Tidak ditemukan distro yang cocok dengan &ldquo;<span className="text-white font-semibold">{query}</span>&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-7 sm:gap-y-10 gap-x-4 sm:gap-x-8 justify-items-center">
              {filteredDistros.map((distro) => (
                <div
                  key={distro.id}
                  className="relative group flex flex-col items-center w-28"
                  onMouseEnter={() => setHoveredDistro(distro)}
                  onMouseLeave={() => setHoveredDistro((prev) => (prev?.id === distro.id ? null : prev))}
                >
                  <button
                    onClick={() => launchDistro(distro.id)}
                    onFocus={() => setHoveredDistro(distro)}
                    onBlur={() => setHoveredDistro(null)}
                    className="flex flex-col items-center p-2 rounded-2xl hover:bg-white/10 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-150"
                  >
                    <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-1 group-active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      <DistroLogo id={distro.id} className="w-16 h-16 sm:w-[76px] sm:h-[76px]" />
                    </div>
                    <span className="mt-2.5 text-xs sm:text-[13px] font-medium text-white tracking-wide drop-shadow text-center">
                      {distro.name}
                    </span>
                    <span className="text-[10px] text-white/55 text-center truncate max-w-full">
                      {distro.desktop}
                    </span>
                  </button>

                  {/* Quick Info Icon Badge on hover/mobile */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModal(distro.id);
                    }}
                    className="absolute top-1 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-sky-500 text-white/85 hover:text-white flex items-center justify-center opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all shadow"
                    title={`Info & spesifikasi ${distro.name}`}
                    aria-label={`Info ${distro.name}`}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Dedicated Educational Info Icon on Desktop (per Q6: "perlu tapi dalam icon") */}
              {!query && (
                <div className="relative group flex flex-col items-center w-28" data-tour="info-icon">
                  <button
                    onClick={() => setInfoModal('all')}
                    className="flex flex-col items-center p-2 rounded-2xl hover:bg-white/10 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-150"
                  >
                    <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-1 group-active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      <InfoGuideIcon className="w-16 h-16 sm:w-[76px] sm:h-[76px]" />
                    </div>
                    <span className="mt-2.5 text-xs sm:text-[13px] font-medium text-white tracking-wide drop-shadow text-center">
                      Info Distro
                    </span>
                    <span className="text-[10px] text-sky-300/80 text-center">
                      Panduan & RAM
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Tooltip Preview Strip (only visible on hover/focus for clean macOS-like desktop) */}
        <div className="h-11 mt-4 sm:mt-6 flex items-center justify-center">
          {hoveredDistro && (
            <div className="px-4 py-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-center gap-2.5 shadow-xl animate-window-pop max-w-[92vw]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: hoveredDistro.theme.accent }}
              />
              <span className="font-semibold text-white shrink-0">{hoveredDistro.name}</span>
              <span className="text-white/40">·</span>
              <span className="truncate">{hoveredDistro.shortDesc}</span>
            </div>
          )}
        </div>
      </main>

      {/* ===================== BOTTOM DOCK (SVG: 402 × 75 px, rx=23, #50585A, 4 Linux distro icons) ===================== */}
      <footer className="relative z-20 pb-5 sm:pb-7 flex justify-center px-4">
        <div
          data-tour="dock"
          className="w-full max-w-[402px] h-[68px] sm:h-[75px] rounded-[23px] px-5 sm:px-7 flex items-center justify-around shadow-[0_12px_32px_rgba(0,0,0,0.45)] border border-white/10 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(80, 88, 90, 0.92)' }}
          aria-label="Dock Distro Populer"
        >
          {HOME_DOCK_DISTROS.map((distro) => (
            <button
              key={distro.id}
              onClick={() => launchDistro(distro.id)}
              onMouseEnter={() => setHoveredDistro(distro)}
              onMouseLeave={() => setHoveredDistro(null)}
              className="group relative flex flex-col items-center justify-center transition-transform duration-200 ease-out hover:-translate-y-3 hover:scale-125 active:scale-95 focus:outline-none"
              title={`Buka ${distro.name} (${distro.desktop})`}
            >
              <DistroLogo id={distro.id} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity" />
            </button>
          ))}
        </div>
      </footer>

      {/* Educational Info Modal */}
      <DistroInfoModal />

      {/* First-Visit Interactive Bubble Guide (MarinerOS only) */}
      <MarinerTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
};
