import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileMenu from './MobileMenu';
import NotificationsDropdown from './NotificationsDropdown';

export default function Layout({ children }) {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Transaksi baru telah ditambahkan', time: '5 menit yang lalu', isNew: true },
    { id: 2, text: 'Laporan bulanan tersedia', time: '1 jam yang lalu', isNew: false },
    { id: 3, text: 'Pengingat: Update data customer', time: '1 hari yang lalu', isNew: false },
  ]);

  // Gunakan useMemo untuk menyimpan ukuran sidebar
  const sidebarWidth = useMemo(() => isCollapsed ? '5rem' : '18rem', [isCollapsed]);

  // Periksa value dari localStorage sebelum render pertama
  useEffect(() => {
    // Dark mode check
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
    
    // Sidebar collapsed state check
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }

    // Tambahkan kelas khusus untuk mengelola navigasi dan menghindari flickering
    const handleStart = () => {
      setIsNavigating(true);
      if (sidebarRef.current) {
        sidebarRef.current.classList.add('navigating');
        // Disable transisi selama navigasi untuk mencegah flickering
        sidebarRef.current.style.transition = 'none';
      }
      if (mainRef.current) {
        mainRef.current.classList.add('navigating');
        mainRef.current.style.transition = 'none';
      }
    };

    const handleComplete = () => {
      // Tunggu sebentar sebelum mengaktifkan kembali transisi
      setTimeout(() => {
        setIsNavigating(false);
        if (sidebarRef.current) {
          sidebarRef.current.classList.remove('navigating');
          sidebarRef.current.style.transition = '';
        }
        if (mainRef.current) {
          mainRef.current.classList.remove('navigating');
          mainRef.current.style.transition = '';
        }
      }, 150);
      setIsMobileMenuOpen(false);
    };
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    
    // Setup event listener untuk click outside notifikasi
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    
    // Tambahkan CSS untuk transisi sidebar
    const style = document.createElement('style');
    style.innerHTML = `
      .sidebar {
        width: ${isCollapsed ? '5rem' : '18rem'};
        will-change: width;
      }
      .sidebar:not(.navigating) {
        transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .main-content {
        margin-left: ${isCollapsed ? '5rem' : '18rem'};
        will-change: margin-left;
      }
      .main-content:not(.navigating) {
        transition: margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Prevent text from flickering during sidebar transitions */
      .sidebar span {
        white-space: nowrap;
        overflow: hidden;
      }
      
      /* Mobile optimizations */
      @media (max-width: 1024px) {
        .mobile-header {
          height: 64px;
          padding: 0 16px;
        }
        
        .mobile-menu {
          width: 85%;
          max-width: 320px;
        }
        
        .mobile-menu-content {
          padding: 24px 16px;
          padding-top: 80px;
        }
        
        .mobile-nav-item {
          border-radius: 12px;
          margin-bottom: 4px;
          transition: background-color 0.2s ease;
        }
        
        /* Safe area inset for modern mobile devices */
        .mobile-header {
          padding-top: env(safe-area-inset-top);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          height: calc(64px + env(safe-area-inset-top));
        }
        
        .mobile-menu {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
        }
        
        .mobile-content {
          padding-bottom: env(safe-area-inset-bottom);
          padding-top: calc(64px + env(safe-area-inset-top));
        }
        
        /* Better touch targets */
        button, a {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Remove hover effects on mobile */
        @media (hover: none) {
          .hover\\:bg-gray-100:hover {
            background-color: transparent;
          }
          .hover\\:bg-gray-700\\/50:hover {
            background-color: transparent;
          }
        }
      }

      /* Add fadeIn animation for notifications */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.head.removeChild(style);
    };
  }, [router, isCollapsed]);

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
    // Disable transition during navigation
    if (isNavigating) return;
    
    // Mencegah multiple toggle terlalu cepat
    if (sidebarRef.current && sidebarRef.current.classList.contains('animating')) return;
    
    const newState = !isCollapsed;
    
    // Tandai sedang dalam animasi
    if (sidebarRef.current) {
      sidebarRef.current.classList.add('animating');
      
      // Hapus kelas animating setelah transisi selesai
      setTimeout(() => {
        if (sidebarRef.current) sidebarRef.current.classList.remove('animating');
      }, 300); // Sedikit lebih lama dari durasi transisi untuk jaga-jaga
    }
    
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };
  
  const toggleNotifications = (e) => {
    if (e) e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header Component */}
      <MobileHeader
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleNotifications={toggleNotifications}
        notifications={notifications}
      />

      {/* Notifications Dropdown Component */}
      <NotificationsDropdown
        showNotifications={showNotifications}
        notifications={notifications}
        ref={notificationsRef}
      />

      {/* Mobile Menu Component */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        router={router}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Desktop Sidebar Component */}
      <Sidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        toggleNotifications={toggleNotifications}
        notifications={notifications}
        router={router}
        ref={sidebarRef}
      />
      
      {/* Main Content */}
      <main 
        ref={mainRef} 
        className={`main-content ${isNavigating ? 'navigating' : ''} mobile-content`} 
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? sidebarWidth : '0' }}
      >
        {/* Responsive page padding */}
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 