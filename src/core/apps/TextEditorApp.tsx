import React, { useState } from 'react';
import { DistroConfig } from '../../types/distro';

interface TextEditorAppProps {
  distro: DistroConfig;
  darkMode: boolean;
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ distro, darkMode }) => {
  const [text, setText] = useState(
    `Catatan Eksplorasi ${distro.name}\n================================\n\n- Desktop Environment: ${distro.desktop}\n- Kesan pertama:\n  Tulis catatan atau eksperimen kamu di sini...\n`
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="h-full flex flex-col">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className={`flex-1 w-full p-4 resize-none outline-none font-mono-term text-xs leading-relaxed select-text ${
          darkMode ? 'bg-[#161920] text-slate-100' : 'bg-white text-slate-800'
        }`}
      />
      <div
        className={`px-3 py-1.5 text-[11px] border-t flex items-center justify-between ${
          darkMode ? 'border-white/10 bg-black/25 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        <span>catatan.txt (sementara)</span>
        <span>
          {words} kata · {text.length} karakter
        </span>
      </div>
    </div>
  );
};
