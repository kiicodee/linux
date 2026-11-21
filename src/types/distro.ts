export type DistroId =
  | 'ubuntu'
  | 'mint'
  | 'kubuntu'
  | 'kali'
  | 'zorin'
  | 'elementary'
  | 'arch';

export type AppId =
  | 'terminal'
  | 'files'
  | 'settings'
  | 'browser'
  | 'notes'
  | 'about'
  | 'game';

export type LayoutStyle =
  | 'top-left-dock'   // Ubuntu GNOME
  | 'bottom-panel'    // Linux Mint Cinnamon
  | 'kde-plasma'      // Kubuntu KDE Plasma
  | 'top-xfce'        // Kali Linux Xfce
  | 'start-menu'      // Zorin OS (Windows-style)
  | 'macos-dock'      // elementary OS Pantheon
  | 'tiling';         // Arch Linux i3

export interface WallpaperOption {
  id: string;
  name: string;
  background: string;
  preview: string;
}

export interface ThemeTokens {
  accent: string;
  accentSoft: string;
  panelBg: string;
  panelText: string;
  windowBgDark: string;
  windowBgLight: string;
  titlebarBgDark: string;
  titlebarBgLight: string;
  radius: string;
  defaultDark: boolean;
  wallpapers: WallpaperOption[];
}

export interface DistroEducation {
  tagline: string;
  history: string;
  minRam: string;
  minStorage: string;
  packageManager: string;
  baseDistro: string;
  bestFor: string[];
  highlights: string[];
  releaseVersion: string;
  kernel: string;
}

export interface DistroConfig {
  id: DistroId;
  name: string;
  desktop: string;
  shortDesc: string;
  keywords: string[];
  username: string;
  hostname: string;
  layout: LayoutStyle;
  theme: ThemeTokens;
  apps: AppId[];
  defaultAppsOnBoot: AppId[];
  neofetchAscii: string[];
  neofetchColor: string;
  terminalPromptStyle: 'standard' | 'kali' | 'arch' | 'elementary';
  education: DistroEducation;
  pinnedInHomeDock?: boolean;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  workspace: number;
}

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success';
}
