import React, { useState } from 'react';
import { Globe, Lock, RotateCw, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { DistroConfig } from '../../types/distro';
import { DistroLogo } from '../../distros/icons';
import { useOSStore } from '../../store/useOSStore';

interface BrowserAppProps {
  distro: DistroConfig;
  darkMode: boolean;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ distro, darkMode }) => {
  const openApp = useOSStore((s) => s.openApp);
  const [url, setUrl] = useState(`https://marineros.local/distro/${distro.id}`);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-[#1a1d24] text-slate-100' : 'bg-white text-slate-800'}`}>
      {/* Toolbar */}
      <div
        className={`flex items-center gap-2 px-3 py-2 border-b ${
          darkMode ? 'border-white/10 bg-black/25' : 'border-slate-200 bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-1 opacity-60">
          <ArrowLeft className="w-4 h-4" />
          <ArrowRight className="w-4 h-4" />
          <RotateCw className="w-3.5 h-3.5 ml-1" />
        </div>
        <div
          className={`flex-1 flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            darkMode ? 'bg-white/10 text-slate-200' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* Mock Web Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-4">
            <DistroLogo id={distro.id} className="w-14 h-14 shrink-0" />
            <div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: distro.theme.accent }}
              >
                Halaman Beranda Simulasi
              </span>
              <h1 className="text-xl font-bold mt-1">{distro.name}</h1>
              <p className="text-xs opacity-70">{distro.education.tagline}</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Globe className="w-4 h-4" style={{ color: distro.theme.accent }} />
              Ringkasan Cepat
            </div>
            <p className="text-xs leading-relaxed opacity-85">{distro.education.history}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => openApp('terminal')}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                darkMode ? 'border-white/10 hover:bg-white/8' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-semibold flex items-center justify-between">
                Coba Terminal
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </div>
              <div className="text-[11px] opacity-65 mt-1">
                Jalankan perintah `neofetch`, `ls`, `cat` langsung di browser.
              </div>
            </button>

            <button
              onClick={() => openApp('about')}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                darkMode ? 'border-white/10 hover:bg-white/8' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-semibold flex items-center justify-between">
                Spesifikasi & Edukasi
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </div>
              <div className="text-[11px] opacity-65 mt-1">
                Lihat kebutuhan RAM, sejarah, dan kecocokan {distro.name}.
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
