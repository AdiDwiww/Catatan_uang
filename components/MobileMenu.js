import Link from 'next/link';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function MobileMenu({ 
  isMobileMenuOpen, 
  isDark, 
  toggleDarkMode, 
  router,
  setIsMobileMenuOpen
}) {
  const isActive = (path) => router.pathname === path;
  
  const mainNavItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/customer', icon: UserGroupIcon, label: 'Customer' },
    { path: '/transaksi', icon: CurrencyDollarIcon, label: 'Transaksi' },
    { path: '/laporan', icon: ChartBarIcon, label: 'Laporan' }
  ];

  return (
    <div className={`lg:hidden fixed inset-0 z-40 bg-gray-900/70 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`absolute right-0 top-0 h-full mobile-menu bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mobile-menu-content h-full flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-2 mb-6">
              {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3.5 mobile-nav-item ${
                  isActive(item.path)
                      ? 'bg-indigo-500 text-white font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
              })}
            </div>
            
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Link
                href="/settings"
                className="flex items-center px-4 py-3.5 mobile-nav-item text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium">Pengaturan</span>
              </Link>
              
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center px-4 py-3.5 mobile-nav-item text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                {isDark ? (
                  <>
                    <SunIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-6 mt-auto">
            <button
              className="w-full flex items-center px-4 py-3.5 mobile-nav-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">Keluar</span>
            </button>
            
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
              © 2023 Catatan Uang
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 