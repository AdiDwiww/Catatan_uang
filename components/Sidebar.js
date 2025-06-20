import { useRef, forwardRef } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';

const Sidebar = forwardRef(function Sidebar({ isCollapsed, toggleSidebar, isDark, toggleDarkMode, toggleNotifications, notifications, router }, ref) {
  const isActive = (path) => router.pathname === path;
  const notificationsRef = useRef(null);
  const { data: session } = useSession();
  
  const mainNavItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/customer', icon: UserGroupIcon, label: 'Customer' },
    { path: '/transaksi', icon: CurrencyDollarIcon, label: 'Transaksi' },
    { path: '/laporan', icon: ChartBarIcon, label: 'Laporan' }
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <div 
      className={`fixed hidden lg:block inset-y-0 left-0 z-30 transition-none sidebar
                 ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      ref={ref}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-white dark:bg-gray-800 shadow-lg sidebar-inner">
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
                <div className="ml-3 sidebar-logo-text">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                    Catatan Uang
                  </h1>
                </div>
              )}
            </a>
          </div>
          
          {/* User Section */}
          {session?.user && !isCollapsed && (
            <div className="px-6 py-3 mb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
                      <span className="font-medium sidebar-text">{item.label}</span>
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
                {/* User info at bottom */}
                {session?.user && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        {session.user.image ? (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {session.user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
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
                    onClick={handleSignOut}
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
                {/* Collapsed user info */}
                {session?.user && (
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative">
                    <UserIcon className="w-5 h-5" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap invisible opacity-0 hover:visible hover:opacity-100 z-50">
                      {session.user.name}<br/>{session.user.email}
                    </div>
                  </div>
                )}
                
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
                
                <button
                  onClick={handleSignOut}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap invisible opacity-0 hover:visible hover:opacity-100 z-50">
                    Keluar
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar; 