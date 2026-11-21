import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface Orb {
  x: number;
  y: number;
  speed: number;
  kind: 'orb' | 'bug';
  r: number;
}

export const UbuntuJellyfishGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [runId, setRunId] = useState(0);

  const playerXRef = useRef(220);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 440;
    const H = 300;
    playerXRef.current = W / 2;
    let items: Orb[] = [];
    let frame = 0;
    let currentScore = 0;
    let alive = true;
    let animId = 0;

    setScore(0);
    setGameOver(false);

    const loop = () => {
      if (!alive) return;
      frame++;

      if (keysRef.current.left) playerXRef.current = Math.max(24, playerXRef.current - 5.2);
      if (keysRef.current.right) playerXRef.current = Math.min(W - 24, playerXRef.current + 5.2);

      // Spawn orbs and obstacles
      if (frame % 26 === 0) {
        const isBug = Math.random() < Math.min(0.45, 0.24 + currentScore / 600);
        items.push({
          x: 22 + Math.random() * (W - 44),
          y: -14,
          speed: 2.2 + Math.random() * 1.5 + currentScore / 260,
          kind: isBug ? 'bug' : 'orb',
          r: isBug ? 12 : 9,
        });
      }

      // Draw Ubuntu aubergine background
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#2C001E');
      grad.addColorStop(0.55, '#5E184E');
      grad.addColorStop(1, '#3B0A2B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // Draw player jellyfish
      const px = playerXRef.current;
      const py = H - 38;
      ctx.save();
      ctx.fillStyle = '#E95420';
      ctx.beginPath();
      ctx.arc(px, py, 16, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      // Jellyfish glow & tentacles
      ctx.strokeStyle = '#FF9E64';
      ctx.lineWidth = 2;
      for (let t = -10; t <= 10; t += 5) {
        ctx.beginPath();
        ctx.moveTo(px + t, py);
        ctx.lineTo(px + t + Math.sin(frame / 6 + t) * 3, py + 15);
        ctx.stroke();
      }
      ctx.restore();

      // Update & draw orbs/bugs
      items = items.filter((item) => {
        item.y += item.speed;

        if (item.kind === 'orb') {
          ctx.fillStyle = '#F97316';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FED7AA';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#111827';
          ctx.strokeStyle = '#F43F5E';
          ctx.lineWidth = 2;
          ctx.fillRect(item.x - item.r, item.y - item.r, item.r * 2, item.r * 2);
          ctx.strokeRect(item.x - item.r, item.y - item.r, item.r * 2, item.r * 2);
        }

        // Collision check
        const dx = item.x - px;
        const dy = item.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < item.r + 16) {
          if (item.kind === 'orb') {
            currentScore += 10;
            setScore(currentScore);
            setBest((b) => Math.max(b, currentScore));
            return false;
          } else {
            alive = false;
            setGameOver(true);
            return false;
          }
        }
        return item.y < H + 20;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(animId);
    };
  }, [runId]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 440;
    playerXRef.current = Math.max(24, Math.min(416, relX));
  };

  return (
    <div className="h-full w-full bg-[#1d0c18] text-white flex flex-col items-center justify-between p-4 select-none">
      <div className="w-full max-w-[440px] flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-[#E95420]">Jellyfish Dash</span>
          <span className="text-slate-400 ml-2">Tangkap orb oranye, hindari kotak merah!</span>
        </div>
        <div className="flex items-center gap-3 font-mono-term">
          <span>Skor: <strong className="text-orange-400">{score}</strong></span>
          <span className="flex items-center gap-1 text-amber-300">
            <Trophy className="w-3.5 h-3.5" /> {best}
          </span>
        </div>
      </div>

      <div className="relative my-2 rounded-xl overflow-hidden border border-white/15 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={440}
          height={300}
          onPointerMove={handlePointerMove}
          className="block max-w-full h-auto cursor-ew-resize"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <div className="text-lg font-bold text-rose-400">Game Over!</div>
            <div className="text-xs text-slate-300">Skor akhir: <strong className="text-white">{score}</strong></div>
            <button
              onClick={() => setRunId((r) => r + 1)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E95420] hover:bg-[#f06230] text-xs font-bold text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Main Lagi
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400">
        Kontrol: Geser mouse/sentuh di area game atau tekan <kbd className="px-1 bg-white/10 rounded">←</kbd> <kbd className="px-1 bg-white/10 rounded">→</kbd> / <kbd className="px-1 bg-white/10 rounded">A</kbd> <kbd className="px-1 bg-white/10 rounded">D</kbd>
      </div>
    </div>
  );
};
