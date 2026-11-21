import { create } from 'zustand';
import { AppId, DistroId, ToastItem, WindowInstance } from '../types/distro';
import { DISTRO_MAP } from '../distros/registry';
import { DISTRO_GAME_META } from '../core/apps/GameApp';

const APP_TITLES: Record<AppId, string> = {
  terminal: 'Terminal',
  files: 'File Manager',
  settings: 'Pengaturan',
  browser: 'Browser',
  notes: 'Catatan',
  about: 'Tentang Sistem',
  game: 'Mini Game',
};

const APP_DEFAULT_SIZES: Record<AppId, { width: number; height: number }> = {
  terminal: { width: 640, height: 400 },
  files: { width: 680, height: 430 },
  settings: { width: 620, height: 440 },
  browser: { width: 760, height: 480 },
  notes: { width: 540, height: 390 },
  about: { width: 580, height: 460 },
  game: { width: 520, height: 460 },
};

interface OSState {
  activeDistroId: DistroId | null;
  bootingDistroId: DistroId | null;
  windows: WindowInstance[];
  topZIndex: number;
  activeWorkspace: number;
  darkMode: boolean;
  wallpaperIndex: number;
  launcherOpen: boolean;
  toasts: ToastItem[];
  infoModalDistroId: DistroId | 'all' | null;

  launchDistro: (id: DistroId, skipBoot?: boolean) => void;
  returnHome: () => void;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  setWorkspace: (ws: number) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  setWallpaperIndex: (idx: number) => void;
  setLauncherOpen: (open: boolean) => void;
  addToast: (message: string, type?: 'info' | 'success') => void;
  removeToast: (id: string) => void;
  setInfoModal: (target: DistroId | 'all' | null) => void;
}

let bootTimer: ReturnType<typeof setTimeout> | null = null;

function createWindowForApp(
  appId: AppId,
  existingCount: number,
  zIndex: number,
  workspace: number,
  distroId?: DistroId | null
): WindowInstance {
  const size = APP_DEFAULT_SIZES[appId];
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const width = Math.min(size.width, vw - 24);
  const height = Math.min(size.height, vh - 110);
  const offset = (existingCount % 5) * 28;
  const x = Math.max(12, Math.min(Math.round((vw - width) / 2) + offset - 30, vw - width - 12));
  const y = Math.max(44, Math.min(Math.round((vh - height) / 2) + offset - 30, vh - height - 64));

  const title =
    appId === 'game' && distroId ? DISTRO_GAME_META[distroId].title : APP_TITLES[appId];

  return {
    id: `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    appId,
    title,
    x,
    y,
    width,
    height,
    zIndex,
    minimized: false,
    maximized: vw < 640,
    workspace,
  };
}

export const useOSStore = create<OSState>((set, get) => ({
  activeDistroId: null,
  bootingDistroId: null,
  windows: [],
  topZIndex: 20,
  activeWorkspace: 1,
  darkMode: true,
  wallpaperIndex: 0,
  launcherOpen: false,
  toasts: [],
  infoModalDistroId: null,

  launchDistro: (id, skipBoot = false) => {
    const distro = DISTRO_MAP[id];
    if (!distro) return;
    if (bootTimer) clearTimeout(bootTimer);

    if (typeof window !== 'undefined' && window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`);
    }

    const finalizeBoot = () => {
      let z = 20;
      const initialWindows = distro.defaultAppsOnBoot.map((appId, idx) =>
        createWindowForApp(appId, idx, ++z, 1)
      );
      set({
        activeDistroId: id,
        bootingDistroId: null,
        windows: initialWindows,
        topZIndex: z,
        activeWorkspace: 1,
        darkMode: distro.theme.defaultDark,
        wallpaperIndex: 0,
        launcherOpen: false,
        infoModalDistroId: null,
      });
      get().addToast(`Berhasil masuk ke ${distro.name} (${distro.desktop})`, 'success');
    };

    if (skipBoot) {
      finalizeBoot();
      return;
    }

    set({ bootingDistroId: id, launcherOpen: false, infoModalDistroId: null });
    bootTimer = setTimeout(finalizeBoot, 850);
  },

  returnHome: () => {
    if (bootTimer) clearTimeout(bootTimer);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    set({
      activeDistroId: null,
      bootingDistroId: null,
      windows: [],
      launcherOpen: false,
    });
  },

  openApp: (appId) => {
    const state = get();
    const distro = state.activeDistroId ? DISTRO_MAP[state.activeDistroId] : null;
    const isTiling = distro?.layout === 'tiling';

    // For non-tiling, if single-instance apps (settings/about/game) are already open, just focus them
    if (!isTiling && (appId === 'settings' || appId === 'about' || appId === 'game')) {
      const existing = state.windows.find((w) => w.appId === appId);
      if (existing) {
        const nextZ = state.topZIndex + 1;
        set({
          windows: state.windows.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: nextZ } : w
          ),
          topZIndex: nextZ,
          launcherOpen: false,
        });
        return;
      }
    }

    const nextZ = state.topZIndex + 1;
    const newWin = createWindowForApp(
      appId,
      state.windows.length,
      nextZ,
      state.activeWorkspace,
      state.activeDistroId
    );
    set({
      windows: [...state.windows, newWin],
      topZIndex: nextZ,
      launcherOpen: false,
    });
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => {
      const nextZ = state.topZIndex + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, maximized: !w.maximized, zIndex: nextZ } : w
        ),
        topZIndex: nextZ,
      };
    }),

  focusWindow: (id) =>
    set((state) => {
      const nextZ = state.topZIndex + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w
        ),
        topZIndex: nextZ,
      };
    }),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  setWorkspace: (ws) => set({ activeWorkspace: ws }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setDarkMode: (dark) => set({ darkMode: dark }),
  setWallpaperIndex: (idx) => set({ wallpaperIndex: idx }),
  setLauncherOpen: (open) => set({ launcherOpen: open }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setInfoModal: (target) => set({ infoModalDistroId: target }),
}));
