import React, { useState } from 'react';
import { Wifi, Volume2, Power, Search, BatteryFull } from 'lucide-react';
import { DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta } from '../core/AppIcon';

interface Props {
  distro: DistroConfig;
}

export const ElementaryShell: React.FC<Props> = ({ distro }) => {
  const { windows, openApp, launcherOpen, setLauncherOpen, returnHome } = useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');

  const filtered = distro.apps.filter((id) =>
    getAppMeta(id, distro.id).name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      {/* Authentic elementary OS Translucent Top Wingpanel */}
      <header
        className="fixed top-0 inset-x-0 h-7 px-4 bg-black/38 backdrop-blur-md flex items-center justify-between text-[12px] text-white z-[500] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setLauncherOpen(!launcherOpen)}
          className={`px-2 py-0.5 rounded font-medium transition-colors ${
            launcherOpen ? 'bg-white/20' : 'hover:bg-white/12'
          }`}
        >
          Applications
        </button>

        <div className="font-medium tracking-wide drop-shadow">
          {clock.dateLabel} · {clock.shortTime}
        </div>

        <div className="flex items-center gap-3">
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <BatteryFull className="w-3.5 h-3.5" />
          <button
            onClick={returnHome}
            className="hover:text-rose-300 transition-colors"
            title="Shut Down / Kembali ke MarinerOS"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Authentic Pantheon Slingshot Applications Popover */}
      {launcherOpen && (
        <div
          className="fixed top-9 left-3 w-[90vw] max-w-[360px] rounded-2xl bg-[#f5f6f8]/95 dark:bg-[#22262b]/95 backdrop-blur-2xl border border-white/25 shadow-2xl p-4 z-[600] animate-window-pop"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 text-xs mb-4">
            <Search className="w-3.5 h-3.5 opacity-60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Apps..."
              autoFocus
              className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder:opacity-60"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {filtered.map((appId) => (
              <button
                key={appId}
                onClick={() => openApp(appId)}
                className="flex flex-col items-center p-2.5 rounded-xl hover:bg-sky-500/15 transition-colors"
              >
                <AppIcon appId={appId} distroId="elementary" size="md" />
                <span className="mt-2 text-[11px] font-medium text-slate-800 dark:text-slate-100 truncate w-full text-center">
                  {getAppMeta(appId, distro.id).name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Authentic elementary OS Plank Dock (Frosted Glass Shelf + macOS Hover Magnification) */}
      <div
        className="fixed bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white/22 backdrop-blur-2xl border border-white/35 shadow-[0_14px_34px_rgba(0,0,0,0.35)] z-[500] flex items-end gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {distro.apps.map((appId) => {
          const isOpen = windows.some((w) => w.appId === appId);
          return (
            <button
              key={appId}
              onClick={() => openApp(appId)}
              className="group relative flex flex-col items-center transition-all duration-150 hover:-translate-y-2.5 hover:scale-115 active:scale-95"
              title={getAppMeta(appId, distro.id).name}
            >
              <AppIcon appId={appId} distroId="elementary" size="lg" />
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-opacity ${
                  isOpen ? 'bg-sky-300 opacity-100 shadow-[0_0_6px_#7dd3fc]' : 'opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </>
  );
};
