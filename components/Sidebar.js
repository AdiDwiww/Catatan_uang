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

  // Render logo differently at client and server side
  let logoContent = null;
  if (typeof window !== 'undefined') {
    // Client-side only rendering
    logoContent = (
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-6' : 'px-6 py-6'}`}>
        <div 
          onClick={toggleSidebar}
          className="flex items-center cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <div className="text-white font-bold text-lg">C</div>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Catatan Uang
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Server-side rendering with minimal content
    logoContent = <div className={`${isCollapsed ? 'h-20' : 'h-20 px-6'} py-6`}></div>;
  }

  return (
    <div 
      className={`fixed hidden lg:block inset-y-0 left-0 z-30 transition-none sidebar
                 ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      ref={ref}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-white dark:bg-gray-800 shadow-lg sidebar-inner">
        <div className="flex flex-col h-full">
          {/* Logo section */}
          {logoContent}
          
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
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Bottom Actions */}
          <div className={`mt-auto ${isCollapsed ? 'px-2 pb-6' : 'p-6'} border-t border-gray-200 dark:border-gray-700`}>
            {!isCollapsed && typeof window !== 'undefined' && (
              <>
                {/* User info at bottom */}
                {session?.user && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        {session.user.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Avatar" 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {session.user.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {session.user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 mb-3 cursor-pointer"
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
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <Link
                    href="/settings"
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </Link>
                  
                  <div
                    onClick={toggleNotifications}
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative cursor-pointer"
                  >
                    <BellIcon className="w-5 h-5" />
                    {notifications.some(n => n.isNew) && (
                      <div className="absolute top-1 right-2 h-2 w-2 rounded-full bg-red-500"></div>
                    )}
                  </div>
                  
                  <div
                    onClick={handleSignOut}
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  © 2023 Catatan Uang
                </div>
              </>
            )}
            
            {isCollapsed && typeof window !== 'undefined' && (
              <div className="flex flex-col items-center space-y-4">
                {/* Collapsed user info */}
                {session?.user && (
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
                
                <div
                  onClick={toggleDarkMode}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative cursor-pointer"
                >
                  {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </div>
                
                <Link
                  href="/settings"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </Link>
                
                <div
                  onClick={toggleNotifications}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative cursor-pointer"
                >
                  <BellIcon className="w-5 h-5" />
                  {notifications.some(n => n.isNew) && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></div>
                  )}
                </div>
                
                <div
                  onClick={handleSignOut}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative cursor-pointer"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar; 