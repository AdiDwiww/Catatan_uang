# Catatan Uang

Aplikasi pencatatan transaksi keuangan dengan Next.js, Prisma, dan Tailwind CSS.

## Fitur

- Pencatatan transaksi keuangan
- Manajemen data pelanggan
- Laporan keuangan dengan visualisasi chart
- Responsif untuk desktop dan mobile
- Tema terang/gelap

## Teknologi

- **Frontend:** Next.js 14.2.30, React 18.3.1
- **Styling:** Tailwind CSS 3.4.17
- **Database:** Prisma ORM 5.22.0
- **Charts:** Chart.js 4.5.0
- **Animasi:** Framer Motion 11.18.2

## Instalasi

1. **Clone repository ini:**
   ```bash
   git clone <url-repo-anda>
   cd Catatan_Uang
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup database:**
   - Buat file `.env` dengan konfigurasi database Anda:
     ```
     DATABASE_URL="file:./dev.db"
     ```
   - Jalankan migrasi database:
     ```bash
     npx prisma migrate dev
     ```

4. **Jalankan aplikasi dalam mode development:**
   ```bash
   npm run dev
   ```
   atau dengan Turbo:
   ```bash
   npm run dev:fast
   ```

5. **Akses aplikasi:**
   Buka browser ke [http://localhost:3000](http://localhost:3000)

## Deployment

1. **Build untuk produksi:**
   ```bash
   npm run build
   ```

2. **Jalankan aplikasi produksi:**
   ```bash
   npm start
   ```

## Struktur Proyek

- `components/` - Komponen React yang digunakan di seluruh aplikasi
- `pages/` - Halaman aplikasi dan API routes
- `prisma/` - Model database dan migrasi
- `styles/` - File CSS global dan konfigurasi Tailwind
- `lib/` - Utilitas dan hooks

## Kontribusi

Silakan buat pull request untuk kontribusi. Pastikan kode Anda bersih dan mengikuti konvensi yang ada.

---

Dibuat dengan ❤️ menggunakan Next.js, Prisma, dan Tailwind CSS. 