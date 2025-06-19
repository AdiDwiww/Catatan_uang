import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Card from './Card';
import { ArrowsPointingOutIcon, TableCellsIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Custom chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
      },
    },
  },
};

// Theme colors that work well in light and dark modes
const colors = {
  primary: 'rgba(99, 102, 241, 0.8)',
  primaryLight: 'rgba(99, 102, 241, 0.2)',
  secondary: 'rgba(139, 92, 246, 0.8)',
  secondaryLight: 'rgba(139, 92, 246, 0.2)',
  success: 'rgba(34, 197, 94, 0.8)',
  successLight: 'rgba(34, 197, 94, 0.2)',
  danger: 'rgba(239, 68, 68, 0.8)',
  dangerLight: 'rgba(239, 68, 68, 0.2)',
  warning: 'rgba(234, 179, 8, 0.8)',
  warningLight: 'rgba(234, 179, 8, 0.2)',
  info: 'rgba(6, 182, 212, 0.8)',
  infoLight: 'rgba(6, 182, 212, 0.2)',
};

// Additional chart palette for pie/doughnut charts
const chartPalette = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.warning,
  colors.danger,
  colors.info,
  'rgba(249, 115, 22, 0.8)', // Orange
  'rgba(20, 184, 166, 0.8)', // Teal
  'rgba(236, 72, 153, 0.8)', // Pink
  'rgba(217, 119, 6, 0.8)',  // Amber
  'rgba(168, 85, 247, 0.8)',  // Purple
  'rgba(79, 70, 229, 0.8)',   // Indigo
];

export default function Charts({ data }) {
  const [viewMode, setViewMode] = useState('chart');

  // Memproses data untuk chart
  const dailyChartData = React.useMemo(() => {
    // Group transactions by date
    const dailyData = data.reduce((acc, curr) => {
      const date = new Date(curr.tanggal).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
      
      if (!acc[date]) {
        acc[date] = { date, penjualan: 0, profit: 0, count: 0 };
      }
      
      acc[date].penjualan += curr.hargaJual || 0;
      acc[date].profit += (curr.hargaJual || 0) - (curr.hargaAsli || 0);
      acc[date].count += 1;
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(dailyData).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [data]);

  // Memproses data untuk payment method chart
  const paymentChartData = React.useMemo(() => {
    const paymentData = data.reduce((acc, curr) => {
      const method = curr.metode || 'Tidak ada metode';
      
      if (!acc[method]) {
        acc[method] = { metode: method, total: 0, count: 0 };
      }
      
      acc[method].total += curr.hargaJual || 0;
      acc[method].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(paymentData).sort((a, b) => b.total - a.total);
  }, [data]);

  // Memproses data untuk tujuan/destination chart
  const destinationChartData = React.useMemo(() => {
    const destData = data.reduce((acc, curr) => {
      const destination = curr.tujuan || 'Tidak ada tujuan';
      
      if (!acc[destination]) {
        acc[destination] = { tujuan: destination, total: 0, count: 0, profit: 0 };
      }
      
      acc[destination].total += curr.hargaJual || 0;
      acc[destination].profit += (curr.hargaJual || 0) - (curr.hargaAsli || 0);
      acc[destination].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(destData).sort((a, b) => b.total - a.total);
  }, [data]);

  // Prepare line chart data
  const lineChartData = {
    labels: dailyChartData.map(item => item.date),
    datasets: [
      {
        label: 'Penjualan',
        data: dailyChartData.map(item => item.penjualan),
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: colors.primary,
      },
      {
        label: 'Profit',
        data: dailyChartData.map(item => item.profit),
        borderColor: colors.success,
        backgroundColor: colors.successLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: colors.success,
      }
    ],
  };

  // Prepare payment method chart data
  const paymentBarData = {
    labels: paymentChartData.map(item => item.metode),
    datasets: [
      {
        label: 'Total Penjualan',
        data: paymentChartData.map(item => item.total),
        backgroundColor: colors.secondary,
        borderRadius: 6,
        barThickness: 'flex',
      }
    ],
  };

  // Prepare destination doughnut chart data
  const destinationDoughnutData = {
    labels: destinationChartData.map(item => item.tujuan),
    datasets: [
      {
        data: destinationChartData.map(item => item.total),
        backgroundColor: chartPalette,
        borderWidth: 1,
        hoverOffset: 5,
      }
    ],
  };

  // Prepare profit by destination chart data
  const profitByDestinationData = {
    labels: destinationChartData.map(item => item.tujuan),
    datasets: [
      {
        label: 'Profit',
        data: destinationChartData.map(item => item.profit),
        backgroundColor: chartPalette.map(color => color.replace('0.8', '0.7')),
        borderWidth: 0,
        hoverOffset: 5,
      }
    ],
  };

  // Line chart options
  const lineOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `Rp ${value.toLocaleString()}`
        },
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: Rp ${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  // Bar chart options
  const barOptions = {
    ...commonOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: value => `Rp ${value.toLocaleString()}`
        },
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Total: Rp ${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  // Doughnut chart options
  const doughnutOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `Rp ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Toggle view mode between chart and table
  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
  };

  return (
    <div className="space-y-6">
      {/* Daily Trends Chart */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Tren Penjualan Harian
          </h3>
          <button
            onClick={toggleViewMode}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            title={viewMode === 'chart' ? 'Tampilkan Tabel' : 'Tampilkan Grafik'}
          >
            {viewMode === 'chart' ? 
              <TableCellsIcon className="w-5 h-5" /> : 
              <ArrowsPointingOutIcon className="w-5 h-5" />
            }
          </button>
        </div>
        
        {viewMode === 'chart' ? (
          <div className="h-80">
            <Line data={lineChartData} options={lineOptions} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Penjualan
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {dailyChartData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      Rp {item.penjualan.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                      Rp {item.profit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Chart */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Penjualan per Metode Pembayaran
            </h3>
          </div>
          <div className="h-80">
            <Bar data={paymentBarData} options={barOptions} />
          </div>
        </Card>

        {/* Destination Chart */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Distribusi Penjualan per Tujuan
            </h3>
          </div>
          <div className="h-80">
            <Doughnut data={destinationDoughnutData} options={doughnutOptions} />
          </div>
        </Card>

        {/* Profit by Destination */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Profit per Tujuan
            </h3>
          </div>
          <div className="h-80">
            <Pie data={profitByDestinationData} options={doughnutOptions} />
          </div>
        </Card>

        {/* Transaction Count Table */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Ringkasan per Tujuan
            </h3>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tujuan
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaksi
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Penjualan
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {destinationChartData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {item.tujuan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      {item.count}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      Rp {item.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                      Rp {item.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
} 