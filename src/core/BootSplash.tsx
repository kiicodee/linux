import React from 'react';
import { DistroConfig } from '../types/distro';
import { DistroLogo } from '../distros/icons';

interface BootSplashProps {
  distro: DistroConfig;
}

export const BootSplash: React.FC<BootSplashProps> = ({ distro }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#0b0f14] flex flex-col items-center justify-center p-6">
      <div className="animate-boot-in flex flex-col items-center text-center">
        <div
          className="p-5 rounded-3xl mb-5 shadow-2xl"
          style={{
            background: `radial-gradient(circle, ${distro.theme.accentSoft}, transparent 75%)`,
          }}
        >
          <DistroLogo id={distro.id} className="w-20 h-20 drop-shadow-xl" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{distro.name}</h1>
        <p className="text-xs text-slate-400 mt-1">
          Memuat antarmuka {distro.desktop}...
        </p>
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6">
          <div
            className="h-full rounded-full animate-boot-bar"
            style={{ backgroundColor: distro.theme.accent }}
          />
        </div>
      </div>
    </div>
  );
};
