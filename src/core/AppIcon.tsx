import React from 'react';
import {
  Terminal,
  Folder,
  Settings,
  Globe,
  FileText,
  Info,
  HelpCircle,
  ShoppingBag,
  Trash2,
  Gamepad2,
} from 'lucide-react';
import { AppId, DistroId } from '../types/distro';
import { DISTRO_GAME_META } from './apps/GameApp';

interface AppIconProps {
  appId: AppId;
  distroId?: DistroId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const APP_META: Record<AppId, { name: string; desc: string; category: string }> = {
  terminal: {
    name: 'Terminal',
    desc: 'Emulator baris perintah Linux',
    category: 'System',
  },
  files: {
    name: 'Files',
    desc: 'Jelajahi folder & file virtual',
    category: 'Accessories',
  },
  browser: {
    name: 'Firefox Web Browser',
    desc: 'Peramban web simulasi',
    category: 'Internet',
  },
  notes: {
    name: 'Text Editor',
    desc: 'Editor teks & catatan',
    category: 'Office',
  },
  settings: {
    name: 'Settings',
    desc: 'Ubah wallpaper & tema',
    category: 'Preferences',
  },
  about: {
    name: 'Info Distro',
    desc: 'Sejarah, RAM & info sistem',
    category: 'Administration',
  },
  game: {
    name: 'Mini Game',
    desc: 'Game eksklusif bertema distro',
    category: 'Accessories',
  },
};

export function getAppMeta(appId: AppId, distroId?: DistroId) {
  if (appId === 'game' && distroId) {
    return {
      name: DISTRO_GAME_META[distroId].title,
      desc: DISTRO_GAME_META[distroId].desc,
      category: 'Accessories',
    };
  }
  return APP_META[appId];
}

const SIZE_MAP = {
  xs: { box: 'w-5 h-5 rounded', icon: 'w-3 h-3' },
  sm: { box: 'w-7 h-7 rounded-md', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
};

export const AppIcon: React.FC<AppIconProps> = ({ appId, distroId = 'ubuntu', size = 'md' }) => {
  const { box, icon } = SIZE_MAP[size];

  // Ubuntu Yaru-authentic icon styling
  if (distroId === 'ubuntu') {
    if (appId === 'files') {
      return (
        <div className={`${box} bg-gradient-to-b from-[#9c9c9c] to-[#7a7a7a] border-t-4 border-[#E95420] flex items-center justify-center shadow-md shrink-0`}>
          <Folder className={`${icon} text-white/90`} />
        </div>
      );
    }
    if (appId === 'browser') {
      return (
        <div className={`${box} rounded-full bg-gradient-to-br from-[#FF9400] via-[#E95420] to-[#9059FF] flex items-center justify-center shadow-md shrink-0`}>
          <Globe className={`${icon} text-white`} />
        </div>
      );
    }
    if (appId === 'about') {
      return (
        <div className={`${box} rounded-full bg-gradient-to-b from-[#3584E4] to-[#1C71D8] flex items-center justify-center shadow-md shrink-0`}>
          <HelpCircle className={`${icon} text-white`} />
        </div>
      );
    }
    if (appId === 'terminal') {
      return (
        <div className={`${box} bg-gradient-to-b from-[#3b1d36] to-[#1f0d1c] border border-white/15 flex items-center justify-center shadow-md shrink-0`}>
          <Terminal className={`${icon} text-white`} />
        </div>
      );
    }
    if (appId === 'notes') {
      return (
        <div className={`${box} bg-gradient-to-b from-[#3584E4] to-[#1a5fb4] flex items-center justify-center shadow-md shrink-0`}>
          <FileText className={`${icon} text-white`} />
        </div>
      );
    }
    if (appId === 'settings') {
      return (
        <div className={`${box} bg-gradient-to-b from-[#E95420] to-[#c43f14] flex items-center justify-center shadow-md shrink-0`}>
          <ShoppingBag className={`${icon} text-white`} />
        </div>
      );
    }
    if (appId === 'game') {
      return (
        <div className={`${box} bg-gradient-to-br from-[#9C27B0] via-[#77216F] to-[#E95420] flex items-center justify-center shadow-md shrink-0`}>
          <Gamepad2 className={`${icon} text-white`} />
        </div>
      );
    }
  }

  // Linux Mint Mint-Y authentic icon styling
  if (distroId === 'mint') {
    const mintColors: Record<AppId, string> = {
      files: 'from-[#8FA876] to-[#6B8E4E]',
      browser: 'from-[#FF7139] to-[#E63946]',
      terminal: 'from-[#333638] to-[#1f2122] border border-white/15',
      notes: 'from-[#f8fafc] to-[#cbd5e1] text-slate-800',
      settings: 'from-[#6c757d] to-[#495057]',
      about: 'from-[#87CF3E] to-[#5EA322]',
      game: 'from-[#4ADE80] to-[#15803D]',
    };
    return (
      <div className={`${box} bg-gradient-to-b ${mintColors[appId]} flex items-center justify-center shadow-md shrink-0`}>
        {appId === 'terminal' && <Terminal className={`${icon} text-[#87CF3E]`} />}
        {appId === 'files' && <Folder className={`${icon} text-white`} />}
        {appId === 'browser' && <Globe className={`${icon} text-white`} />}
        {appId === 'notes' && <FileText className={`${icon} text-slate-700`} />}
        {appId === 'settings' && <Settings className={`${icon} text-white`} />}
        {appId === 'about' && <Info className={`${icon} text-white`} />}
        {appId === 'game' && <Gamepad2 className={`${icon} text-white`} />}
      </div>
    );
  }

  // Kubuntu KDE Breeze icon styling
  if (distroId === 'kubuntu') {
    const breezeColors: Record<AppId, string> = {
      files: 'from-[#3DAEE9] to-[#1D99F3]',
      browser: 'from-[#F67400] to-[#DA4453]',
      terminal: 'from-[#232629] to-[#16181a] border border-[#3DAEE9]/50',
      notes: 'from-[#1ABC9C] to-[#16A085]',
      settings: 'from-[#4D5660] to-[#31363B]',
      about: 'from-[#0079C1] to-[#005A91]',
      game: 'from-[#38BDF8] to-[#0284C7]',
    };
    return (
      <div className={`${box} bg-gradient-to-b ${breezeColors[appId]} flex items-center justify-center shadow-md shrink-0`}>
        {appId === 'terminal' && <Terminal className={`${icon} text-[#3DAEE9]`} />}
        {appId === 'files' && <Folder className={`${icon} text-white`} />}
        {appId === 'browser' && <Globe className={`${icon} text-white`} />}
        {appId === 'notes' && <FileText className={`${icon} text-white`} />}
        {appId === 'settings' && <Settings className={`${icon} text-white`} />}
        {appId === 'about' && <Info className={`${icon} text-white`} />}
        {appId === 'game' && <Gamepad2 className={`${icon} text-white`} />}
      </div>
    );
  }

  // Kali Linux Flat-Remix-Blue-Dark icon styling
  if (distroId === 'kali') {
    const kaliColors: Record<AppId, string> = {
      files: 'from-[#2777FF] to-[#1246A6]',
      browser: 'from-[#1B6EC2] to-[#0E3A6C]',
      terminal: 'from-[#0D131F] to-[#06090F] border border-[#367BF0]/60',
      notes: 'from-[#1F2937] to-[#111827] border border-white/15',
      settings: 'from-[#334155] to-[#1E293B]',
      about: 'from-[#367BF0] to-[#1D4ED8]',
      game: 'from-[#0F172A] to-[#1D4ED8] border border-sky-400/50',
    };
    return (
      <div className={`${box} bg-gradient-to-b ${kaliColors[appId]} flex items-center justify-center shadow-md shrink-0`}>
        {appId === 'terminal' && <Terminal className={`${icon} text-[#38BDF8]`} />}
        {appId === 'files' && <Folder className={`${icon} text-white`} />}
        {appId === 'browser' && <Globe className={`${icon} text-sky-200`} />}
        {appId === 'notes' && <FileText className={`${icon} text-sky-300`} />}
        {appId === 'settings' && <Settings className={`${icon} text-slate-200`} />}
        {appId === 'about' && <Info className={`${icon} text-white`} />}
        {appId === 'game' && <Gamepad2 className={`${icon} text-sky-300`} />}
      </div>
    );
  }

  // Zorin OS icon styling
  if (distroId === 'zorin') {
    const zorinColors: Record<AppId, string> = {
      files: 'from-[#42B3F5] to-[#158CE0]',
      browser: 'from-[#FB923C] to-[#2563EB]',
      terminal: 'from-[#232B38] to-[#141922]',
      notes: 'from-[#34D399] to-[#059669]',
      settings: 'from-[#64748B] to-[#475569]',
      about: 'from-[#15A6F0] to-[#0284C7]',
      game: 'from-[#38BDF8] to-[#4F46E5]',
    };
    return (
      <div className={`${box} bg-gradient-to-b ${zorinColors[appId]} flex items-center justify-center shadow-md shrink-0`}>
        {appId === 'terminal' && <Terminal className={`${icon} text-white`} />}
        {appId === 'files' && <Folder className={`${icon} text-white`} />}
        {appId === 'browser' && <Globe className={`${icon} text-white`} />}
        {appId === 'notes' && <FileText className={`${icon} text-white`} />}
        {appId === 'settings' && <Settings className={`${icon} text-white`} />}
        {appId === 'about' && <Info className={`${icon} text-white`} />}
        {appId === 'game' && <Gamepad2 className={`${icon} text-white`} />}
      </div>
    );
  }

  // elementary OS glossy Pantheon icon styling
  if (distroId === 'elementary') {
    const elemColors: Record<AppId, string> = {
      files: 'from-[#64BAFF] to-[#287CE0]',
      browser: 'from-[#38BDF8] to-[#0284C7]',
      terminal: 'from-[#3F444A] to-[#1E2124] border border-white/20',
      notes: 'from-[#FBBF24] to-[#D97706]',
      settings: 'from-[#94A3B8] to-[#475569]',
      about: 'from-[#818CF8] to-[#4F46E5]',
      game: 'from-[#F472B6] to-[#6366F1]',
    };
    return (
      <div className={`${box} rounded-2xl bg-gradient-to-b ${elemColors[appId]} ring-1 ring-white/30 flex items-center justify-center shadow-lg shrink-0`}>
        {appId === 'terminal' && <Terminal className={`${icon} text-white`} />}
        {appId === 'files' && <Folder className={`${icon} text-white`} />}
        {appId === 'browser' && <Globe className={`${icon} text-white`} />}
        {appId === 'notes' && <FileText className={`${icon} text-white`} />}
        {appId === 'settings' && <Settings className={`${icon} text-white`} />}
        {appId === 'about' && <Info className={`${icon} text-white`} />}
        {appId === 'game' && <Gamepad2 className={`${icon} text-white`} />}
      </div>
    );
  }

  // Arch Linux Papirus-Dark styling
  const archColors: Record<AppId, string> = {
    files: 'from-[#1793D1] to-[#0E6BA0]',
    browser: 'from-[#38BDF8] to-[#1D4ED8]',
    terminal: 'from-[#18202C] to-[#0D1117] border border-[#1793D1]/60',
    notes: 'from-[#10B981] to-[#047857]',
    settings: 'from-[#475569] to-[#334155]',
    about: 'from-[#1793D1] to-[#0C4A6E]',
    game: 'from-[#0EA5E9] to-[#1E3A8A] border border-[#1793D1]/60',
  };
  return (
    <div className={`${box} bg-gradient-to-b ${archColors[appId]} flex items-center justify-center shadow-md shrink-0`}>
      {appId === 'terminal' && <Terminal className={`${icon} text-[#1793D1]`} />}
      {appId === 'files' && <Folder className={`${icon} text-white`} />}
      {appId === 'browser' && <Globe className={`${icon} text-white`} />}
      {appId === 'notes' && <FileText className={`${icon} text-white`} />}
      {appId === 'settings' && <Settings className={`${icon} text-white`} />}
      {appId === 'about' && <Info className={`${icon} text-white`} />}
      {appId === 'game' && <Gamepad2 className={`${icon} text-white`} />}
    </div>
  );
};

export const TrashIcon: React.FC<{ size?: 'md' | 'lg' }> = ({ size = 'md' }) => {
  const { box, icon } = SIZE_MAP[size];
  return (
    <div className={`${box} bg-gradient-to-b from-[#d4d4d4] to-[#a3a3a3] flex items-center justify-center shadow-md shrink-0`}>
      <Trash2 className={`${icon} text-slate-700`} />
    </div>
  );
};
