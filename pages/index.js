import { useState } from 'react';
import { 
  ArrowTrendingUpIcon, 
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  FolderIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import Card from '../components/Card';
import KpiCard from '../components/KpiCard';
import FilterSearch from '../components/FilterSearch';
import Pagination from '../components/Pagination';
import { useDashboard } from '../lib/hooks';
import { AdvancedLineChart, AdvancedPieChart } from '../components/AdvancedCharts';

export default function Home() {
  // Gunakan SWR hook untuk data dashboard
  const { summary, transaksi, isLoading, isError, mutate } = useDashboard();
  
  // State untuk filter dan pagination
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Formatter untuk nilai uang
  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  // Formatter untuk persentase
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Filter data transaksi
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
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Prepare tujuan list for filter
  const tujuanList = transaksi ? [...new Set(transaksi.map(t => t.tujuan))].filter(Boolean) : [];
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!transaksi || transaksi.length === 0) return { dailyData: [], methodData: [] };
    
    // Group by date
    const dailyData = transaksi.reduce((acc, t) => {
      const date = new Date(t.tanggal).toLocaleDateString('id-ID');
      if (!acc[date]) {
        acc[date] = { date, total: 0, profit: 0 };
      }
      acc[date].total += t.hargaJual;
      acc[date].profit += (t.hargaJual - t.hargaAsli);
      return acc;
    }, {});
    
    // Group by payment method
    const methodData = transaksi.reduce((acc, t) => {
      const method = t.metode || 'Unknown';
      if (!acc[method]) {
        acc[method] = { method, value: 0 };
      }
      acc[method].value += t.hargaJual;
      return acc;
    }, {});
    
    return {
      dailyData: Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date)),
      methodData: Object.values(methodData)
    };
  };
  
  const { dailyData, methodData } = prepareChartData();
  
  // Effect to set filtered data when transaksi data changes
  useState(() => {
    if (transaksi) {
      setFilteredData(transaksi);
    }
  }, [transaksi]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-24"></div>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card className="mb-8 p-6 text-center">
            <p className="text-red-500">Terjadi kesalahan saat memuat data</p>
            <button 
              onClick={() => mutate()} 
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Coba Lagi
            </button>
          </Card>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="Total Penjualan"
                value={summary.totalPenjualan}
                formatter={formatCurrency}
                icon={CurrencyDollarIcon}
                iconColor="indigo"
              />
              
              <KpiCard
                title="Total Profit"
                value={summary.totalProfit}
                formatter={formatCurrency}
                icon={BanknotesIcon}
                iconColor="green"
              />
              
              <KpiCard
                title="Total Transaksi"
                value={summary.totalTransaksi}
                formatter={(val) => val}
                icon={ChartBarIcon}
                iconColor="blue"
              />
              
              <KpiCard
                title="Profitabilitas"
                value={summary.profitabilityRate}
                formatter={formatPercentage}
                icon={ReceiptPercentIcon}
                iconColor="purple"
              />
            </div>
            
            {/* Filter */}
            <FilterSearch 
              onFilter={handleFilter} 
              tujuanList={tujuanList} 
            />
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {dailyData.length > 0 && (
                <AdvancedLineChart
                  title="Tren Penjualan"
                  data={dailyData}
                  xAxisKey="date"
                  yAxisKeys={['total', 'profit']}
                  yAxisLabels={['Penjualan', 'Profit']}
                  formatYAxis={formatCurrency}
                />
              )}
              
              {methodData.length > 0 && (
                <AdvancedPieChart
                  title="Penjualan per Metode Pembayaran"
                  data={methodData}
                  labelKey="method"
                  valueKey="value"
                  formatValue={formatCurrency}
                />
              )}
            </div>
            
            {/* Recent Transactions */}
            <Card className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Transaksi Terbaru
                </h3>
                <a 
                  href="/transaksi" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Lihat Semua
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Produk
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Harga Jual
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {currentItems.length > 0 ? (
                      currentItems.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {new Date(t.tanggal).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {t.customer.nama}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {t.produk}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                            {formatCurrency(t.hargaJual)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                            {formatCurrency(t.hargaJual - t.hargaAsli)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          Tidak ada transaksi yang sesuai dengan filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
} 