import Link from 'next/link';
import { 
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function MobileHeader({ 
  isDark, 
  toggleDarkMode, 
  toggleMobileMenu, 
  isMobileMenuOpen,
  toggleNotifications,
  notifications
}) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md h-16 safe-top">
      <div className="flex items-center justify-between h-full px-4">
        <Link href="/" className="flex items-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Catatan Uang
          </h1>
        </Link>
        <div className="flex items-center">
          <button
            onClick={toggleNotifications}
            className="p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {notifications.some(n => n.isNew) && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-1"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <button 
            onClick={toggleMobileMenu}
            className="p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  );
} 