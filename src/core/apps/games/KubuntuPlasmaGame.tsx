import React, { useState } from 'react';
import { RotateCcw, Sparkles, Zap } from 'lucide-react';

const SIZE = 5;

function createPuzzle(clicks: number): boolean[] {
  const grid = Array(SIZE * SIZE).fill(false);
  const toggleAt = (arr: boolean[], idx: number) => {
    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;
    const targets = [
      [r, c],
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of targets) {
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        arr[nr * SIZE + nc] = !arr[nr * SIZE + nc];
      }
    }
  };
  for (let i = 0; i < clicks; i++) {
    toggleAt(grid, Math.floor(Math.random() * SIZE * SIZE));
  }
  return grid;
}

export const KubuntuPlasmaGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<boolean[]>(() => createPuzzle(3));
  const [moves, setMoves] = useState(0);

  const solved = grid.every((v) => !v);

  const handleClick = (idx: number) => {
    if (solved) return;
    const next = [...grid];
    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;
    for (const [nr, nc] of [
      [r, c],
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]) {
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        next[nr * SIZE + nc] = !next[nr * SIZE + nc];
      }
    }
    setGrid(next);
    setMoves((m) => m + 1);
  };

  const startLevel = (lv: number) => {
    setLevel(lv);
    setGrid(createPuzzle(lv + 2));
    setMoves(0);
  };

  return (
    <div className="h-full w-full bg-[#1b2028] text-white flex flex-col items-center justify-between p-4 select-none">
      <div className="w-full max-w-[340px] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#3DAEE9]">
          <Zap className="w-4 h-4" /> Plasma Circuit
        </div>
        <div className="flex items-center gap-3 font-mono-term text-slate-300">
          <span>Level <strong className="text-white">{level}</strong></span>
          <span>Langkah: <strong className="text-[#3DAEE9]">{moves}</strong></span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center max-w-xs">
        Padamkan semua node Plasma yang menyala. Mengklik satu node akan membalik node tersebut dan 4 tetangganya.
      </p>

      <div className="relative">
        <div className="grid grid-cols-5 gap-2 p-3 rounded-2xl bg-[#13171d] border border-[#3DAEE9]/30 shadow-xl">
          {grid.map((lit, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-150 ${
                lit
                  ? 'bg-[#3DAEE9] shadow-[0_0_16px_rgba(61,174,233,0.75)] scale-[1.03]'
                  : 'bg-[#262d38] hover:bg-[#2f3846] border border-white/8'
              }`}
              aria-label={`Node ${idx + 1}`}
            />
          ))}
        </div>

        {solved && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-[#3DAEE9]" />
            <div className="text-base font-bold text-white">Sirkuit Stabil!</div>
            <div className="text-xs text-slate-300">Selesai dalam {moves} langkah</div>
            <button
              onClick={() => startLevel(level + 1)}
              className="mt-1 px-4 py-1.5 rounded-lg bg-[#3DAEE9] text-slate-950 text-xs font-bold"
            >
              Level {level + 1} →
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => startLevel(level)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Acak Ulang Level {level}
      </button>
    </div>
  );
};
