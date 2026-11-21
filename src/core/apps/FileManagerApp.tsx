import React, { useMemo, useState } from 'react';
import { Folder, FileText, Home, Download, Image, FileCode, ChevronRight, ArrowLeft } from 'lucide-react';
import { DistroConfig } from '../../types/distro';
import { createInitialVfs, getNodeAtPath, VfsNode } from '../vfs';

interface FileManagerAppProps {
  distro: DistroConfig;
  darkMode: boolean;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ distro, darkMode }) => {
  const vfs = useMemo(() => createInitialVfs(distro), [distro]);
  const homePath = `/home/${distro.username}`;
  const [currentPath, setCurrentPath] = useState(homePath);
  const [selectedFile, setSelectedFile] = useState<VfsNode | null>(null);

  const sidebarItems = [
    { label: 'Home', path: homePath, icon: Home },
    { label: 'Desktop', path: `${homePath}/Desktop`, icon: FileCode },
    { label: 'Documents', path: `${homePath}/Documents`, icon: FileText },
    { label: 'Downloads', path: `${homePath}/Downloads`, icon: Download },
    { label: 'Pictures', path: `${homePath}/Pictures`, icon: Image },
  ];

  const currentNode = getNodeAtPath(vfs, currentPath);
  const items = Object.values(currentNode?.children || {}).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const navigateUp = () => {
    if (currentPath === homePath) return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const next = '/' + parts.join('/');
    setCurrentPath(next.startsWith(homePath) ? next : homePath);
    setSelectedFile(null);
  };

  const breadcrumbs = currentPath.replace(homePath, 'Home').split('/').filter(Boolean);

  return (
    <div className={`h-full flex text-sm ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Sidebar */}
      <aside
        className={`w-40 sm:w-44 shrink-0 border-r p-2.5 flex flex-col gap-1 ${
          darkMode ? 'bg-black/20 border-white/10' : 'bg-slate-100/80 border-slate-200'
        }`}
      >
        <div className="text-[11px] uppercase tracking-wider opacity-50 px-2 py-1 font-semibold">
          Lokasi
        </div>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                setCurrentPath(item.path);
                setSelectedFile(null);
              }}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                active
                  ? 'text-white font-medium'
                  : darkMode
                    ? 'hover:bg-white/10 text-slate-300'
                    : 'hover:bg-slate-200/80 text-slate-700'
              }`}
              style={active ? { backgroundColor: distro.theme.accent } : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Path Bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 border-b text-xs ${
            darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={navigateUp}
            disabled={currentPath === homePath}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
            title="Kembali"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 overflow-x-auto">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />}
                <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-medium">
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* File Grid + Preview */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 content-start">
            {items.map((node) => (
              <button
                key={node.name}
                onClick={() => {
                  if (node.type === 'dir') {
                    setCurrentPath(`${currentPath}/${node.name}`);
                    setSelectedFile(null);
                  } else {
                    setSelectedFile(node);
                  }
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                  selectedFile?.name === node.name
                    ? 'border-sky-400 bg-sky-500/15'
                    : darkMode
                      ? 'border-transparent hover:bg-white/8'
                      : 'border-transparent hover:bg-slate-100'
                }`}
              >
                {node.type === 'dir' ? (
                  <Folder
                    className="w-10 h-10 mb-1.5"
                    style={{ color: distro.theme.accent }}
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                ) : (
                  <FileText className="w-10 h-10 mb-1.5 text-slate-400" />
                )}
                <span className="text-xs font-medium break-all line-clamp-2">{node.name}</span>
                {node.size && <span className="text-[10px] opacity-50 mt-0.5">{node.size}</span>}
              </button>
            ))}
          </div>

          {selectedFile && (
            <div
              className={`sm:w-64 border-t sm:border-t-0 sm:border-l p-3 overflow-y-auto ${
                darkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs truncate">{selectedFile.name}</span>
                <span className="text-[10px] opacity-60">{selectedFile.size}</span>
              </div>
              <pre className="text-xs whitespace-pre-wrap font-mono-term opacity-85 leading-relaxed select-text">
                {selectedFile.content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
