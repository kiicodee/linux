import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { getAppMeta } from '../core/AppIcon';
import { DistroLogo } from '../distros/icons';

interface Props {
  distro: DistroConfig;
}

const WS_LABELS: Record<number, string> = {
  1: '1:term',
  2: '2:web',
  3: '3:files',
  4: '4:sys',
};

export const ArchShell: React.FC<Props> = ({ distro }) => {
  const {
    windows,
    openApp,
    activeWorkspace,
    setWorkspace,
    launcherOpen,
    setLauncherOpen,
    returnHome,
  } = useOSStore();
  const clock = useClock();
  const [rofiQuery, setRofiQuery] = useState('');

  const filtered = distro.apps.filter((id) =>
    getAppMeta(id, distro.id).name.toLowerCase().includes(rofiQuery.trim().toLowerCase())
  );

  return (
    <>
      {/* Authentic Polybar Top Status Bar for Arch Linux + i3wm */}
      <header
        className="fixed top-0 inset-x-0 h-8 px-2.5 bg-[#0f141e]/94 border-b border-[#1793D1]/40 flex items-center justify-between text-[11px] font-mono-term text-slate-200 z-[500]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Arch Emblem + Workspaces */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1793D1]/20 hover:bg-[#1793D1]/35 text-[#1793D1] font-bold"
            title="Buka Rofi Launcher (Alt+D)"
          >
            <DistroLogo id="arch" className="w-4 h-4" />
            <span className="hidden sm:inline">rofi</span>
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((ws) => {
              const count = windows.filter((w) => w.workspace === ws).length;
              const active = activeWorkspace === ws;
              return (
                <button
                  key={ws}
                  onClick={() => setWorkspace(ws)}
                  className={`px-2 py-0.5 transition-colors border-b-2 ${
                    active
                      ? 'border-[#1793D1] bg-[#1793D1]/20 text-white font-bold'
                      : count > 0
                        ? 'border-slate-500 text-slate-200 hover:bg-white/10'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {WS_LABELS[ws]}
                  {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Quick Tiling Spawn Hints */}
        <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-400">
          <span>Alt+Enter: Terminal</span>
          <span>·</span>
          <span>Alt+D: Rofi</span>
          <span>·</span>
          <span>Alt+1..4: WS</span>
          <span>·</span>
          <span>Alt+Q: Close</span>
        </div>

        {/* Right: Polybar Hardware Modules */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openApp('terminal')}
            className="px-2 py-0.5 rounded bg-[#1793D1]/20 hover:bg-[#1793D1]/35 text-sky-300 flex items-center gap-1"
            title="Spawn Terminal baru (Alt+Enter)"
          >
            <Plus className="w-3 h-3" /> term
          </button>
          <button
            onClick={() => openApp('game')}
            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 flex items-center gap-1"
            title="Pacman Speed Typer"
          >
            <Plus className="w-3 h-3" /> typer
          </button>
          <span className="hidden md:inline text-emerald-400">CPU 4%</span>
          <span className="hidden md:inline text-amber-300">RAM 412M</span>
          <span className="text-sky-300 font-semibold">{clock.fullTime}</span>
          <button onClick={returnHome} className="text-rose-400 hover:underline">
            [exit]
          </button>
        </div>
      </header>

      {/* Authentic Rofi Centered Fuzzy Launcher */}
      {launcherOpen && (
        <div
          className="fixed inset-0 bg-black/55 backdrop-blur-xs z-[650] flex items-center justify-center p-4 animate-window-pop"
          onClick={() => setLauncherOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#111722] border-2 border-[#1793D1] shadow-2xl font-mono-term text-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0b1018] border-b border-[#1793D1]/35">
              <span className="text-[#1793D1] font-bold">drun &gt;</span>
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                value={rofiQuery}
                onChange={(e) => setRofiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filtered.length > 0) {
                    openApp(filtered[0]);
                    setRofiQuery('');
                  }
                }}
                placeholder="ketik nama aplikasi..."
                autoFocus
                className="bg-transparent outline-none flex-1 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="p-1.5 space-y-0.5">
              {filtered.map((appId: AppId, idx) => (
                <button
                  key={appId}
                  onClick={() => {
                    openApp(appId);
                    setRofiQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    idx === 0
                      ? 'bg-[#1793D1] text-white font-bold'
                      : 'text-slate-300 hover:bg-[#1793D1]/25'
                  }`}
                >
                  <span>{getAppMeta(appId, distro.id).name}</span>
                  <span className="text-[10px] opacity-75">{getAppMeta(appId, distro.id).desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
