import React from 'react';
import { Moon, Sun, Image as ImageIcon, Share2, Check } from 'lucide-react';
import { DistroConfig } from '../../types/distro';
import { useOSStore } from '../../store/useOSStore';

interface SettingsAppProps {
  distro: DistroConfig;
  darkMode: boolean;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ distro, darkMode }) => {
  const { wallpaperIndex, setWallpaperIndex, setDarkMode, addToast } = useOSStore();

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${distro.id}`;
    navigator.clipboard?.writeText(url);
    addToast(`Link ${distro.name} disalin ke clipboard!`, 'success');
  };

  return (
    <div className={`h-full overflow-y-auto p-5 space-y-6 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      <div>
        <h2 className="text-lg font-bold">Pengaturan Tampilan</h2>
        <p className="text-xs opacity-65 mt-0.5">
          Kustomisasi tema dan wallpaper simulasi {distro.name} ({distro.desktop}).
        </p>
      </div>

      {/* Mode Terang / Gelap */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">Tema Antarmuka</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setDarkMode(false);
              addToast('Mode Terang diaktifkan');
            }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
              !darkMode
                ? 'border-sky-500 ring-2 ring-sky-500/25 bg-sky-500/10'
                : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-sm font-semibold">Mode Terang</div>
              <div className="text-[11px] opacity-65">Jendela bersih & cerah</div>
            </div>
          </button>

          <button
            onClick={() => {
              setDarkMode(true);
              addToast('Mode Gelap diaktifkan');
            }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
              darkMode
                ? 'border-sky-500 ring-2 ring-sky-500/25 bg-sky-500/10'
                : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <div className="text-sm font-semibold">Mode Gelap</div>
              <div className="text-[11px] opacity-65">Nyaman untuk mata</div>
            </div>
          </button>
        </div>
      </section>

      {/* Wallpaper */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 opacity-60" />
          <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">Wallpaper Desktop</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {distro.theme.wallpapers.map((wp, idx) => {
            const active = wallpaperIndex === idx;
            return (
              <button
                key={wp.id}
                onClick={() => {
                  setWallpaperIndex(idx);
                  addToast(`Wallpaper diubah ke ${wp.name}`);
                }}
                className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                  active ? 'border-white shadow-lg scale-[1.01]' : 'border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <div className="h-20 w-full" style={{ background: wp.preview }} />
                <div
                  className={`px-2.5 py-1.5 text-xs font-medium flex items-center justify-between ${
                    darkMode ? 'bg-black/40' : 'bg-slate-100'
                  }`}
                >
                  <span className="truncate">{wp.name}</span>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bagikan Link */}
      <section
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div>
          <div className="text-sm font-semibold">Bagikan Distro Ini</div>
          <div className="text-xs opacity-65">
            Salin tautan langsung ke simulasi {distro.name} (`#{distro.id}`).
          </div>
        </div>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: distro.theme.accent }}
        >
          <Share2 className="w-3.5 h-3.5" />
          Salin Link
        </button>
      </section>
    </div>
  );
};
