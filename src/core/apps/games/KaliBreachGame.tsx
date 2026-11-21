import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, Unlock } from 'lucide-react';

function generatePin(): string {
  let s = '';
  for (let i = 0; i < 4; i++) s += Math.floor(Math.random() * 10);
  return s;
}

type CellState = 'exact' | 'misplaced' | 'miss';

interface Attempt {
  guess: string;
  states: CellState[];
}

function evaluateGuess(secret: string, guess: string): CellState[] {
  const res: CellState[] = ['miss', 'miss', 'miss', 'miss'];
  const remaining: Record<string, number> = {};

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      res[i] = 'exact';
    } else {
      remaining[secret[i]] = (remaining[secret[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < 4; i++) {
    if (res[i] === 'exact') continue;
    if (remaining[guess[i]] > 0) {
      res[i] = 'misplaced';
      remaining[guess[i]]--;
    }
  }
  return res;
}

export const KaliBreachGame: React.FC = () => {
  const [secret, setSecret] = useState(generatePin);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [streak, setStreak] = useState(0);

  const won = attempts.some((a) => a.guess === secret);
  const lost = !won && attempts.length >= 8;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (won || lost || !/^\d{4}$/.test(input)) return;
    const states = evaluateGuess(secret, input);
    setAttempts((prev) => [...prev, { guess: input, states }]);
    if (input === secret) setStreak((s) => s + 1);
    setInput('');
  };

  const reset = () => {
    setSecret(generatePin());
    setAttempts([]);
    setInput('');
  };

  return (
    <div className="h-full w-full bg-[#0b1019] text-slate-100 font-mono-term p-4 flex flex-col justify-between overflow-y-auto">
      <div className="flex items-center justify-between text-xs border-b border-blue-500/25 pb-2.5">
        <div className="flex items-center gap-2 text-[#367BF0] font-bold">
          <ShieldAlert className="w-4 h-4" /> Cyber Breach: Firewall PIN
        </div>
        <div className="text-slate-400">
          Streak: <span className="text-emerald-400 font-bold">{streak}</span> · Sisa:{' '}
          <span className="text-sky-400">{8 - attempts.length}</span>
        </div>
      </div>

      <div className="my-2 text-[11px] text-slate-400 space-y-1">
        <div>Retas 4-digit PIN firewall (0–9) dalam 8 percobaan.</div>
        <div className="flex flex-wrap gap-3">
          <span className="text-emerald-400">■ Hijau: Benar &amp; posisi tepat</span>
          <span className="text-amber-400">■ Kuning: Ada, posisi salah</span>
          <span className="text-slate-500">■ Abu: Tidak ada</span>
        </div>
      </div>

      {/* Attempts Log */}
      <div className="flex-1 overflow-y-auto space-y-1.5 my-2 pr-1">
        {attempts.length === 0 && (
          <div className="text-xs text-slate-500 italic py-6 text-center">
            Menunggu payload 4-digit pertama... (contoh: 1337)
          </div>
        )}
        {attempts.map((a, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[#131b2b] px-3 py-1.5 rounded border border-white/8">
            <span className="text-[11px] text-slate-500">#{idx + 1}</span>
            <div className="flex gap-2">
              {a.guess.split('').map((ch, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 rounded flex items-center justify-center font-bold text-sm ${
                    a.states[i] === 'exact'
                      ? 'bg-emerald-500 text-slate-950'
                      : a.states[i] === 'misplaced'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {ch}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-sky-400">
              {a.guess === secret ? 'ACCESS GRANTED' : 'DENIED'}
            </span>
          </div>
        ))}
      </div>

      {/* Input or End State */}
      {won || lost ? (
        <div className="p-3 rounded-lg bg-[#131b2b] border border-blue-500/35 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Unlock className={`w-4 h-4 ${won ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span>
              {won ? `Firewall ditembus dalam ${attempts.length} langkah!` : `Gagal! PIN asli: ${secret}`}
            </span>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#367BF0] hover:bg-blue-500 text-xs font-bold text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Target Baru
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="Masukkan 4 digit (mis. 4029)"
            autoFocus
            className="flex-1 px-3 py-2 rounded bg-[#131b2b] border border-[#367BF0]/50 outline-none text-sm text-white tracking-widest"
          />
          <button
            type="submit"
            disabled={input.length !== 4}
            className="px-4 py-2 rounded bg-[#367BF0] hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white"
          >
            INJECT
          </button>
        </form>
      )}
    </div>
  );
};
