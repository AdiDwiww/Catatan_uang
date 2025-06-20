import useSWR from 'swr';
import { useState } from 'react';

// Fungsi fetcher umum untuk SWR
const fetcher = async (...args) => {
  const res = await fetch(...args);
  // If the status code is not in the range 200-299,
  // still try to parse and throw it
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// Hook untuk mengambil data transaksi dengan caching
export function useTransaksi() {
  const { data, error, isLoading, mutate } = useSWR('/api/transaksi', fetcher, {
    revalidateOnFocus: false, // Tidak reload saat tab mendapat fokus
    dedupingInterval: 60000, // Cache valid selama 1 menit
  });

  return {
    transaksi: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate, // Untuk memperbarui data secara manual
  };
}

// Hook untuk mengambil data customer dengan caching
export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR('/api/customer', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000, // Cache valid selama 2 menit
  });

  return {
    customers: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook untuk mengambil data laporan dengan caching
export function useLaporan() {
  const { data, error, isLoading, mutate } = useSWR('/api/laporan', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // Cache valid selama 5 menit
  });

  return {
    laporan: data || { totalPenjualan: 0, totalProfit: 0, totalTransaksi: 0, transaksi: [] },
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook untuk mengambil data dashboard dengan caching
export function useDashboard() {
  const { data: laporanData, error: laporanError, isLoading: laporanLoading, mutate: laporanMutate } = useSWR('/api/laporan', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // Cache valid selama 5 menit
  });
  
  const { data: transaksiData, error: transaksiError, isLoading: transaksiLoading, mutate: transaksiMutate } = useSWR('/api/transaksi', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache valid selama 1 menit
  });

  // Fungsi untuk memperbarui kedua data sekaligus
  const mutateAll = async () => {
    await Promise.all([laporanMutate(), transaksiMutate()]);
  };

  return {
    summary: laporanData || { totalPenjualan: 0, totalProfit: 0, totalTransaksi: 0 },
    transaksi: Array.isArray(transaksiData) ? transaksiData : [],
    isLoading: laporanLoading || transaksiLoading,
    isError: laporanError || transaksiError,
    mutate: mutateAll,
  };
}

// Fungsi untuk menyimpan preferensi pengguna di localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Hook untuk pagination
export function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage
  };
} 