import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID = 16;
type Point = { x: number; y: number };

export const MintSnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const [food, setFood] = useState<Point>({ x: 12, y: 8 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef<Point>({ x: 1, y: 0 });

  const spawnFood = (occupied: Point[]): Point => {
    for (let i = 0; i < 100; i++) {
      const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
      if (!occupied.some((s) => s.x === p.x && s.y === p.y)) return p;
    }
    return { x: 0, y: 0 };
  };

  const reset = () => {
    const init = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    dirRef.current = { x: 1, y: 0 };
    setSnake(init);
    setFood(spawnFood(init));
    setScore(0);
    setGameOver(false);
  };

  const setDirection = (nx: number, ny: number) => {
    if (dirRef.current.x === -nx && dirRef.current.y === -ny) return;
    dirRef.current = { x: nx, y: ny };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') setDirection(0, -1);
      else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') setDirection(0, 1);
      else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setDirection(-1, 0);
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setDirection(1, 0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (
          head.x < 0 ||
          head.x >= GRID ||
          head.y < 0 ||
          head.y >= GRID ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }
        const next = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((sc) => {
            const ns = sc + 10;
            setBest((b) => Math.max(b, ns));
            return ns;
          });
          setFood(spawnFood(next));
          return next;
        }
        next.pop();
        return next;
      });
    }, 130);
    return () => clearInterval(timer);
  }, [food, gameOver]);

  return (
    <div className="h-full w-full bg-[#18211b] text-white flex flex-col items-center justify-between p-4 select-none">
      <div className="w-full max-w-[340px] flex items-center justify-between text-xs">
        <span className="font-bold text-[#87CF3E]">Mint Leaf Snake</span>
        <div className="flex items-center gap-3 font-mono-term">
          <span>Skor: <strong className="text-[#87CF3E]">{score}</strong></span>
          <span className="flex items-center gap-1 text-amber-300">
            <Trophy className="w-3.5 h-3.5" /> {best}
          </span>
        </div>
      </div>

      <div className="relative my-1">
        <div
          className="grid bg-[#111a14] border-2 border-[#87CF3E]/40 rounded-lg overflow-hidden shadow-xl"
          style={{
            gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            width: 272,
            height: 272,
          }}
        >
          {Array.from({ length: GRID * GRID }).map((_, idx) => {
            const x = idx % GRID;
            const y = Math.floor(idx / GRID);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={idx}
                className="border-[0.5px] border-white/[0.03] flex items-center justify-center"
              >
                {isHead && <div className="w-3.5 h-3.5 rounded-sm bg-[#a3e635] shadow-[0_0_6px_#87CF3E]" />}
                {isBody && <div className="w-3 h-3 rounded-xs bg-[#65a30d]" />}
                {isFood && <div className="w-3 h-3 rounded-full bg-emerald-300 animate-pulse shadow-[0_0_8px_#6ee7b7]" />}
              </div>
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/75 rounded-lg flex flex-col items-center justify-center gap-2">
            <div className="text-base font-bold text-rose-400">Nabrak!</div>
            <div className="text-xs text-slate-300">Skor: {score}</div>
            <button
              onClick={reset}
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#87CF3E] text-slate-950 text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi
            </button>
          </div>
        )}
      </div>

      {/* On-screen compact controls + hint */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button onClick={() => setDirection(-1, 0)} className="p-1.5 rounded bg-white/10 hover:bg-white/20"><ArrowLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => setDirection(0, -1)} className="p-1.5 rounded bg-white/10 hover:bg-white/20"><ArrowUp className="w-3.5 h-3.5" /></button>
          <button onClick={() => setDirection(0, 1)} className="p-1.5 rounded bg-white/10 hover:bg-white/20"><ArrowDown className="w-3.5 h-3.5" /></button>
          <button onClick={() => setDirection(1, 0)} className="p-1.5 rounded bg-white/10 hover:bg-white/20"><ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">Atau pakai tombol panah / WASD</span>
      </div>
    </div>
  );
};
