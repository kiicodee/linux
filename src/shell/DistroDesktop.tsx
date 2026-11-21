import React, { useEffect } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { WindowManager } from '../core/WindowManager';
import { ShellChrome } from './ShellChrome';

interface DistroDesktopProps {
  distro: DistroConfig;
}

export const DistroDesktop: React.FC<DistroDesktopProps> = ({ distro }) => {
  const {
    wallpaperIndex,
    returnHome,
    openApp,
    launcherOpen,
    setLauncherOpen,
    setWorkspace,
    windows,
    activeWorkspace,
    closeWindow,
    topZIndex,
    addToast,
  } = useOSStore();

  const wallpaper = distro.theme.wallpapers[wallpaperIndex] || distro.theme.wallpapers[0];

  // Keyboard shortcuts: Esc to close launcher or return to MarinerOS; Arch i3 shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (e.key === 'Escape') {
        if (launcherOpen) {
          setLauncherOpen(false);
        } else {
          returnHome();
        }
        return;
      }

      if (distro.layout === 'tiling' && e.altKey && !isInput) {
        if (e.key === 'Enter') {
          e.preventDefault();
          openApp('terminal');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setLauncherOpen(!launcherOpen);
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          setWorkspace(Number(e.key));
        } else if (e.key.toLowerCase() === 'q') {
          e.preventDefault();
          const wsWins = windows.filter((w) => w.workspace === activeWorkspace);
          const focused = wsWins.find((w) => w.zIndex === topZIndex) || wsWins[wsWins.length - 1];
          if (focused) closeWindow(focused.id);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    distro.layout,
    launcherOpen,
    setLauncherOpen,
    returnHome,
    openApp,
    setWorkspace,
    windows,
    activeWorkspace,
    closeWindow,
    topZIndex,
  ]);

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#${distro.id}`;
    navigator.clipboard?.writeText(url);
    addToast(`Link ${distro.name} disalin!`, 'success');
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden transition-all duration-500"
      style={{ background: wallpaper.background }}
      onClick={() => {
        if (launcherOpen) setLauncherOpen(false);
      }}
    >
      {/* Floating "Kembali ke MarinerOS" Pill */}
      <div
        className={`fixed z-[850] flex items-center gap-1.5 ${
          distro.layout === 'top-left-dock' ||
          distro.layout === 'top-xfce' ||
          distro.layout === 'macos-dock' ||
          distro.layout === 'tiling'
            ? 'bottom-3 right-4'
            : 'top-3 right-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/15 text-xs font-medium text-white shadow-lg transition-all"
          title="Bagikan tautan distro ini"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bagikan</span>
        </button>
        <button
          onClick={returnHome}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg transition-all"
          title="Kembali ke MarinerOS (Esc)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke MarinerOS</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-white/15 rounded">
            Esc
          </kbd>
        </button>
      </div>

      {/* Window Manager */}
      <WindowManager distro={distro} />

      {/* Distro-Specific Authentic Shell Chrome (Panels, Docks, Launchers, Desktop Icons) */}
      <ShellChrome distro={distro} />
    </div>
  );
};
