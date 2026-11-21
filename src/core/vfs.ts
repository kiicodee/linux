import { DistroConfig } from '../types/distro';

export interface VfsNode {
  name: string;
  type: 'dir' | 'file';
  content?: string;
  children?: Record<string, VfsNode>;
  size?: string;
  updated?: string;
}

export function createInitialVfs(distro: DistroConfig): VfsNode {
  return {
    name: '',
    type: 'dir',
    children: {
      home: {
        name: 'home',
        type: 'dir',
        children: {
          [distro.username]: {
            name: distro.username,
            type: 'dir',
            children: {
              Desktop: {
                name: 'Desktop',
                type: 'dir',
                children: {
                  'selamat-datang.txt': {
                    name: 'selamat-datang.txt',
                    type: 'file',
                    size: '284 B',
                    updated: 'Hari ini',
                    content: `Selamat datang di simulasi ${distro.name} (${distro.desktop})!\n\nIni adalah bagian dari MarinerOS — Linux Interface Explorer.\nCoba ketik 'neofetch' atau 'help' di Terminal, atau tekan Esc untuk kembali ke MarinerOS.`,
                  },
                },
              },
              Documents: {
                name: 'Documents',
                type: 'dir',
                children: {
                  'tentang-distro.md': {
                    name: 'tentang-distro.md',
                    type: 'file',
                    size: '512 B',
                    updated: 'Hari ini',
                    content: `# ${distro.name}\n\nDesktop Environment: ${distro.desktop}\nVersi: ${distro.education.releaseVersion}\nPackage Manager: ${distro.education.packageManager}\nRAM Minimum: ${distro.education.minRam}\n\n${distro.education.history}`,
                  },
                  'perintah-linux.txt': {
                    name: 'perintah-linux.txt',
                    type: 'file',
                    size: '340 B',
                    updated: 'Kemarin',
                    content: `Daftar Perintah Dasar Terminal:\n- ls       : Melihat isi folder\n- cd       : Berpindah folder\n- pwd      : Melihat lokasi folder saat ini\n- cat      : Membaca isi file\n- whoami   : Nama pengguna aktif\n- uname -a : Info kernel Linux\n- neofetch : Info sistem & logo ASCII\n- clear    : Bersihkan layar`,
                  },
                },
              },
              Downloads: {
                name: 'Downloads',
                type: 'dir',
                children: {
                  'mariner-explorer-guide.txt': {
                    name: 'mariner-explorer-guide.txt',
                    type: 'file',
                    size: '192 B',
                    updated: 'Hari ini',
                    content: `Panduan Cepat MarinerOS:\n1. Jelajahi menu aplikasi di panel.\n2. Buka Terminal, Files, atau Settings.\n3. Ganti wallpaper dan tema terang/gelap di Settings.`,
                  },
                },
              },
              Pictures: {
                name: 'Pictures',
                type: 'dir',
                children: {
                  'wallpaper-notes.txt': {
                    name: 'wallpaper-notes.txt',
                    type: 'file',
                    size: '128 B',
                    updated: 'Hari ini',
                    content: `Wallpaper bawaan ${distro.name} bisa diganti kapan saja melalui aplikasi Settings > Tampilan.`,
                  },
                },
              },
              'README.txt': {
                name: 'README.txt',
                type: 'file',
                size: '210 B',
                updated: 'Hari ini',
                content: `Halo ${distro.username}!\nKamu sedang mencoba antarmuka ${distro.name} (${distro.desktop}) langsung dari browser.\nKetik 'neofetch' di Terminal untuk melihat spesifikasi simulasi.`,
              },
            },
          },
        },
      },
    },
  };
}

export function resolvePath(cwd: string, target: string, homePath: string): string {
  if (!target || target === '~') return homePath;
  let expanded = target.startsWith('~/') ? `${homePath}/${target.slice(2)}` : target;
  if (!expanded.startsWith('/')) {
    expanded = `${cwd}/${expanded}`;
  }
  const parts = expanded.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

export function getNodeAtPath(root: VfsNode, path: string): VfsNode | null {
  const parts = path.split('/').filter(Boolean);
  let current: VfsNode = root;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }
  return current;
}
