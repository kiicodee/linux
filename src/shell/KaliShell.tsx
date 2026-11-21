import React, { useState } from 'react';
import {
  Power,
  Lock,
  Search,
  Shield,
  HardDrive,
  Folder,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { AppId, DistroConfig } from '../types/distro';
import { useOSStore } from '../store/useOSStore';
import { useClock } from '../core/useClock';
import { AppIcon, getAppMeta, TrashIcon } from '../core/AppIcon';
import { DistroLogo } from '../distros/icons';

interface Props {
  distro: DistroConfig;
}

const KALI_TOOLS: Record<string, { name: string; app: AppId; hint: string }[]> = {
  'Favorites': [
    { name: 'Terminal Emulator (zsh)', app: 'terminal', hint: 'Kali default shell' },
    { name: 'Cyber Breach (Mini Game)', app: 'game', hint: 'Retas 4-digit PIN firewall' },
    { name: 'File Manager (Thunar)', app: 'files', hint: 'Jelajahi file system' },
    { name: 'Firefox ESR', app: 'browser', hint: 'Web browser' },
    { name: 'Settings Manager', app: 'settings', hint: 'Xfce settings' },
    { name: 'About Kali Linux', app: 'about', hint: 'Info distro & RAM' },
  ],
  '01 - Information Gathering': [
    { name: 'nmap (Network Scanner)', app: 'terminal', hint: 'Buka di Terminal' },
    { name: 'wireshark (Packet Analyzer)', app: 'terminal', hint: 'Buka di Terminal' },
    { name: 'maltego (OSINT)', app: 'terminal', hint: 'Buka di Terminal' },
  ],
  '02 - Vulnerability Analysis': [
    { name: 'nikto (Web Scanner)', app: 'terminal', hint: 'Buka di Terminal' },
    { name: 'lynis (Security Audit)', app: 'terminal', hint: 'Buka di Terminal' },
  ],
  '03 - Web Application Analysis': [
    { name: 'burpsuite (Proxy)', app: 'browser', hint: 'Buka Web Analysis' },
    { name: 'sqlmap (SQL Injection)', app: 'terminal', hint: 'Buka di Terminal' },
  ],
  '04 - Password Attacks': [
    { name: 'john (John the Ripper)', app: 'terminal', hint: 'Buka di Terminal' },
    { name: 'hydra (Login Cracker)', app: 'terminal', hint: 'Buka di Terminal' },
  ],
  'System & Settings': [
    { name: 'Settings Manager', app: 'settings', hint: 'Tema & wallpaper' },
    { name: 'Mousepad (Editor)', app: 'notes', hint: 'Text editor' },
    { name: 'About Kali Linux', app: 'about', hint: 'Info sistem' },
  ],
};

export const KaliShell: React.FC<Props> = ({ distro }) => {
  const {
    windows,
    openApp,
    focusWindow,
    minimizeWindow,
    launcherOpen,
    setLauncherOpen,
    returnHome,
    activeWorkspace,
    setWorkspace,
    addToast,
  } = useOSStore();
  const clock = useClock();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Favorites');

  const categories = Object.keys(KALI_TOOLS);
  const currentTools = search.trim()
    ? Object.values(KALI_TOOLS)
        .flat()
        .filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase()))
    : KALI_TOOLS[selectedCat] || [];

  return (
    <>
      {/* Authentic Kali Xfce Desktop Icons (top-left: Trash, File System, Home, Terminal) */}
      <div className="fixed top-12 left-4 z-0 flex flex-col gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToast('Trash kosong');
          }}
          className="flex flex-col items-center w-20 p-1.5 rounded hover:bg-blue-500/20"
        >
          <TrashIcon size="md" />
          <span className="mt-1 text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
            Trash
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openApp('files');
          }}
          className="flex flex-col items-center w-20 p-1.5 rounded hover:bg-blue-500/20"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-blue-500/40 flex items-center justify-center shadow">
            <HardDrive className="w-5 h-5 text-sky-400" />
          </div>
          <span className="mt-1 text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
            File System
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openApp('files');
          }}
          className="flex flex-col items-center w-20 p-1.5 rounded hover:bg-blue-500/20"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2777FF] to-[#1246A6] flex items-center justify-center shadow">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <span className="mt-1 text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
            Home
          </span>
        </button>
      </div>

      {/* Authentic Kali Xfce Top Panel */}
      <header
        className="fixed top-0 inset-x-0 h-8 px-2 bg-[#0d121c]/95 border-b border-[#367BF0]/30 flex items-center justify-between text-[11px] text-slate-200 z-[500]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`p-1 rounded transition-colors ${
              launcherOpen ? 'bg-[#367BF0]/30' : 'hover:bg-white/10'
            }`}
            title="Kali Whisker Menu"
          >
            <DistroLogo id="kali" className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-white/12 mx-0.5" />

          {(['files', 'terminal', 'browser', 'game'] as AppId[]).map((appId) => (
            <button
              key={appId}
              onClick={() => openApp(appId)}
              className="p-1 rounded hover:bg-white/10"
              title={getAppMeta(appId, distro.id).name}
            >
              <AppIcon appId={appId} distroId="kali" size="xs" />
            </button>
          ))}

          {/* Xfce 4-Workspace Switcher */}
          <div className="hidden sm:flex items-center gap-0.5 ml-1 bg-black/40 p-0.5 rounded border border-white/10">
            {[1, 2, 3, 4].map((ws) => (
              <button
                key={ws}
                onClick={() => setWorkspace(ws)}
                className={`w-5 h-4 text-[10px] font-mono-term rounded-xs transition-colors ${
                  activeWorkspace === ws
                    ? 'bg-[#367BF0] text-white font-bold'
                    : 'text-slate-400 hover:bg-white/10'
                }`}
              >
                {ws}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1 ml-1 overflow-x-auto">
            {windows.map((w) => (
              <button
                key={w.id}
                onClick={() => (w.minimized ? focusWindow(w.id) : minimizeWindow(w.id))}
                className={`px-2 py-0.5 rounded text-[11px] max-w-[130px] truncate ${
                  w.minimized
                    ? 'bg-white/5 opacity-60'
                    : 'bg-[#367BF0]/25 border border-[#367BF0]/50 text-white'
                }`}
              >
                {w.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Kali Indicators: CPU mini bar, eth0 IP, Clock, Lock, Power */}
        <div className="flex items-center gap-2.5 shrink-0 font-mono-term text-[11px]">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-sky-400">
            <span>CPU</span>
            <div className="w-8 h-2.5 bg-slate-800 rounded-xs overflow-hidden border border-sky-500/30">
              <div className="w-2/5 h-full bg-[#367BF0]" />
            </div>
          </div>
          <span className="hidden lg:inline text-emerald-400">eth0: 10.0.2.15</span>
          <span className="text-white font-semibold">{clock.shortTime}</span>
          <button
            onClick={() => setLauncherOpen(false)}
            className="p-1 rounded hover:bg-white/10 text-slate-300"
            title="Lock"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={returnHome}
            className="p-1 rounded hover:bg-rose-500/25 text-rose-400"
            title="Log Out ke MarinerOS"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Authentic Kali Whisker Menu */}
      {launcherOpen && (
        <div
          className="fixed top-9 left-1 w-[94vw] max-w-[520px] h-[380px] rounded-lg bg-[#111723]/96 backdrop-blur-xl border border-[#367BF0]/40 shadow-2xl z-[600] flex flex-col overflow-hidden animate-window-pop"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2.5 border-b border-white/10 bg-[#0b1019] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 px-2.5 py-1.5 rounded bg-[#182133] border border-[#367BF0]/40 text-xs">
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Kali tools & apps..."
                autoFocus
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-400"
              />
            </div>
            <span className="text-[11px] font-mono-term text-sky-400 hidden sm:inline">
              {distro.username}@{distro.hostname}
            </span>
          </div>

          <div className="flex-1 flex overflow-hidden text-xs">
            {/* Categories */}
            <div className="w-48 border-r border-white/10 p-1.5 overflow-y-auto space-y-0.5 bg-[#0d131e]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onMouseEnter={() => {
                    setSearch('');
                    setSelectedCat(cat);
                  }}
                  onClick={() => {
                    setSearch('');
                    setSelectedCat(cat);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                    selectedCat === cat && !search
                      ? 'bg-[#367BF0] text-white font-medium'
                      : 'text-slate-300 hover:bg-white/8'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>

            {/* Tools */}
            <div className="flex-1 p-2 overflow-y-auto space-y-1">
              {currentTools.map((tool, i) => (
                <button
                  key={`${tool.name}-${i}`}
                  onClick={() => {
                    openApp(tool.app);
                    if (tool.app === 'terminal' && !tool.name.includes('Terminal')) {
                      addToast(`Menjalankan simulasi ${tool.name.split(' ')[0]} di Terminal`);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-[#367BF0]/25 text-left transition-colors"
                >
                  <TerminalIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{tool.hint}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
