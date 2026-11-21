import React, { useState } from 'react';
import {
  ShieldCheck,
  Network,
  Volume2,
  Search,
  Lock,
  LogOut,
  Power,
  Monitor,
  Folder,
} from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta } from '../core/AppIcon';
import { DistroLogo } from '../distros/icons';

interface Props {
  distro: DistroConfig;
}

const MINT_CATEGORIES = [
  'All Applications',
  'Accessories',
  'Internet',
  'Office',
  'System',
  'Preferences',
  'Administration',
];

export const MintShell: React.FC<Props> = ({ distro }) => {
  const { windows, openApp, focusWindow, minimizeWindow, launcherOpen, setLauncherOpen, returnHome } =
    useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Applications');

  const visibleApps = distro.apps.filter((id) => {
    const meta = getAppMeta(id, distro.id);
    const matchSearch = meta.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchCat = selectedCat === 'All Applications' || meta.category === selectedCat;
    return matchSearch && matchCat;
  });

  const handleTaskbarClick = (winId: string, minimized: boolean) => {
    if (minimized) focusWindow(winId);
    else minimizeWindow(winId);
  };

  return (
    <>
      {/* Authentic Linux Mint Desktop Icons (top-left: Computer, Home, Terminal, Info Distro) */}
      <div className="fixed top-4 left-4 z-0 flex flex-col gap-3">
        {[
          { label: 'Computer', app: 'about' as AppId, icon: <Monitor className="w-9 h-9 text-slate-200 drop-shadow" /> },
          { label: 'Home', app: 'files' as AppId, icon: <Folder className="w-9 h-9 text-[#87CF3E] drop-shadow" fill="#87CF3E" fillOpacity={0.35} /> },
        ].map((item) => (
          <button
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              openApp(item.app);
            }}
            className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-white/15 transition-colors"
          >
            {item.icon}
            <span className="mt-1 text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
              {item.label}
            </span>
          </button>
        ))}
        {(['terminal', 'game', 'settings'] as AppId[]).map((appId) => (
          <button
            key={appId}
            onClick={(e) => {
              e.stopPropagation();
              openApp(appId);
            }}
            className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-white/15 transition-colors"
          >
            <AppIcon appId={appId} distroId="mint" size="md" />
            <span className="mt-1 text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] text-center">
              {getAppMeta(appId, distro.id).name}
            </span>
          </button>
        ))}
      </div>

      {/* Authentic Linux Mint 22 3-Column Cinnamon Menu */}
      {launcherOpen && (
        <div
          className="fixed bottom-10 left-0 w-[94vw] max-w-[560px] h-[390px] bg-[#2e2e2e] border border-[#454545] shadow-2xl z-[600] flex overflow-hidden animate-window-pop rounded-tr-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Column 1: Left Favorites + Power Vertical Rail */}
          <div className="w-12 bg-[#252525] border-r border-white/8 flex flex-col items-center py-3 justify-between shrink-0">
            <div className="flex flex-col items-center gap-3">
              {(['browser', 'about', 'settings', 'terminal', 'files'] as AppId[]).map((appId) => (
                <button
                  key={appId}
                  onClick={() => openApp(appId)}
                  className="p-1 rounded hover:bg-white/12 transition-colors"
                  title={getAppMeta(appId, distro.id).name}
                >
                  <AppIcon appId={appId} distroId="mint" size="sm" />
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={() => setLauncherOpen(false)}
                className="p-1.5 rounded hover:bg-white/12 text-slate-300"
                title="Lock Screen"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={returnHome}
                className="p-1.5 rounded hover:bg-white/12 text-slate-300"
                title="Log Out ke MarinerOS"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={returnHome}
                className="p-1.5 rounded hover:bg-rose-500/25 text-rose-400"
                title="Quit / Kembali ke MarinerOS"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columns 2 & 3: Search Bar + Categories + Applications */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-2.5 border-b border-white/10 bg-[#2a2a2a]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#1f1f1f] border border-[#87CF3E]/60 text-xs">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applications..."
                  autoFocus
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden text-xs">
              {/* Column 2: Categories */}
              <div className="w-40 sm:w-44 border-r border-white/10 p-1.5 overflow-y-auto space-y-0.5 bg-[#2a2a2a]">
                {MINT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onMouseEnter={() => setSelectedCat(cat)}
                    onClick={() => setSelectedCat(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors truncate ${
                      selectedCat === cat
                        ? 'bg-[#4b4f4b] text-white font-medium'
                        : 'text-slate-300 hover:bg-white/8'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Column 3: Applications */}
              <div className="flex-1 p-1.5 overflow-y-auto space-y-0.5 bg-[#2e2e2e]">
                {visibleApps.map((appId) => (
                  <button
                    key={appId}
                    onClick={() => openApp(appId)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-[#87CF3E]/25 text-left text-slate-100 transition-colors"
                  >
                    <AppIcon appId={appId} distroId="mint" size="xs" />
                    <span className="truncate">{getAppMeta(appId, distro.id).name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentic Linux Mint 22 Bottom Cinnamon Panel (#2b2b2b) */}
      <footer
        className="fixed bottom-0 inset-x-0 h-10 px-1.5 bg-[#262626] border-t border-white/10 flex items-center justify-between text-xs text-white z-[500]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 min-w-0">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`p-1.5 rounded transition-colors ${
              launcherOpen ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
            title="Menu Linux Mint"
          >
            <DistroLogo id="mint" className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {(['files', 'browser', 'terminal', 'game', 'about'] as AppId[]).map((appId) => (
              <button
                key={appId}
                onClick={() => openApp(appId)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title={getAppMeta(appId, distro.id).name}
              >
                <AppIcon appId={appId} distroId="mint" size="xs" />
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-white/12 mx-1" />

          <div className="flex items-center gap-1 overflow-x-auto">
            {windows.map((w) => (
              <button
                key={w.id}
                onClick={() => handleTaskbarClick(w.id, w.minimized)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs max-w-[140px] truncate transition-colors ${
                  w.minimized
                    ? 'bg-white/5 opacity-60'
                    : 'bg-white/14 border-b-2 border-[#87CF3E]'
                }`}
              >
                <AppIcon appId={w.appId} distroId="mint" size="xs" />
                <span className="truncate hidden sm:inline">{w.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mint System Tray: Update Shield, Network, Volume, Clock */}
        <div className="flex items-center gap-3 px-2 shrink-0 text-slate-200">
          <ShieldCheck className="w-4 h-4 text-white/85" aria-label="Update Manager" />
          <Network className="w-3.5 h-3.5 text-white/85" />
          <Volume2 className="w-3.5 h-3.5 text-white/85" />
          <span className="font-semibold text-[12px]">{clock.shortTime}</span>
        </div>
      </footer>
    </>
  );
};
