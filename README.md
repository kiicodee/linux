# MarinerOS — Linux Interface Explorer

> **“Coba tampilan Linux apa pun langsung dari browser, sebelum memutuskan memakainya.”**

**MarinerOS** adalah aplikasi web statis interaktif yang memungkinkan pengguna mencoba antarmuka berbagai distro Linux populer langsung dari browser — tanpa Live USB, tanpa instalasi, dan tanpa Virtual Machine.

Pengguna pertama kali masuk ke desktop netral **MarinerOS** (dibangun dari desain `linux-interface.svg`), lalu dapat mengklik ikon distro mana saja untuk merasakan tata letak panel, launcher, tema ikon, aplikasi inti, terminal, hingga mini-game bertema masing-masing distro.

---

## Tech Stack

| Kategori | Teknologi | Versi / Peran |
| --- | --- | --- |
| **UI Framework** | React + TypeScript | React 19 + TypeScript 5.8 untuk komponen antarmuka & type safety |
| **Build Tool** | Vite | Vite 6 untuk dev server HMR cepat & production bundle ringan |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/vite` untuk styling responsif, glassmorphism, dan animasi |
| **State Management** | Zustand | State global ringan untuk window manager, distro aktif, workspace, tema, dan notifikasi |
| **Ikon UI** | Lucide React + Custom SVG | Ikon antarmuka sistem + logo SVG kustom untuk 7 distro Linux |
| **Tipografi** | Plus Jakarta Sans, Inter, JetBrains Mono | Sans-serif geometris untuk UI & monospace untuk Terminal / Polybar / i3 |
| **Hosting Target** | Vercel (Static SPA) | Tanpa backend, 100% berjalan di sisi klien (browser) |

---

## Fitur Utama

### 1. Halaman Utama MarinerOS
- **Desain autentik dari SVG**: Wallpaper abu-gelap kebiruan dengan watermark Tux, jam real-time di tengah atas, 3 ikon status interaktif di kanan atas, search bar pill, grid ikon distro, dan dock bawah (`#50585A`).
- **Pencarian cepat**: Filter distro berdasarkan nama, Desktop Environment (`GNOME`, `KDE`, `Xfce`, `Cinnamon`, `Pantheon`, `i3`), atau gaya (`Windows`, `macOS`, `tiling`). Tekan `Enter` untuk langsung boot ke hasil teratas.
- **Panduan Bubble Interaktif (First-Visit Tour)**: Spotlight tour 5 langkah khusus pada halaman MarinerOS saat kunjungan pertama (bisa **Lewati**, **Kembali**, **Lanjut**, atau diulang kapan saja dari menu status kanan atas).
- **Edukasi & Perbandingan Distro**: Ikon **Info Distro** dan tombol `i` di tiap distro menampilkan sejarah singkat, kebutuhan RAM & penyimpanan minimum, package manager, basis distro, serta rekomendasi kecocokan pengguna.
- **Dock Distro Populer**: Akses cepat ke Ubuntu, Linux Mint, Kali Linux, dan Arch Linux langsung dari dock bawah.
- **Responsif**: Mendukung layar desktop, tablet, dan ponsel.

### 2. 7 Simulasi Distro Linux Autentik
Setiap distro memiliki **wallpaper khas**, **tema ikon tersendiri**, **panel/dock**, dan **gaya launcher** sesuai distro aslinya:

| Distro | Desktop Environment | Tampilan & Perilaku Khas | Mini-Game Eksklusif |
| --- | --- | --- | --- |
| **Ubuntu** | GNOME (Yaru) | Top bar `#1d1d1d`, dock vertikal kiri + Trash + tombol 9-dot Show Applications, Activities overview, folder `Home` kanan bawah | **Jellyfish Dash** (Arcade Canvas) |
| **Linux Mint** | Cinnamon (Mint-Y) | Panel bawah `#262626`, Update Shield di tray, ikon desktop kiri atas, dan **Menu Cinnamon 3 kolom** (rail favorit/daya, kategori, daftar aplikasi) | **Mint Leaf Snake** (Classic Snake) |
| **Kubuntu** | KDE Plasma 6 (Breeze) | Floating panel bawah, **Kickoff Launcher** (`Applications` & `Places`), widget jam transparan di desktop | **Plasma Circuit** (5×5 Lights-Out Puzzle) |
| **Kali Linux** | Xfce (Flat-Remix-Blue) | Top panel dengan switcher workspace `1–4`, mini bar CPU, `eth0`, **Whisker Menu** kategori security tools (`nmap`, `wireshark`, `burpsuite`, dll.), prompt terminal 2-baris | **Cyber Breach** (4-Digit Firewall PIN Cracker) |
| **Zorin OS** | Zorin Desktop (Windows-style) | Taskbar bawah ala Windows + **Start Menu 2 kolom** dengan search, Places, dan Zorin Appearance | **Zorin Tiles 2048** (Sliding 2048) |
| **elementary OS** | Pantheon | Top Wingpanel transparan, **Slingshot Applications**, dan **Plank Dock** frosted glass dengan efek hover zoom ala macOS | **Pantheon Zen Memory** (4×4 Memory Card) |
| **Arch Linux** | i3 (Tiling WM) | **Polybar** atas dengan workspace bernama (`1:term`–`4:sys`), **Rofi** launcher (`Alt+D`), dan jendela tersusun otomatis (**auto-tiling**) | **Pacman Speed Typer** (30s Terminal Typing Challenge) |

### 3. Kerangka Bersama & Aplikasi Inti
- **Transisi Boot**: Animasi splash screen singkat (`~0,85 detik`) dengan logo dan warna aksen distro.
- **Window Manager**: Buka, tutup, minimize, maximize, drag (mouse & sentuh), fokus z-index, serta layout **auto-tiling** khusus Arch i3.
- **Terminal Emulator**: Mendukung perintah `help`, `ls`, `cd`, `pwd`, `cat`, `mkdir`, `touch`, `whoami`, `uname -a`, `neofetch` (dengan ASCII art per distro), `date`, `echo`, `clear`, `exit`, plus riwayat perintah (`↑`/`↓`).
- **File Manager Virtual**: Navigasi folder (`Home`, `Desktop`, `Documents`, `Downloads`, `Pictures`), breadcrumb, dan pratinjau isi file.
- **Pengaturan (Settings)**: Ganti wallpaper (termasuk wallpaper bawaan & alternatif), toggle **Mode Terang / Gelap**, dan salin tautan distro.
- **Browser Mock, Catatan (Text Editor), dan Info Distro (About System)**.
- **Deep Link & Navigasi Cepat**: URL hash langsung per distro (`/#ubuntu`, `/#mint`, `/#kubuntu`, `/#kali`, `/#zorin`, `/#elementary`, `/#arch`), tombol mengambang **Kembali ke MarinerOS**, serta pintasan keyboard `Esc`.

---

## Struktur Proyek & Penjelasan Komponen

```text
linux-interface/
├── public/assets/
│   ├── mariner-wallpaper.png       # Wallpaper Tux diekstrak dari linux-interface.svg
│   ├── status-icon-[1-3].png       # Ikon status top-right dari SVG
│   └── wallpapers/                 # 7 wallpaper khas untuk masing-masing distro
├── src/
│   ├── App.tsx                     # Root app, sinkronisasi hash URL (#ubuntu, dst.) & transisi boot
│   ├── main.tsx                    # Entry point React
│   ├── index.css                   # Konfigurasi Tailwind v4, font, animasi boot & window
│   ├── types/
│   │   └── distro.ts               # Definisi tipe TypeScript (DistroConfig, WindowInstance, AppId, dll.)
│   ├── store/
│   │   └── useOSStore.ts           # Zustand store: distro aktif, window manager, workspace, tema, toast
│   ├── distros/
│   │   ├── registry.ts             # Konfigurasi data-driven untuk 7 distro (tema, neofetch, edukasi, apps)
│   │   └── icons.tsx               # Logo SVG kustom 7 distro & ikon Info Distro
│   ├── home/
│   │   ├── MarinerHome.tsx         # Halaman utama MarinerOS (top bar, search, grid ikon, dock)
│   │   ├── MarinerTour.tsx         # Bubble spotlight onboarding tour khusus MarinerOS
│   │   └── DistroInfoModal.tsx     # Modal edukasi & perbandingan spesifikasi 7 distro
│   ├── shell/
│   │   ├── DistroDesktop.tsx       # Container desktop distro, pintasan keyboard (Esc, Alt+...), tombol kembali
│   │   ├── ShellChrome.tsx         # Router shell berdasarkan layout distro
│   │   ├── UbuntuShell.tsx         # GNOME top bar, Yaru left dock, Activities overview
│   │   ├── MintShell.tsx           # Cinnamon bottom panel, 3-column Mint Menu, desktop icons
│   │   ├── KubuntuShell.tsx        # Plasma 6 floating panel, Kickoff launcher, desktop clock widget
│   │   ├── KaliShell.tsx           # Xfce top panel, workspace switcher, Kali Whisker Menu
│   │   ├── ZorinShell.tsx          # Windows-style taskbar & 2-column Zorin Start Menu
│   │   ├── ElementaryShell.tsx     # Wingpanel, Slingshot popover, Plank frosted dock
│   │   └── ArchShell.tsx           # Polybar status bar, workspace 1–4, Rofi fuzzy launcher
│   └── core/
│       ├── WindowManager.tsx       # Floating window manager + Arch i3 auto-tiling layout
│       ├── AppIcon.tsx             # Tema ikon aplikasi yang menyesuaikan gaya tiap distro
│       ├── BootSplash.tsx          # Layar transisi boot distro
│       ├── ToastContainer.tsx      # Notifikasi toast mengambang
│       ├── useClock.ts             # Hook jam real-time format Indonesia
│       ├── vfs.ts                  # Virtual File System di memori (berbagi struktur Terminal & Files)
│       └── apps/
│           ├── TerminalApp.tsx     # Emulator terminal + neofetch per distro
│           ├── FileManagerApp.tsx  # File manager virtual + pratinjau file
│           ├── SettingsApp.tsx     # Pengaturan wallpaper, dark/light mode, share link
│           ├── BrowserApp.tsx      # Browser simulasi
│           ├── TextEditorApp.tsx   # Editor catatan sederhana
│           ├── AboutApp.tsx        # Info sistem & edukasi distro
│           ├── GameApp.tsx         # Dispatcher mini-game per distro
│           └── games/              # 7 mini-game eksklusif (Ubuntu, Mint, Kubuntu, Kali, Zorin, elementary, Arch)
├── vercel.json                     # Konfigurasi deployment & SPA rewrite untuk Vercel
└── package.json                    # Skrip & dependensi proyek
```

---

## Pintasan Keyboard

- **Di MarinerOS Home**:
  - `Enter` di Search Bar: Boot ke distro hasil pencarian teratas
  - `→` / `Enter` / `←` / `Esc` saat Bubble Tour aktif: Navigasi atau lewati tur
- **Di Dalam Distro**:
  - `Esc`: Tutup launcher yang terbuka, atau kembali ke MarinerOS
- **Khusus Arch Linux (i3wm)**:
  - `Alt + Enter`: Buka Terminal baru (otomatis ter-tile)
  - `Alt + D`: Buka / tutup Rofi Launcher
  - `Alt + 1` s/d `Alt + 4`: Pindah Workspace `1–4`
  - `Alt + Q`: Tutup jendela yang sedang fokus

---

## Menjalankan Secara Lokal

Pastikan Node.js (v18+) sudah terinstal:

```bash
# 1. Instal dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Build produksi (typecheck + bundle)
npm run build

# 4. Pratinjau hasil build produksi
npm run preview
```

---

## Deploy ke Vercel

Proyek ini sudah dilengkapi dengan `vercel.json` untuk routing SPA dan caching aset statis.

### Opsi 1: Via GitHub + Dashboard Vercel (Disarankan)
1. Push repositori ini ke GitHub/GitLab/Bitbucket.
2. Buka [vercel.com/new](https://vercel.com/new) dan impor repositori.
3. Vercel otomatis mendeteksi **Vite** (`Build Command: npm run build`, `Output Directory: dist`).
4. Klik **Deploy**.

### Opsi 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
# Untuk deploy produksi:
vercel --prod
```

---

## Disclaimer Merek Dagang

Semua nama dan logo distro Linux (Ubuntu, Linux Mint, Kubuntu, Kali Linux, Zorin OS, elementary OS, Arch Linux) adalah merek dagang milik masing-masing pemegang haknya. **MarinerOS — Linux Interface Explorer** adalah proyek simulasi edukasi berbasis web dan tidak berafiliasi secara resmi dengan pemilik distro mana pun.
