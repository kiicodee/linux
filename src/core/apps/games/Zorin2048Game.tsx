import React, { useCallback, useEffect, useState } from 'react';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function addRandom(board: Board): Board {
  const next = board.map((r) => [...r]);
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (next[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length > 0) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    next[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  return next;
}

function slideRow(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gained += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const merged = filtered.filter((v) => v !== 0);
  while (merged.length < 4) merged.push(0);
  return { row: merged, gained };
}

function rotateCW(b: Board): Board {
  return b[0].map((_, c) => b.map((row) => row[c]).reverse());
}

const TILE_STYLES: Record<number, string> = {
  0: 'bg-white/6 text-transparent',
  2: 'bg-sky-200 text-slate-800',
  4: 'bg-sky-300 text-slate-900',
  8: 'bg-sky-400 text-white',
  16: 'bg-[#15A6F0] text-white',
  32: 'bg-blue-500 text-white',
  64: 'bg-blue-600 text-white',
  128: 'bg-indigo-500 text-white',
  256: 'bg-indigo-600 text-white',
  512: 'bg-violet-600 text-white',
  1024: 'bg-fuchsia-600 text-white',
  2048: 'bg-amber-400 text-slate-950',
};

export const Zorin2048Game: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);

  const move = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    setBoard((prev) => {
      let working = prev.map((r) => [...r]);
      const rotations = dir === 'left' ? 0 : dir === 'down' ? 1 : dir === 'right' ? 2 : 3;
      for (let i = 0; i < rotations; i++) working = rotateCW(working);

      let gainedTotal = 0;
      const slid = working.map((r) => {
        const res = slideRow(r);
        gainedTotal += res.gained;
        return res.row;
      });

      let restored = slid;
      for (let i = 0; i < (4 - rotations) % 4; i++) restored = rotateCW(restored);

      const changed = JSON.stringify(prev) !== JSON.stringify(restored);
      if (!changed) return prev;
      if (gainedTotal > 0) setScore((s) => s + gainedTotal);
      return addRandom(restored);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { e.preventDefault(); move('left'); }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); move('right'); }
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') { e.preventDefault(); move('up'); }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { e.preventDefault(); move('down'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const reset = () => {
    setBoard(addRandom(addRandom(emptyBoard())));
    setScore(0);
  };

  return (
    <div className="h-full w-full bg-[#151c28] text-white flex flex-col items-center justify-between p-4 select-none">
      <div className="w-full max-w-[300px] flex items-center justify-between text-xs">
        <span className="font-bold text-[#15A6F0] text-sm">Zorin Tiles 2048</span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono-term">
            Skor: <strong className="text-sky-300">{score}</strong>
          </span>
          <button onClick={reset} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20" title="Mulai ulang">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-[#0e141e] border border-white/10 shadow-xl w-[264px] h-[264px]">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-100 ${
              TILE_STYLES[val] || 'bg-amber-500 text-slate-950'
            }`}
          >
            {val || ''}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button onClick={() => move('left')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ArrowLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => move('up')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ArrowUp className="w-3.5 h-3.5" /></button>
          <button onClick={() => move('down')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ArrowDown className="w-3.5 h-3.5" /></button>
          <button onClick={() => move('right')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
        <span className="text-[11px] text-slate-400">Gabungkan angka hingga 2048!</span>
      </div>
    </div>
  );
};
