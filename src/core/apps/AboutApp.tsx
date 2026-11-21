import React from 'react';
import { Cpu, HardDrive, Package, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { DistroConfig } from '../../types/distro';
import { DistroLogo } from '../../distros/icons';

interface AboutAppProps {
  distro: DistroConfig;
  darkMode: boolean;
}

export const AboutApp: React.FC<AboutAppProps> = ({ distro, darkMode }) => {
  const { education } = distro;

  return (
    <div className={`h-full overflow-y-auto p-5 space-y-5 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <DistroLogo id={distro.id} className="w-16 h-16 shrink-0 drop-shadow-md" />
        <div>
          <h2 className="text-xl font-bold">{distro.name}</h2>
          <div className="text-xs opacity-70">{education.releaseVersion}</div>
          <div
            className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: distro.theme.accent }}
          >
            {distro.desktop}
          </div>
        </div>
      </div>

      {/* Sejarah */}
      <div
        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="font-semibold mb-1">Sejarah Singkat</div>
        <p className="opacity-85">{education.history}</p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-1.5 opacity-60 mb-1">
            <Cpu className="w-3.5 h-3.5" /> RAM Minimum
          </div>
          <div className="font-semibold">{education.minRam}</div>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-1.5 opacity-60 mb-1">
            <HardDrive className="w-3.5 h-3.5" /> Penyimpanan
          </div>
          <div className="font-semibold">{education.minStorage}</div>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-1.5 opacity-60 mb-1">
            <Package className="w-3.5 h-3.5" /> Package Manager
          </div>
          <div className="font-semibold">{education.packageManager}</div>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-1.5 opacity-60 mb-1">
            <Layers className="w-3.5 h-3.5" /> Basis Distro
          </div>
          <div className="font-semibold">{education.baseDistro}</div>
        </div>
      </div>

      {/* Cocok Untuk Siapa */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-65">
          <Sparkles className="w-3.5 h-3.5" /> Cocok Untuk Siapa?
        </div>
        <div className="flex flex-wrap gap-2">
          {education.bestFor.map((item) => (
            <span
              key={item}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                darkMode ? 'bg-white/10 text-slate-200' : 'bg-slate-200/80 text-slate-700'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold uppercase tracking-wider opacity-65">Keunggulan Utama</div>
        <ul className="space-y-1.5 text-xs">
          {education.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: distro.theme.accent }} />
              <span className="opacity-85">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="pt-2 border-t border-white/10 text-[10px] opacity-55 leading-relaxed">
        Disclaimer: MarinerOS — Linux Interface Explorer adalah simulasi edukasi berbasis web dan tidak berafiliasi secara resmi dengan pemilik merek dagang {distro.name}.
      </div>
    </div>
  );
};
