# PRD — Linux Interface Explorer (MarinniersOS)

Versi 0.1 (draft) · 21 November 2026 · Pemilik produk: Kii

## 1. Ringkasan

**Linux Interface Explorer** adalah website interaktif yang membantu orang melihat seperti apa tampilan berbagai distro Linux (Ubuntu, Linux Mint, KDE Plasma, dll.) tanpa harus menginstal atau menjalankan VM.

Pengguna pertama kali masuk ke **MarinniersOS**, sebuah desktop Linux “netral” yang menjadi halaman utama dan pemilih. Ikon-ikon di MarinniersOS diganti dengan **ikon distro**. Saat ikon distro diklik, tampil **simulasi antarmuka distro tersebut** lengkap dengan fungsi minimal seperti aslinya (menu aplikasi, jendela, terminal, file manager, pengaturan).

**Satu kalimat nilai produk:** “Coba tampilan Linux apa pun langsung dari browser, sebelum memutuskan memakainya.”

## 2. Latar Belakang & Masalah

- Orang yang ingin pindah ke Linux bingung memilih distro karena sulit membayangkan tampilannya. Screenshot statis tidak menunjukkan *rasa* memakainya (letak menu, perilaku dock, alur membuka aplikasi).
- Mencoba langsung butuh Live USB atau VM, yang terlalu berat hanya untuk “melihat-lihat”.
- Belum ada pengalaman ringan yang bisa dicoba dalam hitungan detik dan dibagikan lewat link.

## 3. Tujuan & Non-Tujuan

### Tujuan

1. Menyediakan halaman utama MarinniersOS yang menjadi pemilih distro berbasis ikon.
2. Menampilkan antarmuka tiap distro yang mudah dikenali (tata letak panel, launcher, warna, ikon, perilaku khas).
3. Menyediakan fungsi minimal yang interaktif di tiap distro agar terasa seperti OS sungguhan.
4. Berjalan penuh di browser (statis, tanpa backend) dan cepat dimuat.
5. Mudah menambah distro baru lewat konfigurasi, bukan menulis ulang kode.

### Non-Tujuan (di luar cakupan)

- Bukan emulator atau VM; tidak menjalankan kernel/aplikasi Linux sungguhan.
- Bukan pengganti dokumentasi instalasi atau panduan memilih distro yang lengkap.
- Tidak ada akun pengguna, login, atau penyimpanan data di server pada versi awal.
- Tidak mensimulasikan seluruh aplikasi; hanya sekumpulan kecil aplikasi inti.

## 4. Target Pengguna

| Persona | Kebutuhan | Hal yang dicari |
| --- | --- | --- |
| Pemula pindahan Windows/macOS | Melihat distro mana yang terasa familiar | Tampilan mirip Windows (Zorin), mirip macOS (elementary) |
| Pelajar / mahasiswa | Belajar dasar antarmuka dan terminal Linux | Terminal simulasi, struktur folder |
| Penggemar Linux / ricing | Membandingkan DE dan gaya tampilan | Perbedaan GNOME, Cinnamon, Plasma, tiling |
| Pengajar / komunitas | Alat bantu demo saat workshop | Link langsung ke distro tertentu |

## 5. Analisis Base: MarinniersOS (dari file SVG)

Base diambil dari file `linux-interface.svg` (kanvas **1280 × 832 px**, rasio sekitar 1,54:1). Hasil bedah elemen:

| Elemen | Deskripsi | Peran di produk |
| --- | --- | --- |
| Wallpaper | Latar abu-gelap kebiruan dengan watermark Tux besar semi-transparan di tengah | Identitas MarinniersOS; dipertahankan |
| Top bar | Jam “Sat 13:18” di tengah atas; 3 ikon status (25 × 25 px) di kanan atas | Dibuat hidup: jam real-time, ikon status bisa diklik (panel info singkat) |
| Search bar | Pill 409 × 64 px, radius penuh, outline abu-abu, placeholder “Search...” | Mencari distro berdasarkan nama, DE, atau kata kunci |
| Grid ikon desktop | 7 ikon (±56 px) dengan label putih: baris 1 berisi 5 ikon, baris 2 berisi 2 ikon. Saat ini: CSGO, Weather, To do-list, Chrome, Settings, Camera, Terminal | **Placeholder**; diganti ikon distro |
| Dock | Kapsul 402 × 75 px, radius 23, warna `#50585A`, di tengah bawah. Saat ini 4 ikon: Instagram, Facebook, Twitter, Gmail | Placeholder; diusulkan jadi shortcut fitur (lihat Pertanyaan Terbuka) |

**Catatan:** 7 slot ikon pada base kebetulan pas untuk **7 distro MVP**.

## 6. Konsep Produk & Alur Pengguna

### Alur utama

1. Pengguna membuka website dan melihat **MarinniersOS** (home).
2. Pengguna melihat 7 ikon distro dengan nama di bawahnya; hover menampilkan tooltip singkat (nama distro + desktop environment).
3. Pengguna klik ikon distro (atau cari lewat search bar lalu Enter).
4. Muncul **transisi boot singkat** (logo distro, 0,6–1,2 detik) lalu **desktop distro** tampil layar penuh di dalam browser.
5. Pengguna mencoba menu, membuka aplikasi, memakai terminal, mengubah pengaturan sederhana.
6. Pengguna kembali ke MarinniersOS lewat tombol “Kembali” (pill mengambang), tombol `Esc`, atau menu daya di panel distro.
7. Pengguna memilih distro lain atau membagikan link ke distro tersebut (`/#ubuntu`, `/#mint`, dst.).

### Prinsip desain

- **Dikenali sekilas:** tata letak panel dan warna harus langsung mengingatkan pada distro aslinya.
- **Ringan:** distro dimuat saat dibutuhkan (lazy load), bukan semua sekaligus.
- **Konsisten:** semua distro memakai kerangka yang sama (window manager, terminal, file manager); yang berbeda adalah tema dan perilaku khas.

## 7. Kebutuhan Fungsional

Prioritas: **P0** wajib untuk MVP, **P1** penting, **P2** nanti.

### 7.1 Halaman MarinniersOS (home)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | Render base sesuai desain SVG: wallpaper Tux, top bar, search bar, grid ikon, dock | P0 |
| FR-02 | Ikon placeholder diganti ikon distro; label di bawah ikon | P0 |
| FR-03 | Klik ikon membuka antarmuka distro terkait dengan transisi boot | P0 |
| FR-04 | Jam di top bar berjalan real-time | P0 |
| FR-05 | Hover/fokus ikon menampilkan tooltip (nama, DE, ciri khas) | P1 |
| FR-06 | Search bar memfilter/menyorot ikon distro; Enter membuka hasil teratas | P1 |
| FR-07 | Tampilan skala otomatis mengikuti ukuran layar dengan rasio base dipertahankan | P0 |
| FR-08 | Dock berisi shortcut fitur (Tentang, Bandingkan, Bagikan) | P2 |

### 7.2 Kerangka bersama semua distro

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-10 | Window manager sederhana: buka, tutup, minimize, maximize, drag, fokus jendela | P0 |
| FR-11 | Launcher/menu aplikasi sesuai gaya distro | P0 |
| FR-12 | Terminal simulasi dengan perintah dasar (`help`, `ls`, `cd`, `pwd`, `cat`, `whoami`, `uname -a`, `neofetch`, `clear`) | P0 |
| FR-13 | File manager dengan file system virtual (Home, Documents, Downloads, Pictures) | P1 |
| FR-14 | Aplikasi Settings: ganti wallpaper dan mode terang/gelap | P1 |
| FR-15 | Panel atas/bawah dengan jam, ikon status, dan menu daya (kembali ke MarinniersOS) | P0 |
| FR-16 | Notifikasi sederhana (toast) saat aksi tertentu | P2 |
| FR-17 | Tombol “Kembali ke MarinniersOS” dan pintasan `Esc` | P0 |
| FR-18 | Deep link per distro lewat hash URL | P1 |

### 7.3 Aplikasi minimal di tiap distro

- **Terminal** (wajib, FR-12)
- **File Manager** (FR-13)
- **Settings** (FR-14)
- **Browser mock**: halaman statis sederhana (P1)
- **Text Editor / Catatan**: bisa mengetik, tanpa simpan permanen (P2)
- **About this system**: info distro, versi, DE, kebutuhan minimum (P1)

## 8. Spesifikasi Per Distro (MVP: 7 distro)

Daftar ini adalah usulan awal dan bisa diganti sesuai preferensi.

| Distro | Desktop Environment | Ciri khas yang disimulasikan | Fungsi minimal |
| --- | --- | --- | --- |
| Ubuntu | GNOME (gaya Ubuntu) | Top bar, dock vertikal di kiri, Activities overview, warna aubergine/oranye | Activities + grid aplikasi, dock, terminal, files |
| Linux Mint | Cinnamon | Panel bawah, menu “Mint” di kiri, system tray di kanan, warna hijau | Menu bertingkat, panel, terminal, files |
| Kubuntu | KDE Plasma | Panel bawah, launcher Kickoff, widget, jendela dengan tombol kustom | Kickoff, task manager, terminal, files |
| Kali Linux | Xfce | Panel atas, tema gelap, menu kategori tools | Menu kategori, terminal bergaya Kali, files |
| Zorin OS | GNOME (gaya Windows) | Taskbar bawah, tombol Start, menu mirip Windows | Start menu, taskbar, terminal, files |
| elementary OS | Pantheon | Panel atas minimal, dock bawah, gaya mirip macOS | Dock, panel, AppCenter mock, terminal |
| Arch Linux | i3 (tiling) | Jendela tersusun otomatis, status bar, kontrol keyboard | `Mod+Enter` buka terminal, tiling, workspace 1–4 |

## 9. Kebutuhan Non-Fungsional

| Aspek | Target |
| --- | --- |
| Performa | Halaman MarinniersOS tampil < 2,5 detik (LCP) pada koneksi 4G; transisi masuk distro < 1,5 detik |
| Ukuran | Bundle awal ringan; tiap distro dimuat terpisah saat dibuka |
| Responsivitas | Desktop-first (≥ 1024 px); tablet didukung; ponsel menampilkan mode terbatas atau saran membuka dari desktop (P2) |
| Aksesibilitas | Navigasi keyboard (Tab, Enter, Esc), fokus terlihat jelas, kontras teks memadai |
| Bahasa | UI berbahasa Indonesia, dengan opsi Inggris (P2) |
| Privasi | Tanpa akun, tanpa cookie pelacak; analitik hanya agregat dan anonim |
| Kompatibilitas | Browser modern (Chrome, Edge, Firefox, Safari versi terbaru) |

## 10. Arsitektur Teknis (Usulan)

- **Stack:** React + TypeScript + Vite, Tailwind CSS untuk styling, state ringan (Zustand).
- **Hosting:** statis (CDN), tanpa backend.
- **Aset:** ikon dan UI dalam SVG; base MarinniersOS dipecah dari SVG menjadi komponen (jangan memakai satu gambar utuh agar ikon bisa diganti dan diklik).
- **Terminal:** emulator buatan sendiri dengan daftar perintah terbatas dan file system virtual di memori.
- **Per-distro dikonfigurasi lewat data**, contoh:

```ts
interface DistroConfig {
  id: string;            // "ubuntu"
  name: string;          // "Ubuntu"
  desktop: string;       // "GNOME"
  icon: string;          // path ikon di MarinniersOS
  theme: ThemeTokens;    // warna, font, radius, wallpaper
  layout: "top-left-dock" | "bottom-panel" | "tiling" | "start-menu";
  launcher: LauncherType;
  apps: AppId[];         // aplikasi yang tersedia
  neofetch: string[];    // keluaran perintah neofetch
}
```

- **Struktur modul:** `core/` (window manager, terminal, file system), `shell/` (komponen panel/launcher per gaya), `distros/` (config + tema per distro), `home/` (MarinniersOS).

## 11. Desain & Aset

- Base mengikuti desain SVG yang sudah ada (palet abu-gelap kebiruan, dock `#50585A`, tipografi sans-serif geometris untuk label).
- Setiap distro punya **design token** sendiri: warna aksen, font, radius sudut, gaya panel, wallpaper.
- **Logo dan nama distro adalah merek dagang** pemiliknya. Gunakan sesuai brand guideline masing-masing, tampilkan keterangan bahwa proyek ini tidak berafiliasi, dan periksa lisensi wallpaper serta font sebelum dipakai.
- Watermark Tux dari base perlu dipastikan sumber dan lisensinya.

## 12. Rencana Rilis (Usulan)

| Fase | Cakupan | Hasil |
| --- | --- | --- |
| 0. Fondasi | Pecah SVG jadi komponen, halaman MarinniersOS responsif, jam, tooltip | Home yang hidup |
| 1. MVP | Window manager + terminal + 3 distro (Ubuntu, Linux Mint, Kubuntu), transisi boot, tombol kembali | Bisa dicoba dan diuji |
| 2. Lengkap | 4 distro tersisa (Kali, Zorin, elementary, Arch/i3), file manager, settings, search bar | 7 distro lengkap |
| 3. Polesan | Deep link, mode Inggris, halaman info distro, dock shortcut, optimasi performa | Siap rilis publik |

## 13. Metrik Keberhasilan (Target Awal)

- Lebih dari 70% pengunjung membuka minimal satu distro.
- Rata-rata 2,5 distro atau lebih dibuka per sesi.
- Rata-rata waktu di situs lebih dari 3 menit.
- Transisi ke distro kurang dari 1,5 detik pada perangkat menengah.
- Pengguna yang membagikan link distro (tingkat share) di atas 5%.

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Isu merek dagang dan lisensi aset | Takedown atau masalah hukum | Ikuti brand guideline, tambah disclaimer, gunakan aset berlisensi bebas |
| Scope creep (terlalu banyak fungsi per distro) | Proyek tidak selesai | Tetapkan fungsi minimal (bagian 7.3) dan rilis bertahap |
| Tampilan kurang akurat | Pengguna kecewa atau salah paham | Gunakan screenshot resmi sebagai referensi, uji dengan pengguna distro asli |
| Performa berat di perangkat lemah | Lambat dan patah-patah | Lazy load per distro, animasi ringan, hindari efek blur berlebihan |
| Layar kecil (ponsel) | Pengalaman buruk | Mode terbatas atau arahkan ke desktop |

## 15. Pertanyaan Terbuka

1. **Peran dock:** apakah ikon sosial media (Instagram, Facebook, Twitter, Gmail) dihapus dan diganti shortcut fitur (Tentang, Bandingkan, Bagikan), atau dipertahankan sebagai dekorasi?
diganti dengan icon distro linux
2. **Daftar distro final:** apakah 7 distro usulan di bagian 8 sudah sesuai, atau ada distro lain yang diprioritaskan (misalnya Pop!\_OS, Debian, Fedora)?
boleh
3. **Ejaan nama:** pada brief tertulis “MarinniersOS” dan “MarrinniersOS”. Dokumen ini memakai 
**MarinniersOS**; mohon konfirmasi.
Sesuiakan dengna kata marrininer yang tepat
4. **Bahasa UI:** Indonesia saja pada MVP, atau langsung dua bahasa?
indo mvp
5. **Cakupan mobile:** apakah ponsel perlu didukung sejak awal?
betul responsive
6. **Konten edukasi:** apakah perlu halaman info tiap distro (sejarah, kebutuhan RAM, cocok untuk siapa) selain simulasi?
perlu tapi dalam icon
7. **Nama domain dan hosting** untuk peluncuran.
nanti aja msaih local
