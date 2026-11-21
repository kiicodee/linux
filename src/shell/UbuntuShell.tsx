import React, { useState } from 'react';
import { Wifi, Volume2, BatteryFull, Power, Grip, Search, Folder } from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta, TrashIcon } from '../core/AppIcon';

interface Props {
  distro: DistroConfig;
}

export const UbuntuShell: React.FC<Props> = ({ distro }) => {
  const { windows, openApp, launcherOpen, setLauncherOpen, returnHome, addToast } = useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');

  const dockApps: AppId[] = ['browser', 'files', 'notes', 'terminal', 'game', 'settings', 'about'];
  const filtered = distro.apps.filter((id) =>
    getAppMeta(id, distro.id).name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      {/* Authentic Ubuntu GNOME Top Bar (#1d1d1d) */}
      <header
        className="fixed top-0 inset-x-0 h-7 px-3 bg-[#1d1d1d] flex items-center justify-between text-[12px] text-[#f2f2f2] z-[500] select-none shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setLauncherOpen(!launcherOpen)}
          className={`px-2.5 h-full font-medium transition-colors ${
            launcherOpen ? 'border-b-2 border-[#E95420] text-white' : 'hover:bg-white/10'
          }`}
        >
          Activities
        </button>

        <div className="font-semibold tracking-wide text-[12px]">
          {clock.dateLabel.split(',')[1]?.trim().slice(0, 6) || ''} {clock.shortTime}
        </div>

        <div className="flex items-center gap-2.5">
          <Wifi className="w-3.5 h-3.5 text-white/90" />
          <Volume2 className="w-3.5 h-3.5 text-white/90" />
          <BatteryFull className="w-3.5 h-3.5 text-white/90" />
          <button
            onClick={returnHome}
            className="p-1 rounded hover:bg-white/15 text-white/90 hover:text-[#E95420]"
            title="Power Off / Kembali ke MarinerOS"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Authentic Ubuntu Left Dock (Yaru dark aubergine tint + orange active dot + Trash + 9-dot Show Apps) */}
      <aside
        className="fixed top-7 bottom-0 left-0 w-[58px] bg-[#1e121b]/88 backdrop-blur-md border-r border-white/8 z-[450] flex flex-col items-center py-2.5 gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {dockApps.map((appId) => {
          const isOpen = windows.some((w) => w.appId === appId);
          return (
            <button
              key={appId}
              onClick={() => openApp(appId)}
              className="relative group p-1 rounded-xl hover:bg-white/12 transition-all"
              title={getAppMeta(appId, distro.id).name}
            >
              {isOpen && (
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E95420]" />
              )}
              <AppIcon appId={appId} distroId="ubuntu" size="md" />
            </button>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-2 w-full px-2">
          <div className="w-8 h-px bg-white/15" />
          <button
            onClick={() => addToast('Trash kosong (0 item)')}
            className="p-1 rounded-xl hover:bg-white/12 transition-all"
            title="Trash"
          >
            <TrashIcon size="md" />
          </button>
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`p-2 rounded-xl transition-colors ${
              launcherOpen ? 'bg-white/20 text-white' : 'hover:bg-white/12 text-white/90'
            }`}
            title="Show Applications"
          >
            <Grip className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Authentic Ubuntu Desktop Icon: Home folder at bottom-right (matches real Ubuntu!) */}
      <div className="fixed bottom-14 right-6 z-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openApp('files');
          }}
          className="flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/12 transition-colors"
        >
          <div className="w-12 h-11 rounded-lg bg-gradient-to-b from-[#969696] to-[#747474] border-t-4 border-[#E95420] flex items-center justify-center shadow-lg">
            <Folder className="w-6 h-6 text-white/90" />
          </div>
          <span className="mt-1.5 text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            Home
          </span>
        </button>
      </div>

      {/* Authentic GNOME Activities & Show Applications Overlay */}
      {launcherOpen && (
        <div
          className="fixed inset-0 top-7 left-[58px] bg-[#1c1c1e]/85 backdrop-blur-xl z-[600] flex flex-col items-center pt-10 px-6 animate-window-pop"
          onClick={() => setLauncherOpen(false)}
        >
          <div className="w-full max-w-2xl space-y-8" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-sm mx-auto flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/12 border border-white/20 text-sm text-white">
              <Search className="w-4 h-4 text-white/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                autoFocus
                className="bg-transparent outline-none w-full placeholder:text-white/50 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
              {filtered.map((appId) => (
                <button
                  key={appId}
                  onClick={() => openApp(appId)}
                  className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/12 transition-all"
                >
                  <AppIcon appId={appId} distroId="ubuntu" size="lg" />
                  <span className="mt-2.5 text-xs font-medium text-white text-center">
                    {getAppMeta(appId, distro.id).name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
