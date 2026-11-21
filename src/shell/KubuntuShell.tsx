import React, { useState } from 'react';
import {
  Wifi,
  Volume2,
  BatteryCharging,
  Power,
  Search,
  RotateCcw,
  Moon,
  Cpu,
} from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta } from '../core/AppIcon';
import { DistroLogo } from '../distros/icons';

interface Props {
  distro: DistroConfig;
}

export const KubuntuShell: React.FC<Props> = ({ distro }) => {
  const { windows, openApp, focusWindow, minimizeWindow, launcherOpen, setLauncherOpen, returnHome } =
    useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'apps' | 'places'>('apps');

  const filtered = distro.apps.filter((id) =>
    getAppMeta(id, distro.id).name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      {/* Authentic KDE Plasma Translucent Desktop Clock Widget */}
      <div className="fixed top-14 right-7 z-0 pointer-events-none hidden md:block">
        <div className="px-5 py-4 rounded-2xl bg-[#1b1e24]/55 backdrop-blur-md border border-white/12 text-right shadow-xl">
          <div className="text-5xl font-light tracking-tight text-white">
            {clock.shortTime}
          </div>
          <div className="text-xs text-sky-200 mt-1">{clock.dateLabel}</div>
          <div className="mt-2.5 flex items-center justify-end gap-1.5 text-[11px] text-sky-300/90">
            <Cpu className="w-3.5 h-3.5" /> KDE Plasma 6 · Breeze
          </div>
        </div>
      </div>

      {/* Authentic KDE Plasma Kickoff Launcher */}
      {launcherOpen && (
        <div
          className="fixed bottom-14 left-2 w-[92vw] max-w-[460px] rounded-xl bg-[#232629]/95 backdrop-blur-xl border border-[#3DAEE9]/35 shadow-2xl z-[600] overflow-hidden animate-window-pop"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Header + Search */}
          <div className="p-3.5 bg-[#1b1e20] border-b border-white/10 space-y-2.5">
            <div className="flex items-center gap-3">
              <DistroLogo id="kubuntu" className="w-9 h-9" />
              <div>
                <div className="text-sm font-bold text-white">{distro.username}</div>
                <div className="text-[11px] text-[#3DAEE9]">Kubuntu · KDE Plasma</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2e32] border border-[#3DAEE9]/50 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applications..."
                autoFocus
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-3 min-h-[220px]">
            {tab === 'apps' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map((appId) => (
                  <button
                    key={appId}
                    onClick={() => openApp(appId)}
                    className="flex flex-col items-center p-2.5 rounded-lg hover:bg-[#3DAEE9]/20 transition-colors text-center"
                  >
                    <AppIcon appId={appId} distroId="kubuntu" size="md" />
                    <span className="mt-1.5 text-xs font-medium text-white truncate w-full">
                      {getAppMeta(appId, distro.id).name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1 text-xs">
                {['Home', 'Documents', 'Downloads', 'Pictures'].map((place) => (
                  <button
                    key={place}
                    onClick={() => openApp('files')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#3DAEE9]/20 text-slate-200"
                  >
                    📁 {place}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kickoff Bottom Tabs + Power Actions */}
          <div className="px-3 py-2 bg-[#1b1e20] border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab('apps')}
                className={`px-2.5 py-1 rounded ${
                  tab === 'apps' ? 'bg-[#3DAEE9] text-white font-semibold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setTab('places')}
                className={`px-2.5 py-1 rounded ${
                  tab === 'places' ? 'bg-[#3DAEE9] text-white font-semibold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                Places
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLauncherOpen(false)}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300"
                title="Sleep"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={returnHome}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300"
                title="Restart / Kembali"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={returnHome}
                className="p-1.5 rounded hover:bg-rose-500/25 text-rose-400"
                title="Shut Down / Kembali ke MarinerOS"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentic KDE Plasma 6 Floating/Docked Bottom Panel */}
      <footer
        className="fixed bottom-1.5 left-2 right-2 h-11 px-2.5 rounded-xl bg-[#1e2229]/88 backdrop-blur-xl border border-white/14 flex items-center justify-between text-xs text-white z-[500] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              launcherOpen ? 'bg-[#3DAEE9]/30' : 'hover:bg-white/12'
            }`}
            title="Kickoff Application Launcher"
          >
            <DistroLogo id="kubuntu" className="w-6 h-6" />
          </button>

          {(['files', 'browser', 'terminal', 'game', 'settings'] as AppId[]).map((appId) => (
            <button
              key={appId}
              onClick={() => openApp(appId)}
              className="p-1.5 rounded-lg hover:bg-white/12 transition-colors"
              title={getAppMeta(appId, distro.id).name}
            >
              <AppIcon appId={appId} distroId="kubuntu" size="sm" />
            </button>
          ))}

          <div className="h-5 w-px bg-white/15 mx-1" />

          <div className="flex items-center gap-1 overflow-x-auto">
            {windows.map((w) => (
              <button
                key={w.id}
                onClick={() => (w.minimized ? focusWindow(w.id) : minimizeWindow(w.id))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs max-w-[130px] truncate border-t-2 ${
                  w.minimized
                    ? 'border-transparent bg-white/5 opacity-60'
                    : 'border-[#3DAEE9] bg-white/15'
                }`}
              >
                <AppIcon appId={w.appId} distroId="kubuntu" size="xs" />
                <span className="truncate hidden sm:inline">{w.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pr-1 shrink-0">
          <Wifi className="w-3.5 h-3.5 opacity-85" />
          <Volume2 className="w-3.5 h-3.5 opacity-85" />
          <BatteryCharging className="w-4 h-4 text-[#3DAEE9]" />
          <div className="text-right leading-tight">
            <div className="font-semibold">{clock.shortTime}</div>
            <div className="text-[10px] opacity-70 hidden sm:block">{clock.dateLabel}</div>
          </div>
        </div>
      </footer>
    </>
  );
};
