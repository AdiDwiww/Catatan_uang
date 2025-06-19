import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

export default function Layout({ children }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage first, then system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDark(savedMode === 'true');
      if (savedMode === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/customer', icon: UserGroupIcon, label: 'Customer' },
    { path: '/transaksi', icon: CurrencyDollarIcon, label: 'Transaksi' },
    { path: '/laporan', icon: ChartBarIcon, label: 'Laporan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
            Catatan Uang
          </h1>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    isActive(item.path)
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDark ? (
              <>
                <SunIcon className="w-6 h-6 mr-3" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="w-6 h-6 mr-3" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </nav>
      <main className="ml-64 p-8 transition-all duration-200">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
} 