import Link from 'next/link';
import { forwardRef } from 'react';

const NotificationsDropdown = forwardRef(function NotificationsDropdown({ 
  showNotifications, 
  notifications 
}, ref) {
  if (!showNotifications) return null;
  
  return (
    <div 
      ref={ref} 
      className="absolute top-16 lg:top-6 right-4 z-50 w-[calc(100%-2rem)] sm:w-96 max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
      style={{
        maxHeight: 'calc(100vh - 80px - env(safe-area-inset-top))',
        marginTop: '8px'
      }}
    >
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifikasi</h3>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300">
          Tandai sudah dibaca
        </span>
      </div>
      <div className="max-h-80 overflow-y-auto overscroll-contain">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
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
      <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
        <Link href="/notifications" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
          Lihat semua notifikasi
        </Link>
      </div>
    </div>
  );
});

export default NotificationsDropdown; 