import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/24/outline';

export default function Layout({ children }) {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [notifications] = useState([
    { id: 1, text: 'Transaksi baru telah ditambahkan', time: '5 menit yang lalu', isNew: true },
    { id: 2, text: 'Laporan bulanan tersedia', time: '1 jam yang lalu', isNew: false },
    { id: 3, text: 'Pengingat: Update data customer', time: '1 hari yang lalu', isNew: false },
  ]);

  useEffect(() => {
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
    
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }

    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };
  
  const toggleNotifications = (e) => {
    if (e) e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  const isActive = (path) => router.pathname === path;

  const mainNavItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/customer', icon: UserGroupIcon, label: 'Customer' },
    { path: '/transaksi', icon: CurrencyDollarIcon, label: 'Transaksi' },
    { path: '/laporan', icon: ChartBarIcon, label: 'Laporan' }
  ];

  const sidebarWidth = isCollapsed ? '5rem' : '18rem';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center justify-between py-3 px-4">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Catatan Uang
          </h1>
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div ref={notificationsRef} className="absolute top-16 lg:top-6 right-4 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifikasi</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300">
              Tandai sudah dibaca
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                    notification.isNew ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {notification.isNew && (
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2"></div>
                    )}
                    <div className={`flex-1 ${notification.isNew ? '' : 'pl-4'}`}>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Tidak ada notifikasi
              </div>
            )}
          </div>
          <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
            <Link href="/notifications" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
              Lihat semua notifikasi
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-gray-900/70 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 pt-20">
            <div className="space-y-1 mb-4">
              {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                    isActive(item.path)
                        ? 'bg-indigo-500 text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Link
                href="/settings"
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                <span className="font-medium">Pengaturan</span>
              </Link>
              
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                {isDark ? (
                  <>
                    <SunIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </button>
              
              <button
                className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
            
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
              © 2023 Catatan Uang
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Desktop Sidebar - NO TRANSITIONS TO PREVENT FLICKERING */}
      <div className="fixed hidden lg:block inset-y-0 left-0 z-30 w-20" style={{ width: sidebarWidth }}>
        <div 
          ref={sidebarRef}
          className="absolute top-0 left-0 h-full w-full bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="flex flex-col h-full">
            {/* Logo and Toggle */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-6' : 'px-6 py-6'}`}>
              <a href="#" className="flex items-center"
                     onClick={(e) => {
                       e.preventDefault();
                       toggleSidebar();
                     }}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md cursor-pointer">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                {!isCollapsed && (
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                      Catatan Uang
                    </h1>
                  </div>
                )}
              </a>
            </div>
            
            {/* Main Navigation */}
            <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-2`}>
              <div className={`space-y-1 ${isCollapsed ? '' : 'ml-2'}`}>
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl ${
                        isActive(item.path)
                          ? 'bg-indigo-500 text-white font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }} />
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      
                      {/* Simple tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded invisible opacity-0 hover:visible hover:opacity-100 z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Bottom Actions */}
            <div className={`mt-auto ${isCollapsed ? 'px-2 pb-6' : 'p-6'} border-t border-gray-200 dark:border-gray-700`}>
              {!isCollapsed ? (
                <>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 mb-3"
                  >
                    {isDark ? (
                      <>
                        <SunIcon className="w-5 h-5 mr-3" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="w-5 h-5 mr-3" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                  
                  <div className="flex space-x-2 mb-4">
                    <Link
                      href="/settings"
                      className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={toggleNotifications}
                      className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                    >
                      <BellIcon className="w-5 h-5" />
                      {notifications.some(n => n.isNew) && (
                        <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </button>
                    
                    <button
                      className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                    © 2023 Catatan Uang
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                  >
                    {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap invisible opacity-0 hover:visible hover:opacity-100 z-50">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </div>
                  </button>
                  
                  <Link
                    href="/settings"
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap invisible opacity-0 hover:visible hover:opacity-100 z-50">
                      Pengaturan
                    </div>
                  </Link>
                  
                  <button
                    onClick={toggleNotifications}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                  >
                    <BellIcon className="w-5 h-5" />
                    {notifications.some(n => n.isNew) && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap invisible opacity-0 hover:visible hover:opacity-100 z-50">
                      Notifikasi
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - FIXED LEFT MARGIN TO PREVENT SHIFTING */}
      <main style={{ marginLeft: sidebarWidth }}>
        {/* Mobile page padding */}
        <div className="pt-20 lg:pt-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 