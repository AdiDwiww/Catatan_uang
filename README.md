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

## Advanced Search Features

The Advanced Search component provides powerful filtering capabilities across the application:

### Search Fields
- **Text Search**: Search across product names, customer names, payment methods, destinations, and tags
- **Customer Filter**: Filter by specific customers using dropdown selection
- **Date Range**: Filter transactions within specific date periods
- **Amount Range**: Filter by minimum and maximum transaction amounts
- **Currency Filter**: Filter by specific currencies (IDR, USD, EUR, SGD, MYR)
- **Payment Method**: Filter by payment type (Cash, Transfer, Credit Card, etc.)
- **Destination**: Filter by transaction destination (Online, Offline, etc.)
- **Tag Filter**: Filter by transaction tags for categorization

### Integration Points
- **Transaction Page**: Advanced search integrated with transaction listing
- **Report Page**: Advanced search integrated with detailed transaction reports
- **Export Functionality**: Export filtered results only
- **Pagination**: Works seamlessly with paginated results
- **Real-time Updates**: Search results update immediately as filters change

### Usage
1. Navigate to Transactions or Reports page
2. Use the Advanced Search component at the top
3. Apply multiple filters simultaneously
4. View filtered results with count indicators
5. Export filtered data as needed
6. Clear all filters with the clear button

## Invoice Generation Features

The Invoice Generation system provides professional PDF invoice creation:

### Invoice Components
- **Company Header**: Customizable company name, address, contact details
- **Invoice Details**: Automatic invoice numbering, dates, due dates
- **Customer Information**: Customer name, address, contact details
- **Item Details**: Product description, quantity, price, totals
- **Financial Summary**: Subtotal, tax, total amounts
- **Terms & Notes**: Customizable payment terms and notes
- **Professional Layout**: Clean, professional PDF design

### Integration Points
- **Transaction Page**: Generate invoice button for each transaction
- **Report Page**: Generate invoice button for filtered transactions
- **Settings Page**: Company information management
- **Multi-currency Support**: Invoices display in transaction currency
- **PDF Preview**: Preview invoice before download

### Usage
1. Navigate to Settings page to configure company information
2. Go to Transactions or Reports page
3. Click the invoice icon (📄) next to any transaction
4. Review and customize invoice details
5. Preview the generated PDF
6. Download the invoice as PDF file

### Company Settings
- **Company Name**: Business name for invoice header
- **Address**: Business address for invoice
- **Contact Details**: Phone, email, website
- **Tax Information**: NPWP number for Indonesian businesses
- **Bank Details**: Bank name and account number
- **Persistent Storage**: Settings saved in localStorage

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Chart.js with custom components
- **Data Processing**: Papa Parse for CSV handling
- **PDF Generation**: jsPDF for invoice generation

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd catatan-uang
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Sign up for a new account or sign in

## Project Structure

```
├── components/          # Reusable UI components
│   ├── AdvancedSearch.js    # Advanced search and filtering
│   ├── Charts.js           # Basic chart components
│   ├── AdvancedCharts.js   # Complex data visualizations
│   ├── Layout.js           # Main layout wrapper
│   ├── Sidebar.js          # Navigation sidebar
│   └── TransaksiForm.js    # Transaction form component
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── index.js        # Dashboard page
│   ├── transaksi.js    # Transaction management
│   ├── customer.js     # Customer management
│   └── laporan.js      # Reports and analytics
├── lib/                # Utility functions and hooks
│   ├── currency.js     # Currency formatting utilities
│   ├── hooks.js        # Custom React hooks
│   └── prisma.ts       # Database connection
├── prisma/             # Database schema and migrations
└── styles/             # Global CSS styles
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📊 Reporting & Analytics
- **Interactive dashboard** with KPI cards
- **Advanced charts** (Line, Bar, Pie, Doughnut)
- **Sales trend analysis** over time
- **Payment method distribution**
- **Customer performance analysis**
- **Product performance tracking**
- **Profit margin analysis**
- **Export capabilities** (CSV, JSON, Excel)

### 🧾 Invoice Generation
- **PDF invoice generation** from transaction data
- **Customizable company information** with settings page
- **Professional invoice templates** with company branding
- **Multi-currency support** in invoices
- **Invoice preview** before download
- **Automatic invoice numbering** system
- **Customer details integration** in invoices
- **Download as PDF** functionality
- **Company settings management** with localStorage persistence

### 📁 Data Import/Export 