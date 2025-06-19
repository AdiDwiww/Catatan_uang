import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  ArrowTrendingUpIcon, 
  BanknotesIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import Card from '../components/Card';
import FilterSearch from '../components/FilterSearch';
import Papa from 'papaparse';

// Lazy load heavy components
const Charts = dynamic(() => import('../components/Charts'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading chart...</div>
});

export default function Home() {
  const [summary, setSummary] = useState({ totalPenjualan: 0, totalProfit: 0 });
  const [transaksi, setTransaksi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [summaryRes, transaksiRes] = await Promise.all([
        fetch('/api/laporan'),
        fetch('/api/transaksi')
      ]);
      
      if (summaryRes.ok && transaksiRes.ok) {
        const summaryData = await summaryRes.json();
        let transaksiData = await transaksiRes.json();
        // Urutkan transaksi dari tanggal terbaru ke terlama
        transaksiData = transaksiData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        setSummary(summaryData);
        setTransaksi(transaksiData);
        setFilteredData(transaksiData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...transaksi];

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.tanggal) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.tanggal) <= new Date(filters.endDate));
    }
    if (filters.tujuan) {
      filtered = filtered.filter(t => t.tujuan === filters.tujuan);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.produk.toLowerCase().includes(search) ||
        t.customer.nama.toLowerCase().includes(search)
      );
    }

    setFilteredData(filtered);
  };

  const handleExport = (format) => {
    const data = filteredData.map(t => ({
      Tanggal: new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      Customer: t.customer.nama,
      Produk: t.produk,
      'Harga Asli': t.hargaAsli,
      'Harga Jual': t.hargaJual,
      Profit: t.hargaJual - t.hargaAsli,
      'Metode Pembayaran': t.metode,
      Tujuan: t.tujuan,
      Tag: t.tag
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'transaksi.csv';
      link.click();
    } else if (format === 'json') {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'transaksi.json';
      link.click();
    }
  };

  // Ambil daftar tujuan pembayaran unik dari semua transaksi
  const tujuanList = Array.from(new Set(
    transaksi
      .map(t => t.tujuan)
      .filter(Boolean)
  ));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard Keuangan
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export JSON
            </button>
          </div>
        </div>

        <FilterSearch onFilter={handleFilter} tujuanList={tujuanList} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Total Penjualan
                </h2>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                  Rp {summary.totalPenjualan.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <BanknotesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Total Profit
                </h2>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  Rp {summary.totalProfit.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <ArrowTrendingUpIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        <Charts data={filteredData} />
      </div>
    </Layout>
  );
} 