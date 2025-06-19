import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function Laporan() {
  const [summary, setSummary] = useState({ 
    totalPenjualan: 0, 
    totalProfit: 0,
    totalTransaksi: 0,
    rataRataProfit: 0
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/laporan');
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching laporan summary:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Laporan Keuangan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <CurrencyDollarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Penjualan
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Rp {summary.totalPenjualan.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Profit
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Rp {summary.totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Transaksi
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {summary.totalTransaksi}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <ArrowTrendingDownIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rata-rata Profit
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Rp {summary.rataRataProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Ringkasan Keuangan
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Total Penjualan</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                Rp {summary.totalPenjualan.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Total Profit</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                Rp {summary.totalProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Total Transaksi</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {summary.totalTransaksi}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Rata-rata Profit per Transaksi</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Rp {summary.rataRataProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 