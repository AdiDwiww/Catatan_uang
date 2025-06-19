import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Card from './Card';

export default function FilterSearch({ onFilter, tujuanList = [] }) {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Check if any filter is active
  useEffect(() => {
    setIsFilterActive(search || startDate || endDate || tujuan);
  }, [search, startDate, endDate, tujuan]);

  const handleFilter = () => {
    onFilter({
      search,
      startDate,
      endDate,
      tujuan
    });
  };

  const handleReset = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setTujuan('');
    onFilter({});
  };
  
  // Auto-apply filter when values change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilter();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, startDate, endDate, tujuan]);

  return (
    <Card
      border
      elevation="light"
      hoverEffect={false}
      className="mb-8 overflow-visible mt-2"
    >
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Filter Transaksi
          </h2>
          {isFilterActive && (
            <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              Aktif
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? (
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pencarian
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Produk atau customer..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dari Tanggal
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sampai Tanggal
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="tujuan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tujuan
              </label>
              <select
                id="tujuan"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm appearance-none bg-no-repeat bg-right"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
              >
                <option value="">Semua Tujuan</option>
                {tujuanList.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end border-t dark:border-gray-700 pt-4 mt-3">
            {isFilterActive && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  );
} 