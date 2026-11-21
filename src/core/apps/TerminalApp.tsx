import React, { useEffect, useRef, useState } from 'react';
import { DistroConfig } from '../../types/distro';
import { createInitialVfs, getNodeAtPath, resolvePath, VfsNode } from '../vfs';
import { useOSStore } from '../../store/useOSStore';

interface TerminalAppProps {
  distro: DistroConfig;
  windowId: string;
}

interface HistoryEntry {
  id: number;
  prompt?: React.ReactNode;
  command?: string;
  output: React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ distro, windowId }) => {
  const closeWindow = useOSStore((s) => s.closeWindow);
  const homePath = `/home/${distro.username}`;
  const [vfs, setVfs] = useState<VfsNode>(() => createInitialVfs(distro));
  const [cwd, setCwd] = useState<string>(homePath);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [entries, setEntries] = useState<HistoryEntry[]>(() => [
    {
      id: 0,
      output: (
        <div className="text-slate-300 space-y-0.5 mb-2">
          <div>
            Selamat datang di <span className="font-semibold text-white">{distro.name}</span> ({distro.desktop}) — Terminal Simulasi MarinerOS.
          </div>
          <div className="text-slate-400">
            Ketik <span className="text-emerald-400">help</span> untuk daftar perintah, atau{' '}
            <span className="text-sky-400">neofetch</span> untuk melihat info sistem.
          </div>
        </div>
      ),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const displayCwd = cwd === homePath ? '~' : cwd.startsWith(homePath + '/') ? '~' + cwd.slice(homePath.length) : cwd;

  const renderPrompt = (pathLabel: string) => {
    if (distro.terminalPromptStyle === 'kali') {
      return (
        <span className="mr-2">
          <span className="text-sky-400">┌──(</span>
          <span className="text-blue-400 font-bold">{distro.username}㉿{distro.hostname}</span>
          <span className="text-sky-400">)-[</span>
          <span className="text-white font-semibold">{pathLabel}</span>
          <span className="text-sky-400">]</span>
          <span className="text-sky-400 ml-1">$</span>
        </span>
      );
    }
    if (distro.terminalPromptStyle === 'arch') {
      return (
        <span className="mr-2">
          <span className="text-sky-400 font-semibold">[{distro.username}@{distro.hostname}</span>{' '}
          <span className="text-slate-200">{pathLabel === '~' ? '~' : pathLabel.split('/').pop()}</span>
          <span className="text-sky-400 font-semibold">]$</span>
        </span>
      );
    }
    return (
      <span className="mr-2">
        <span style={{ color: distro.theme.accent }} className="font-semibold">
          {distro.username}@{distro.hostname}
        </span>
        <span className="text-slate-400">:</span>
        <span className="text-sky-400 font-semibold">{pathLabel}</span>
        <span className="text-slate-300">$</span>
      </span>
    );
  };

  const renderNeofetch = () => {
    const infoLines = [
      { k: '', v: `${distro.username}@${distro.hostname}`, header: true },
      { k: '', v: '--------------------------', sep: true },
      { k: 'OS', v: distro.education.releaseVersion },
      { k: 'Host', v: 'MarinerOS Web Explorer' },
      { k: 'Kernel', v: distro.education.kernel },
      { k: 'DE/WM', v: distro.desktop },
      { k: 'Packages', v: `1420 (${distro.education.packageManager})` },
      { k: 'Shell', v: distro.id === 'kali' ? 'zsh 5.9' : 'bash 5.2' },
      { k: 'Min RAM', v: distro.education.minRam },
      { k: 'Memory', v: '742MiB / 8192MiB' },
    ];

    return (
      <div className="flex flex-col sm:flex-row gap-4 my-2 text-xs leading-relaxed">
        <pre style={{ color: distro.neofetchColor }} className="font-mono-term text-[11px] leading-tight">
          {distro.neofetchAscii.join('\n')}
        </pre>
        <div className="space-y-0.5">
          {infoLines.map((line, i) =>
            line.header ? (
              <div key={i} className="font-bold" style={{ color: distro.neofetchColor }}>
                {line.v}
              </div>
            ) : line.sep ? (
              <div key={i} className="text-slate-500">
                {line.v}
              </div>
            ) : (
              <div key={i}>
                <span className="font-semibold" style={{ color: distro.neofetchColor }}>
                  {line.k}:
                </span>{' '}
                <span className="text-slate-200">{line.v}</span>
              </div>
            )
          )}
          <div className="flex gap-1.5 pt-2">
            {['#1e293b', '#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#06b6d4', '#f8fafc'].map(
              (c) => (
                <span key={c} className="w-3.5 h-3.5 rounded-xs inline-block" style={{ backgroundColor: c }} />
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    const promptNode = renderPrompt(displayCwd);

    if (!trimmed) {
      setEntries((prev) => [...prev, { id: Date.now() + Math.random(), prompt: promptNode, command: '', output: null }]);
      return;
    }

    setCmdHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const argStr = args.join(' ');
    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="text-slate-300 space-y-1 my-1">
            <div className="text-white font-semibold">Perintah yang tersedia:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
              <div><span className="text-emerald-400">help</span> — Tampilkan bantuan ini</div>
              <div><span className="text-emerald-400">ls [folder]</span> — Daftar isi direktori</div>
              <div><span className="text-emerald-400">cd [folder]</span> — Pindah direktori</div>
              <div><span className="text-emerald-400">pwd</span> — Tampilkan direktori aktif</div>
              <div><span className="text-emerald-400">cat &lt;file&gt;</span> — Baca isi file</div>
              <div><span className="text-emerald-400">mkdir &lt;nama&gt;</span> — Buat folder baru</div>
              <div><span className="text-emerald-400">touch &lt;nama&gt;</span> — Buat file kosong</div>
              <div><span className="text-emerald-400">whoami</span> — Tampilkan nama user</div>
              <div><span className="text-emerald-400">uname -a</span> — Info kernel sistem</div>
              <div><span className="text-emerald-400">neofetch</span> — Info sistem & logo ASCII</div>
              <div><span className="text-emerald-400">date</span> — Tanggal & jam saat ini</div>
              <div><span className="text-emerald-400">clear</span> — Bersihkan layar terminal</div>
              <div><span className="text-emerald-400">exit</span> — Tutup jendela terminal</div>
            </div>
          </div>
        );
        break;

      case 'clear':
        setEntries([]);
        return;

      case 'exit':
        closeWindow(windowId);
        return;

      case 'pwd':
        output = <div className="text-slate-200">{cwd}</div>;
        break;

      case 'whoami':
        output = <div className="text-slate-200">{distro.username}</div>;
        break;

      case 'date':
        output = <div className="text-slate-200">{new Date().toLocaleString('id-ID')}</div>;
        break;

      case 'echo':
        output = <div className="text-slate-200">{argStr}</div>;
        break;

      case 'uname':
        output = (
          <div className="text-slate-200">
            {args.includes('-a')
              ? `Linux ${distro.hostname} ${distro.education.kernel} #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`
              : 'Linux'}
          </div>
        );
        break;

      case 'neofetch':
        output = renderNeofetch();
        break;

      case 'ls': {
        const targetPath = args[0] ? resolvePath(cwd, args[0], homePath) : cwd;
        const node = getNodeAtPath(vfs, targetPath);
        if (!node) {
          output = <div className="text-rose-400">ls: tidak dapat mengakses &apos;{args[0]}&apos;: Tidak ada file atau direktori</div>;
        } else if (node.type === 'file') {
          output = <div className="text-slate-200">{node.name}</div>;
        } else {
          const items = Object.values(node.children || {});
          output = (
            <div className="flex flex-wrap gap-x-5 gap-y-1 my-0.5">
              {items.length === 0 ? (
                <span className="text-slate-500 italic">(kosong)</span>
              ) : (
                items.map((item) => (
                  <span
                    key={item.name}
                    className={item.type === 'dir' ? 'text-sky-400 font-semibold' : 'text-slate-200'}
                  >
                    {item.name}
                    {item.type === 'dir' ? '/' : ''}
                  </span>
                ))
              )}
            </div>
          );
        }
        break;
      }

      case 'cd': {
        const targetPath = resolvePath(cwd, args[0] || '~', homePath);
        const node = getNodeAtPath(vfs, targetPath);
        if (!node || node.type !== 'dir') {
          output = <div className="text-rose-400">cd: {args[0]}: Bukan direktori atau tidak ditemukan</div>;
        } else {
          setCwd(targetPath);
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output = <div className="text-amber-400">Penggunaan: cat &lt;nama-file&gt;</div>;
        } else {
          const targetPath = resolvePath(cwd, args[0], homePath);
          const node = getNodeAtPath(vfs, targetPath);
          if (!node) {
            output = <div className="text-rose-400">cat: {args[0]}: File tidak ditemukan</div>;
          } else if (node.type === 'dir') {
            output = <div className="text-rose-400">cat: {args[0]}: Adalah sebuah direktori</div>;
          } else {
            output = <pre className="text-slate-200 whitespace-pre-wrap font-mono-term text-xs my-1">{node.content}</pre>;
          }
        }
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          output = <div className="text-amber-400">Penggunaan: mkdir &lt;nama-folder&gt;</div>;
        } else {
          const cloned = structuredClone(vfs);
          const currentDir = getNodeAtPath(cloned, cwd);
          if (currentDir && currentDir.type === 'dir') {
            currentDir.children = currentDir.children || {};
            currentDir.children[args[0]] = { name: args[0], type: 'dir', children: {} };
            setVfs(cloned);
            output = <div className="text-emerald-400 text-xs">Folder &apos;{args[0]}&apos; dibuat.</div>;
          }
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          output = <div className="text-amber-400">Penggunaan: touch &lt;nama-file&gt;</div>;
        } else {
          const cloned = structuredClone(vfs);
          const currentDir = getNodeAtPath(cloned, cwd);
          if (currentDir && currentDir.type === 'dir') {
            currentDir.children = currentDir.children || {};
            if (!currentDir.children[args[0]]) {
              currentDir.children[args[0]] = {
                name: args[0],
                type: 'file',
                size: '0 B',
                updated: 'Baru saja',
                content: '',
              };
            }
            setVfs(cloned);
            output = <div className="text-emerald-400 text-xs">File &apos;{args[0]}&apos; dibuat.</div>;
          }
        }
        break;
      }

      default:
        output = (
          <div className="text-rose-400">
            bash: {cmd}: perintah tidak ditemukan. Ketik <span className="text-emerald-400">help</span> untuk daftar perintah.
          </div>
        );
    }

    setEntries((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), prompt: promptNode, command: trimmed, output },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      className="h-full w-full bg-[#0d1117] text-slate-100 font-mono-term text-[13px] p-3.5 overflow-y-auto cursor-text select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {entries.map((entry) => (
        <div key={entry.id} className="mb-1.5">
          {entry.prompt && (
            <div className="flex flex-wrap items-baseline">
              {entry.prompt}
              <span className="text-white">{entry.command}</span>
            </div>
          )}
          {entry.output}
        </div>
      ))}

      <div className="flex items-center">
        {renderPrompt(displayCwd)}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-white caret-emerald-400 min-w-[60px]"
          aria-label="Input perintah terminal"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};
