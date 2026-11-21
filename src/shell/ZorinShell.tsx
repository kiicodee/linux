import React, { useState } from 'react';
import { Wifi, Volume2, Power, Search, Lock, Folder, Settings as SettingsIcon } from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta } from '../core/AppIcon';
import { DistroLogo } from '../distros/icons';

interface Props {
  distro: DistroConfig;
}

export const ZorinShell: React.FC<Props> = ({ distro }) => {
  const { windows, openApp, focusWindow, minimizeWindow, launcherOpen, setLauncherOpen, returnHome } =
    useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');

  const filtered = distro.apps.filter((id) =>
    getAppMeta(id, distro.id).name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      {/* Authentic Zorin OS 17 Windows-like Start Menu */}
      {launcherOpen && (
        <div
          className="fixed bottom-14 left-2.5 w-[94vw] max-w-[460px] rounded-2xl bg-[#161c26]/94 backdrop-blur-2xl border border-white/15 shadow-2xl z-[600] overflow-hidden animate-window-pop"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar */}
          <div className="p-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/8 border border-white/12 text-xs">
              <Search className="w-4 h-4 text-sky-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search apps & files..."
                autoFocus
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 2-Column Windows/Zorin Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-5 min-h-[270px]">
            {/* Left Apps */}
            <div className="sm:col-span-3 p-2.5 space-y-1 border-b sm:border-b-0 sm:border-r border-white/10">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                All Apps
              </div>
              {filtered.map((appId) => (
                <button
                  key={appId}
                  onClick={() => openApp(appId)}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#15A6F0]/22 text-left transition-colors"
                >
                  <AppIcon appId={appId} distroId="zorin" size="sm" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate">{getAppMeta(appId, distro.id).name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{getAppMeta(appId, distro.id).desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Places & Zorin Appearance */}
            <div className="sm:col-span-2 p-3 flex flex-col justify-between bg-black/20">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-xl bg-white/5">
                  <DistroLogo id="zorin" className="w-7 h-7" />
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{distro.username}</div>
                    <div className="text-[10px] text-sky-400">Zorin OS 17</div>
                  </div>
                </div>
                {[
                  { label: 'Home', app: 'files' as AppId, icon: Folder },
                  { label: 'Documents', app: 'files' as AppId, icon: Folder },
                  { label: 'Downloads', app: 'files' as AppId, icon: Folder },
                  { label: 'Zorin Appearance', app: 'settings' as AppId, icon: SettingsIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => openApp(item.app)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200"
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setLauncherOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                  title="Lock"
                >
                  <Lock className="w-4 h-4" />
                </button>
                <button
                  onClick={returnHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15A6F0]/25 hover:bg-[#15A6F0]/40 text-sky-200 text-xs font-semibold"
                >
                  <Power className="w-3.5 h-3.5" /> Power
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentic Zorin OS Bottom Taskbar (Windows-like) */}
      <footer
        className="fixed bottom-0 inset-x-0 h-12 px-3 bg-[#141922]/88 backdrop-blur-xl border-t border-white/12 flex items-center justify-between text-xs text-white z-[500]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`p-2 rounded-xl transition-colors ${
              launcherOpen ? 'bg-[#15A6F0]/30' : 'hover:bg-white/12'
            }`}
            title="Zorin Start Menu"
          >
            <DistroLogo id="zorin" className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLauncherOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-slate-300 text-xs mr-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <div className="flex items-center gap-1">
            {(['files', 'browser', 'terminal', 'game', 'notes', 'settings', 'about'] as AppId[]).map((appId) => {
              const openWin = windows.find((w) => w.appId === appId);
              return (
                <button
                  key={appId}
                  onClick={() =>
                    openWin
                      ? openWin.minimized
                        ? focusWindow(openWin.id)
                        : minimizeWindow(openWin.id)
                      : openApp(appId)
                  }
                  className={`relative p-1.5 rounded-xl transition-colors ${
                    openWin ? 'bg-white/14' : 'hover:bg-white/10'
                  }`}
                  title={getAppMeta(appId, distro.id).name}
                >
                  <AppIcon appId={appId} distroId="zorin" size="sm" />
                  {openWin && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#15A6F0]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Windows-like Stacked Clock & Tray */}
        <div className="flex items-center gap-3 pr-1 shrink-0">
          <Wifi className="w-3.5 h-3.5 opacity-85" />
          <Volume2 className="w-3.5 h-3.5 opacity-85" />
          <div className="text-right leading-tight">
            <div className="font-semibold text-[12px]">{clock.shortTime}</div>
            <div className="text-[10px] opacity-65 hidden sm:block">{clock.dateLabel}</div>
          </div>
        </div>
      </footer>
    </>
  );
};
