<div align="center">

# 💸 Catatan Uang

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="60" height="60" alt="Next.js" />

**Aplikasi manajemen keuangan modern dengan UI yang elegan dan performa tinggi**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-FF6384?style=for-the-badge&logo=chart.js)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

<p align="center">
  <img src="https://user-images.githubusercontent.com/your-username/your-repo/assets/screenshot.png" alt="Catatan Uang Screenshot" width="80%" />
</p>

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif** - Visualisasi data keuangan real-time
- 💳 **Manajemen Transaksi** - Catat pemasukan dan pengeluaran dengan mudah
- 👥 **Manajemen Pelanggan** - Kelola data pelanggan dengan efisien
- 📱 **Responsif** - Tampilan optimal di desktop dan perangkat mobile
- 🌓 **Mode Gelap/Terang** - Antarmuka yang nyaman untuk mata
- 📈 **Laporan Analitik** - Analisis tren keuangan dengan visualisasi canggih
- 📤 **Ekspor/Impor Data** - Dukungan format CSV untuk integrasi data
- ⚡ **Performa Tinggi** - Dioptimalkan dengan Next.js Turbo

## 🚀 Demo

Lihat demo aplikasi di [https://catatan-uang.vercel.app](https://catatan-uang.vercel.app)

## 🛠️ Teknologi

Catatan Uang dibangun dengan teknologi web modern:

- **Frontend:**
  - [Next.js 14.2.30](https://nextjs.org/) - React framework dengan performa tinggi
  - [React 18.3.1](https://reactjs.org/) - Library UI yang reaktif
  - [Tailwind CSS 3.4.17](https://tailwindcss.com/) - Framework CSS utility-first
  - [Framer Motion 11.18.2](https://www.framer.com/motion/) - Animasi yang mulus

- **Backend:**
  - [Prisma ORM 5.22.0](https://www.prisma.io/) - ORM modern untuk Node.js
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Backend serverless

- **Visualisasi Data:**
  - [Chart.js 4.5.0](https://www.chartjs.org/) - Library chart JavaScript yang fleksibel

## 📦 Instalasi

### Prasyarat

- Node.js 18.0.0 atau lebih baru
- npm atau yarn

### Langkah-langkah

1. **Clone repository**

```bash
git clone https://github.com/username/catatan-uang.git
cd catatan-uang
```

2. **Install dependencies**

```bash
npm install
# atau
yarn install
```

3. **Setup database**

Buat file `.env` di root proyek:

```env
DATABASE_URL="file:./dev.db"
# Tambahkan konfigurasi lain jika diperlukan
```

4. **Jalankan migrasi database**

```bash
npx prisma migrate dev
```

5. **Jalankan aplikasi**

```bash
# Mode development standar
npm run dev
# atau
yarn dev

# Mode development dengan Turbo (lebih cepat)
npm run dev:fast
# atau
yarn dev:fast
```

6. **Akses aplikasi**

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Build untuk Produksi

```bash
npm run build
# atau
yarn build
```

### Jalankan di Produksi

```bash
npm start
# atau
yarn start
```

### Deploy ke Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Fcatatan-uang)

## 📁 Struktur Proyek

```
catatan-uang/
├── components/           # Komponen React reusable
├── lib/                  # Utilitas dan hooks
├── pages/                # Halaman dan API routes
│   ├── api/              # Backend API endpoints
│   └── ...               # Halaman frontend
├── prisma/               # Schema dan migrasi database
├── public/               # Asset statis
├── styles/               # File CSS global
└── ...
```

## 🧪 Testing

```bash
# Jalankan unit test
npm test

# Jalankan test dengan coverage
npm run test:coverage
```

## 🤝 Kontribusi

Kontribusi selalu disambut! Silakan lihat [panduan kontribusi](CONTRIBUTING.md) untuk memulai.

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/amazing-feature`)
3. Commit perubahan Anda (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 👏 Pengakuan

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM untuk Node.js
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Chart.js](https://www.chartjs.org/) - Library chart JavaScript

---

<div align="center">

### Suka Catatan Uang? Berikan ⭐️ di GitHub!

[Laporkan Bug](https://github.com/username/catatan-uang/issues) · [Request Fitur](https://github.com/username/catatan-uang/issues)

</div>

<p align="center">Dibuat dengan ❤️ oleh <a href="https://github.com/username">Username</a></p> 