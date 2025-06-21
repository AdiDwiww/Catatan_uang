import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import KpiCard from '../components/KpiCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import AdvancedSearch from '../components/AdvancedSearch';
import InvoiceModalNew from '../components/InvoiceModalNew';
import { useLaporan } from '../lib/hooks';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { 
  AdvancedLineChart, 
  AdvancedBarChart, 
  AdvancedPieChart 
} from '../components/AdvancedCharts';
import Papa from 'papaparse';
import { formatCurrency } from '../lib/currency';

export default function Laporan() {
  // Gunakan SWR hook untuk data laporan
  const { laporan, isLoading, isError, mutate } = useLaporan();
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State untuk export
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  
  // State untuk advanced search
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({});
  
  // State untuk invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceTransaction, setInvoiceTransaction] = useState(null);
  
  // Formatter untuk nilai uang
  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  // Formatter untuk persentase
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Fetch customers for filter
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customer');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Advanced search handler
  const handleAdvancedSearch = (searchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearSearch = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Handle generate invoice
  const handleGenerateInvoice = (transaction) => {
    setInvoiceTransaction(transaction);
    setShowInvoiceModal(true);
  };

  // Filter transaksi berdasarkan advanced search
  const filteredTransaksi = laporan.transaksi ? laporan.transaksi.filter((t) => {
    // Basic search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch = 
        t.produk.toLowerCase().includes(search) ||
        t.customerNama.toLowerCase().includes(search) ||
        t.metode.toLowerCase().includes(search) ||
        t.tujuan?.toLowerCase().includes(search) ||
        t.tag?.toLowerCase().includes(search);
      
      if (!matchesSearch) return false;
    }

    // Customer filter
    if (filters.customerId && t.customerId !== parseInt(filters.customerId)) {
      return false;
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const transaksiDate = new Date(t.tanggal);
      if (transaksiDate < startDate) return false;
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const transaksiDate = new Date(t.tanggal);
      if (transaksiDate > endDate) return false;
    }

    // Amount range filter
    if (filters.minAmount && t.hargaJual < parseFloat(filters.minAmount)) {
      return false;
    }

    if (filters.maxAmount && t.hargaJual > parseFloat(filters.maxAmount)) {
      return false;
    }

    // Currency filter
    if (filters.mataUang && t.mataUang !== filters.mataUang) {
      return false;
    }

    // Payment method filter
    if (filters.metode && t.metode !== filters.metode) {
      return false;
    }

    // Destination filter
    if (filters.tujuan && t.tujuan !== filters.tujuan) {
      return false;
    }

    // Tag filter
    if (filters.tag && (!t.tag || !t.tag.toLowerCase().includes(filters.tag.toLowerCase()))) {
      return false;
    }

    return true;
  }) : [];
  
  // Pagination untuk data transaksi yang sudah difilter
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransaksi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);
  
  // Handle export data
  const handleExport = () => {
    if (!filteredTransaksi || filteredTransaksi.length === 0) return;
    
    try {
      let exportData;
      let fileName = `laporan-transaksi-${new Date().toISOString().slice(0, 10)}`;
      let fileContent = '';
      let fileType = '';
      
      // Format data untuk export
      const formattedData = filteredTransaksi.map(t => ({
        ID: t.id,
        Tanggal: new Date(t.tanggal).toLocaleDateString('id-ID'),
        Customer: t.customerNama,
        Produk: t.produk,
        'Harga Asli': t.hargaAsli,
        'Harga Jual': t.hargaJual,
        Profit: t.profit,
        'Metode Pembayaran': t.metode,
        Tujuan: t.tujuan,
        Tag: t.tag
      }));
      
      // Export berdasarkan format
      if (exportFormat === 'csv') {
        fileContent = Papa.unparse(formattedData);
        fileType = 'text/csv';
        fileName += '.csv';
      } else if (exportFormat === 'json') {
        fileContent = JSON.stringify(formattedData, null, 2);
        fileType = 'application/json';
        fileName += '.json';
      } else if (exportFormat === 'excel') {
        // Untuk excel, kita tetap menggunakan CSV yang bisa dibuka di Excel
        fileContent = Papa.unparse(formattedData);
        fileType = 'text/csv';
        fileName += '.csv';
      }
      
      // Buat dan download file
      const blob = new Blob([fileContent], { type: `${fileType};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Tutup modal
      setShowExportModal(false);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Terjadi kesalahan saat mengekspor data');
    }
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Laporan', href: '/laporan' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Laporan & Analisis
        </h1>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Data
          </button>
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
                value={laporan.totalPenjualan}
                formatter={formatCurrency}
                icon={CurrencyDollarIcon}
                iconColor="indigo"
              />
              
              <KpiCard
                title="Total Profit"
                value={laporan.totalProfit}
                formatter={formatCurrency}
                icon={BanknotesIcon}
                iconColor="green"
                description="Total keuntungan dari seluruh transaksi"
              />
              
              <KpiCard
                title="Profitability Rate"
                value={laporan.profitabilityRate}
                formatter={formatPercentage}
                icon={ReceiptPercentIcon}
                iconColor="blue"
                description="Persentase keuntungan dari total penjualan"
              />
              
              <KpiCard
                title="Rata-rata Transaksi"
                value={laporan.avgTransactionValue}
                formatter={formatCurrency}
                icon={ChartBarIcon}
                iconColor="purple"
                description="Nilai rata-rata per transaksi"
              />
              </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Trend Chart */}
              {laporan.salesTrend && (
                <AdvancedLineChart
                  title="Tren Penjualan"
                  data={laporan.salesTrend}
                  xAxisKey="date"
                  yAxisKeys={['total', 'profit']}
                  yAxisLabels={['Penjualan', 'Profit']}
                  formatXAxis={(x) => x}
                  formatYAxis={formatCurrency}
                />
              )}
              
              {/* Payment Methods Chart */}
              {laporan.paymentMethods && (
                <AdvancedBarChart
                  title="Metode Pembayaran"
                  data={laporan.paymentMethods}
                  labelKey="method"
                  valueKey="total"
                  secondaryValueKey="profit"
                  labelForPrimary="Total Penjualan"
                  labelForSecondary="Profit"
                  formatValue={formatCurrency}
                />
              )}
              
              {/* Destinations Chart */}
              {laporan.destinations && (
                <AdvancedPieChart
                  title="Distribusi Tujuan"
                  data={laporan.destinations}
                  labelKey="destination"
                  valueKey="total"
                  type="doughnut"
                  formatValue={formatCurrency}
                />
              )}
              
              {/* Top Products Chart */}
              {laporan.topProducts && (
                <AdvancedBarChart
                  title="Produk Terlaris"
                  data={laporan.topProducts.slice(0, 5)}
                  labelKey="product"
                  valueKey="total"
                  secondaryValueKey="profit"
                  labelForPrimary="Total Penjualan"
                  labelForSecondary="Profit"
                  formatValue={formatCurrency}
                />
              )}
              
              {/* Top Customers Chart */}
              {laporan.topCustomers && (
                <AdvancedBarChart
                  title="Top Customers"
                  data={laporan.topCustomers.slice(0, 5)}
                  labelKey="name"
                  valueKey="total"
                  labelForPrimary="Total Pembelian"
                  formatValue={formatCurrency}
                />
              )}
              
              {/* Profit Margin by Destination */}
              {laporan.destinations && (
                <AdvancedBarChart
                  title="Profit Margin per Tujuan"
                  data={laporan.destinations}
                  labelKey="destination"
                  valueKey="profitMargin"
                  labelForPrimary="Profit Margin"
                  formatValue={(value) => `${value.toFixed(2)}%`}
                  horizontal={false}
                />
              )}
            </div>
            
            {/* Transaction Table */}
            <Card className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Detail Transaksi
                </h3>
              </div>
              
              {/* Advanced Search */}
              <div className="mb-4">
                <AdvancedSearch 
                  onSearch={handleAdvancedSearch}
                  onClear={handleClearSearch}
                  customers={customers}
                />
              </div>
              
              {/* Search Results Info */}
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {currentItems.length} dari {filteredTransaksi.length} transaksi
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                    (dengan filter aktif)
                  </span>
                )}
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Metode
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tujuan
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {currentItems.map((transaksi) => (
                      <tr key={transaksi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaksi.customerNama}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaksi.produk}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                          {formatCurrency(transaksi.hargaJual, transaksi.mataUang)}
                          <span className="ml-1 text-xs text-gray-500">{transaksi.mataUang}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                          {formatCurrency(transaksi.profit, transaksi.mataUang)}
                          <span className="ml-1 text-xs text-gray-500">{transaksi.mataUang}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaksi.metode}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaksi.tujuan}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          <button
                            onClick={() => handleGenerateInvoice(transaksi)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Generate Invoice"
                          >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
          </Card>
          </>
        )}
        
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Export Laporan
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format File
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`px-4 py-2 text-sm border rounded-md ${
                      exportFormat === 'csv'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => setExportFormat('json')}
                    className={`px-4 py-2 text-sm border rounded-md ${
                      exportFormat === 'json'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setExportFormat('excel')}
                    className={`px-4 py-2 text-sm border rounded-md ${
                      exportFormat === 'excel'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Excel
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && invoiceTransaction && (
        <InvoiceModalNew
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceTransaction(null);
          }}
          transaction={invoiceTransaction}
          customer={{
            nama: invoiceTransaction.customerNama,
            address: invoiceTransaction.customerAddress || '',
            phone: invoiceTransaction.customerPhone || '',
            email: invoiceTransaction.customerEmail || ''
          }}
        />
      )}
    </Layout>
  );
} 