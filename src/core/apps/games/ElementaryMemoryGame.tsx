import React, { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const SYMBOLS = ['🏔️', '🌲', '☁️', '🌊', '🌙', '☀️', '🍃', '✨'];

interface Card {
  id: number;
  symbol: string;
  matched: boolean;
}

function createDeck(): Card[] {
  const doubled = [...SYMBOLS, ...SYMBOLS];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled.map((symbol, id) => ({ id, symbol, matched: false }));
}

export const ElementaryMemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.matched);

  const flipCard = (idx: number) => {
    if (locked || flipped.includes(idx) || cards[idx].matched) return;
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = nextFlipped;
      if (cards[a].symbol === cards[b].symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
          );
          setFlipped([]);
          setLocked(false);
        }, 320);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 650);
      }
    }
  };

  const reset = () => {
    setCards(createDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#f4f7fb] to-[#e5edf7] text-slate-800 flex flex-col items-center justify-between p-4 select-none">
      <div className="w-full max-w-[300px] flex items-center justify-between text-xs">
        <span className="font-bold text-[#2A7DE1] text-sm">Pantheon Zen Memory</span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white shadow-xs font-medium">
            Langkah: <strong>{moves}</strong>
          </span>
          <button onClick={reset} className="p-1.5 rounded-full bg-white shadow-xs hover:bg-slate-100" title="Ulangi">
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white">
          {cards.map((card, idx) => {
            const open = card.matched || flipped.includes(idx);
            return (
              <button
                key={card.id}
                onClick={() => flipCard(idx)}
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-xl text-2xl flex items-center justify-center transition-all duration-200 ${
                  card.matched
                    ? 'bg-sky-100 border border-sky-300 scale-95 opacity-85'
                    : open
                      ? 'bg-white shadow-md border border-sky-400'
                      : 'bg-gradient-to-br from-[#64BAFF] to-[#2A7DE1] hover:opacity-90 shadow-sm'
                }`}
              >
                {open ? card.symbol : <span className="text-white/50 text-xs font-bold">e</span>}
              </button>
            );
          })}
        </div>

        {allMatched && (
          <div className="absolute inset-0 bg-white/88 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-[#2A7DE1]" />
            <div className="text-base font-bold text-slate-800">Zen Tercapai!</div>
            <div className="text-xs text-slate-500">Semua pasangan cocok dalam {moves} langkah.</div>
            <button
              onClick={reset}
              className="mt-1 px-4 py-1.5 rounded-full bg-[#2A7DE1] text-white text-xs font-semibold shadow"
            >
              Main Lagi
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500">Cocokkan 8 pasang ikon alam minimalis ala elementary OS.</div>
    </div>
  );
};
