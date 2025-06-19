# Catatan Uang

Aplikasi pencatatan transaksi sederhana menggunakan Next.js, Prisma, dan Tailwind CSS.

## Instalasi

1. **Clone repository ini:**
   ```bash
   git clone <url-repo-anda>
   cd Catatan_Uang/catatan-uang
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup database:**
   - Edit file `prisma/schema.prisma` jika perlu.
   - Jalankan migrasi database:
     ```bash
     npx prisma migrate dev
     ```

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

5. **Akses aplikasi:**
   Buka browser ke [http://localhost:3000](http://localhost:3000)

## Konfigurasi Tambahan
- Buat file `.env` jika diperlukan, misal untuk konfigurasi database.
- File database lokal (`prisma/dev.db`) sudah di-ignore dari git.

---

Jika ada masalah, silakan cek dokumentasi Next.js, Prisma, atau Tailwind CSS, atau hubungi pengelola repo ini. 