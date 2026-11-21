import React, { useState } from 'react';
import { X, Cpu, HardDrive, Package, Play, CheckCircle2, Layers } from 'lucide-react';
import { DISTROS, DISTRO_MAP } from '../distros/registry';
import { DistroLogo } from '../distros/icons';
import { DistroId } from '../types/distro';
import { useOSStore } from '../store/useOSStore';

export const DistroInfoModal: React.FC = () => {
  const { infoModalDistroId, setInfoModal, launchDistro } = useOSStore();
  const [selectedId, setSelectedId] = useState<DistroId>(
    infoModalDistroId && infoModalDistroId !== 'all' ? infoModalDistroId : 'ubuntu'
  );

  if (!infoModalDistroId) return null;

  const activeId = infoModalDistroId !== 'all' ? infoModalDistroId : selectedId;
  const distro = DISTRO_MAP[activeId] || DISTROS[0];

  return (
    <div
      className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-window-pop"
      onClick={() => setInfoModal(null)}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-[#182026]/95 border border-white/15 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Panduan & Edukasi Distro Linux
            </h2>
            <p className="text-xs text-slate-400">
              Bandingkan sejarah, kebutuhan RAM, dan kecocokan tiap distro sebelum mencoba.
            </p>
          </div>
          <button
            onClick={() => setInfoModal(null)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
            aria-label="Tutup panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Distro Selector Sidebar */}
          <div className="md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-2.5 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 bg-black/15">
            {DISTROS.map((d) => {
              const isSelected = d.id === distro.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedId(d.id);
                    if (infoModalDistroId !== 'all') setInfoModal(d.id);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-white ring-1 ring-white/25'
                      : 'hover:bg-white/8 text-slate-300'
                  }`}
                >
                  <DistroLogo id={d.id} className="w-7 h-7 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{d.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{d.desktop}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <DistroLogo id={distro.id} className="w-16 h-16 shrink-0 drop-shadow-lg" />
                <div>
                  <h3 className="text-xl font-bold text-white">{distro.name}</h3>
                  <div className="text-xs text-slate-300">{distro.education.releaseVersion}</div>
                  <span
                    className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                    style={{ backgroundColor: distro.theme.accent }}
                  >
                    {distro.desktop}
                  </span>
                </div>
              </div>

              <button
                onClick={() => launchDistro(distro.id)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
                style={{ backgroundColor: distro.theme.accent }}
              >
                <Play className="w-4 h-4 fill-current" />
                Coba {distro.name}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed">
              <div className="font-semibold text-white mb-1">Sejarah & Filosofi</div>
              {distro.education.history}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Cpu className="w-3.5 h-3.5" /> RAM Min.
                </div>
                <div className="font-semibold text-white">{distro.education.minRam}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <HardDrive className="w-3.5 h-3.5" /> Storage
                </div>
                <div className="font-semibold text-white">{distro.education.minStorage}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Package className="w-3.5 h-3.5" /> Paket
                </div>
                <div className="font-semibold text-white">{distro.education.packageManager}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5" /> Basis
                </div>
                <div className="font-semibold text-white">{distro.education.baseDistro}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cocok Untuk Siapa?
                </div>
                <div className="flex flex-wrap gap-2">
                  {distro.education.bestFor.map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-slate-100"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ciri Khas Utama
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {distro.education.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: distro.theme.accent }}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400">
              Catatan: Semua logo dan nama distro adalah merek dagang masing-masing pemiliknya. MarinerOS adalah proyek simulasi edukasi non-afiliasi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
