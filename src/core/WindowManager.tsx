import React, { useRef } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { DistroConfig, WindowInstance } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { TerminalApp } from './apps/TerminalApp';
import { FileManagerApp } from './apps/FileManagerApp';
import { SettingsApp } from './apps/SettingsApp';
import { BrowserApp } from './apps/BrowserApp';
import { TextEditorApp } from './apps/TextEditorApp';
import { AboutApp } from './apps/AboutApp';
import { GameApp } from './apps/GameApp';
import { AppIcon } from './AppIcon';

interface WindowManagerProps {
  distro: DistroConfig;
  insetClass?: string;
}

const renderAppContent = (win: WindowInstance, distro: DistroConfig, darkMode: boolean) => {
  switch (win.appId) {
    case 'terminal':
      return <TerminalApp distro={distro} windowId={win.id} />;
    case 'files':
      return <FileManagerApp distro={distro} darkMode={darkMode} />;
    case 'settings':
      return <SettingsApp distro={distro} darkMode={darkMode} />;
    case 'browser':
      return <BrowserApp distro={distro} darkMode={darkMode} />;
    case 'notes':
      return <TextEditorApp distro={distro} darkMode={darkMode} />;
    case 'about':
      return <AboutApp distro={distro} darkMode={darkMode} />;
    case 'game':
      return <GameApp distro={distro} />;
  }
};

interface FloatingWindowProps {
  win: WindowInstance;
  distro: DistroConfig;
  darkMode: boolean;
  isFocused: boolean;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ win, distro, darkMode, isFocused }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow } = useOSStore();
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(win.id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const nextX = Math.max(-win.width + 120, Math.min(window.innerWidth - 120, dragRef.current.origX + dx));
    const nextY = Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.origY + dy));
    moveWindow(win.id, nextX, nextY);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const isElementary = distro.layout === 'macos-dock';
  const isUbuntu = distro.layout === 'top-left-dock';

  const bg = darkMode ? distro.theme.windowBgDark : distro.theme.windowBgLight;
  const titleBg = darkMode ? distro.theme.titlebarBgDark : distro.theme.titlebarBgLight;

  const style: React.CSSProperties = win.maximized
    ? {
        top: distro.layout === 'top-left-dock' || distro.layout === 'top-xfce' || distro.layout === 'macos-dock' ? 36 : 0,
        left: distro.layout === 'top-left-dock' ? 60 : 0,
        right: 0,
        bottom:
          distro.layout === 'bottom-panel' || distro.layout === 'kde-plasma' || distro.layout === 'start-menu'
            ? 46
            : distro.layout === 'macos-dock'
              ? 76
              : 0,
        zIndex: win.zIndex,
        borderRadius: 0,
        backgroundColor: bg,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        borderRadius: distro.theme.radius,
        backgroundColor: bg,
      };

  return (
    <div
      style={style}
      onMouseDown={() => focusWindow(win.id)}
      className={`fixed flex flex-col overflow-hidden shadow-2xl border animate-window-pop transition-shadow ${
        isFocused
          ? darkMode
            ? 'border-white/20 shadow-black/60'
            : 'border-slate-300 shadow-black/25'
          : darkMode
            ? 'border-white/10 opacity-95'
            : 'border-slate-200 opacity-95'
      }`}
    >
      {/* Titlebar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => maximizeWindow(win.id)}
        style={{ backgroundColor: titleBg }}
        className={`h-9 px-3 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing border-b ${
          darkMode ? 'border-white/10 text-slate-100' : 'border-slate-200 text-slate-800'
        }`}
      >
        {isElementary ? (
          <>
            <button
              onClick={() => closeWindow(win.id)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/15 dark:hover:bg-white/15"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold truncate">
              <AppIcon appId={win.appId} distroId={distro.id} size="xs" />
              <span>{win.title}</span>
            </div>
            <button
              onClick={() => maximizeWindow(win.id)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/15 dark:hover:bg-white/15"
              title="Maksimalkan"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-semibold truncate">
              <AppIcon appId={win.appId} distroId={distro.id} size="xs" />
              <span className="truncate">{win.title}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => minimizeWindow(win.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/15 dark:hover:bg-white/15 transition-colors"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => maximizeWindow(win.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/15 dark:hover:bg-white/15 transition-colors"
                title="Maximize"
              >
                <Square className="w-3 h-3" />
              </button>
              <button
                onClick={() => closeWindow(win.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isUbuntu
                    ? 'bg-[#E95420] text-white hover:bg-[#f06230]'
                    : 'hover:bg-rose-500 hover:text-white'
                }`}
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">{renderAppContent(win, distro, darkMode)}</div>
    </div>
  );
};

export const WindowManager: React.FC<WindowManagerProps> = ({ distro }) => {
  const { windows, darkMode, activeWorkspace, closeWindow, focusWindow, topZIndex } = useOSStore();

  // Arch Linux i3 Tiling Layout
  if (distro.layout === 'tiling') {
    const wsWindows = windows.filter((w) => !w.minimized && w.workspace === activeWorkspace);
    const cols =
      wsWindows.length <= 1
        ? 'grid-cols-1'
        : wsWindows.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2';

    return (
      <div className="fixed inset-0 top-8 bottom-0 p-2.5 z-10 pointer-events-none">
        {wsWindows.length > 0 && (
          <div className={`w-full h-full grid ${cols} gap-2.5 pointer-events-auto`}>
            {wsWindows.map((win) => {
              const isFocused = win.zIndex === topZIndex;
              return (
                <div
                  key={win.id}
                  onMouseDown={() => focusWindow(win.id)}
                  className="flex flex-col overflow-hidden bg-[#121821] animate-window-pop"
                  style={{
                    border: `2px solid ${isFocused ? distro.theme.accent : '#253142'}`,
                    borderRadius: '3px',
                  }}
                >
                  <div
                    className="h-6 px-2.5 flex items-center justify-between text-[11px] font-mono-term shrink-0"
                    style={{
                      backgroundColor: isFocused ? distro.theme.accent : '#1a2433',
                      color: '#ffffff',
                    }}
                  >
                    <span className="truncate font-semibold">
                      [ws:{win.workspace}] {win.title}
                    </span>
                    <button
                      onClick={() => closeWindow(win.id)}
                      className="hover:bg-black/25 px-1 rounded"
                      title="Tutup (Alt+Q)"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {renderAppContent(win, distro, darkMode)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard Floating Window Manager
  const visibleWindows = windows.filter((w) => !w.minimized);
  const highestZ = visibleWindows.reduce((max, w) => Math.max(max, w.zIndex), 0);

  return (
    <>
      {visibleWindows.map((win) => (
        <FloatingWindow
          key={win.id}
          win={win}
          distro={distro}
          darkMode={darkMode}
          isFocused={win.zIndex === highestZ}
        />
      ))}
    </>
  );
};
