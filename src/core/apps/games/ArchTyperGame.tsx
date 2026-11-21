import React, { useEffect, useState } from 'react';
import { RotateCcw, Terminal } from 'lucide-react';

const COMMANDS = [
  'sudo pacman -Syu',
  'neofetch',
  'i3-msg reload',
  'yay -S hyprland',
  'systemctl status',
  'pacman -Ss firefox',
  'chmod +x build.sh',
  'ls -la ~/.config',
  'uname -r',
  'cat /etc/os-release',
  'grep -rn main src/',
  'ip addr show',
];

function pickCommand(exclude?: string): string {
  const pool = COMMANDS.filter((c) => c !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const ArchTyperGame: React.FC = () => {
  const [target, setTarget] = useState(() => pickCommand());
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [charsTyped, setCharsTyped] = useState(0);

  const finished = timeLeft <= 0;

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  const handleChange = (val: string) => {
    if (finished) return;
    if (!started) setStarted(true);
    setTyped(val);
    if (val === target) {
      setCompleted((c) => c + 1);
      setCharsTyped((ch) => ch + target.length);
      setTarget((prev) => pickCommand(prev));
      setTyped('');
    }
  };

  const reset = () => {
    setTarget(pickCommand());
    setTyped('');
    setTimeLeft(30);
    setStarted(false);
    setCompleted(0);
    setCharsTyped(0);
  };

  const elapsed = 30 - timeLeft;
  const wpm = elapsed > 0 ? Math.round((charsTyped / 5) / (elapsed / 60)) : 0;

  return (
    <div className="h-full w-full bg-[#0d1117] text-slate-100 font-mono-term p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs border-b border-[#1793D1]/30 pb-2.5">
        <div className="flex items-center gap-2 text-[#1793D1] font-bold">
          <Terminal className="w-4 h-4" /> Pacman Speed Typer
        </div>
        <div className="flex items-center gap-3">
          <span>Waktu: <strong className={timeLeft <= 5 ? 'text-rose-400' : 'text-sky-400'}>{timeLeft}s</strong></span>
          <span>Cmd: <strong className="text-emerald-400">{completed}</strong></span>
          <span>WPM: <strong className="text-amber-300">{wpm}</strong></span>
        </div>
      </div>

      {finished ? (
        <div className="my-auto text-center space-y-3 py-4">
          <div className="text-xs uppercase tracking-widest text-[#1793D1]">Rolling Release Complete</div>
          <div className="text-2xl font-bold text-white">{wpm} WPM · {completed} Perintah</div>
          <div className="text-xs text-emerald-400">
            {completed >= 8
              ? 'Rank: "I use Arch, btw" Legend 🏆'
              : completed >= 4
                ? 'Rank: Arch Wiki Reader ⚡'
                : 'Rank: Pacman Apprentice 🐧'}
          </div>
          <button
            onClick={reset}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#1793D1] hover:bg-sky-500 text-xs font-bold text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulangi Tantangan
          </button>
        </div>
      ) : (
        <div className="my-auto space-y-4">
          <div className="text-[11px] text-slate-400">
            Ketik perintah Arch Linux secepat mungkin sebelum waktu habis:
          </div>

          <div className="p-4 rounded bg-[#151c27] border border-[#1793D1]/40 text-base sm:text-lg tracking-wide">
            {target.split('').map((ch, idx) => {
              let color = 'text-slate-400';
              if (idx < typed.length) {
                color = typed[idx] === ch ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/20';
              } else if (idx === typed.length) {
                color = 'text-white underline decoration-[#1793D1] decoration-2';
              }
              return (
                <span key={idx} className={color}>
                  {ch}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-[#111722] border border-white/15 px-3 py-2.5 rounded">
            <span className="text-[#1793D1] font-bold">$</span>
            <input
              value={typed}
              onChange={(e) => handleChange(e.target.value)}
              autoFocus
              spellCheck={false}
              placeholder="mulai mengetik..."
              className="bg-transparent outline-none flex-1 text-sm text-white"
            />
          </div>
        </div>
      )}

      <div className="text-[10px] text-slate-500 flex justify-between">
        <span>Arch Linux · pacman / i3wm</span>
        <button onClick={reset} className="hover:text-sky-400">Reset</button>
      </div>
    </div>
  );
};
