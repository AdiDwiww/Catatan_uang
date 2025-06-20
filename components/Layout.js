import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileMenu from './MobileMenu';
import NotificationsDropdown from './NotificationsDropdown';

// Simpan state sidebar di level global agar tetap bertahan saat navigasi
let globalSidebarState = null;

export default function Layout({ children }) {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);
  const styleTagRef = useRef(null);
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
  const [isClient, setIsClient] = useState(false);
  const [isDOMLoaded, setIsDOMLoaded] = useState(false);

  // Gunakan useMemo untuk menyimpan ukuran sidebar
  const sidebarWidth = useMemo(() => isCollapsed ? '5rem' : '18rem', [isCollapsed]);

  // Deteksi client rendering dan inisialisasi state
  useEffect(() => {
    setIsClient(true);
    
    // Tunggu DOM selesai dirender sebelum mengaplikasikan transformasi visual
    // Ini mencegah "flash of unstyled content" saat halaman pertama kali dimuat
    window.requestAnimationFrame(() => {
      setIsDOMLoaded(true);
    });
    
    // Gunakan state global jika tersedia, jika tidak cek localStorage
    if (globalSidebarState !== null) {
      setIsCollapsed(globalSidebarState);
    } else {
      try {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          setIsCollapsed(savedState === 'true');
          globalSidebarState = savedState === 'true';
        }
      } catch (err) {
        // Antisipasi jika localStorage tidak tersedia
        console.log('LocalStorage not available');
      }
    }

    // Dark mode check
    try {
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
    } catch (err) {
      // Antisipasi jika localStorage tidak tersedia
      console.log('LocalStorage not available');
    }
  }, []);

  // Effect terpisah untuk menangani navigasi dan event listener
  useEffect(() => {
    if (!isClient) return;
    
    // Persiapkan penanganan navigasi
    const handleBeforeHistoryChange = () => {
      // Bekukan posisi sidebar sebelum navigasi
      if (sidebarRef.current) {
        // Simpan posisi sidebar saat ini untuk dipertahankan selama navigasi
        const currentWidth = sidebarRef.current.offsetWidth;
        sidebarRef.current.style.width = `${currentWidth}px`;
        sidebarRef.current.style.transition = 'none';
      }
      
      // Bekukan posisi main content juga
      if (mainRef.current) {
        const currentMargin = window.getComputedStyle(mainRef.current).marginLeft;
        mainRef.current.style.marginLeft = currentMargin;
        mainRef.current.style.transition = 'none';
      }
    };
    
    // Tambahkan kelas khusus untuk mengelola navigasi dan menghindari flickering
    const handleStart = (url) => {
      // Jangan lakukan apapun jika hanya navigasi ke halaman yang sama dengan query parameter berbeda
      if (url.split('?')[0] === router.asPath.split('?')[0]) return;
      
      setIsNavigating(true);
      handleBeforeHistoryChange();
    };

    const handleComplete = (url) => {
      // Jangan lakukan apapun jika hanya navigasi ke halaman yang sama dengan query parameter berbeda
      if (url.split('?')[0] === router.asPath.split('?')[0]) return;
      
      // Tunggu sebentar sebelum mengaktifkan kembali transisi
      // Perpanjang waktu tunggu untuk memastikan page sudah sepenuhnya dirender
      setTimeout(() => {
        setIsNavigating(false);
        if (sidebarRef.current) {
          sidebarRef.current.style.transition = '';
          sidebarRef.current.style.width = '';
        }
        if (mainRef.current) {
          mainRef.current.style.transition = '';
          mainRef.current.style.marginLeft = '';
        }
      }, 300);
      setIsMobileMenuOpen(false);
    };
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
    
    // Setup event listener untuk click outside notifikasi
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    
    // Persiapkan clean-up untuk mencegah memory leak dan konflik listener
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [router, isClient]);

  // Effect terpisah untuk CSS styling - create once, update when needed
  useEffect(() => {
    if (!isClient) return;
    
    // Jangan inject style jika belum DOMLoaded untuk menghindari FOUC
    if (!isDOMLoaded) return;
    
    // Gunakan ref untuk menyimpan elemen style
    if (!styleTagRef.current) {
      const style = document.createElement('style');
      style.id = 'sidebar-dynamic-styles';
      styleTagRef.current = style;
      document.head.appendChild(style);
    }
    
    // Update konten CSS style tag jika sudah ada
    styleTagRef.current.innerHTML = `
      /* Set fixed width for the sidebar in px untuk mencegah animasi reflow */
      .sidebar {
        position: fixed;
        height: 100%;
        top: 0;
        left: 0;
        width: ${isCollapsed ? '5rem' : '18rem'};
        will-change: width;
        z-index: 30;
        overflow-x: hidden;
      }
      
      /* Hanya animasikan saat tidak dalam keadaan navigasi untuk mencegah flickering */
      .sidebar:not(.navigating) {
        transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Gunakan transform untuk performance yang lebih baik */
      .sidebar-inner {
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform: translateZ(0);
      }
      
      /* Optimasi untuk main content margin */
      .main-content {
        margin-left: ${isCollapsed ? '5rem' : '18rem'};
        will-change: margin-left;
      }
      
      /* Animation hanya saat tidak navigasi */
      .main-content:not(.navigating) {
        transition: margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Prevent text from flickering during sidebar transitions */
      .sidebar span, .sidebar p, .sidebar div {
        white-space: nowrap;
        overflow: hidden;
      }
      
      /* Mobile optimizations */
      @media (max-width: 1024px) {
        .main-content {
          margin-left: 0;
        }
        
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
    
    return () => {
      // Clean up pada unmount
      if (styleTagRef.current) {
        document.head.removeChild(styleTagRef.current);
        styleTagRef.current = null;
      }
    };
  }, [isCollapsed, isClient, isDOMLoaded]);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (isClient) {
      try {
        localStorage.setItem('darkMode', newMode.toString());
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.log('LocalStorage not available');
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleSidebar = () => {
    // Disable transition during navigation
    if (isNavigating) return;
    
    // Mencegah multiple toggle terlalu cepat dengan toggle locking
    if (sidebarRef.current && sidebarRef.current.dataset.toggling === 'true') return;
    
    // Set toggle lock
    if (sidebarRef.current) {
      sidebarRef.current.dataset.toggling = 'true';
      
      // Remove lock setelah transisi selesai
      setTimeout(() => {
        if (sidebarRef.current) sidebarRef.current.dataset.toggling = 'false';
      }, 300);
    }
    
    const newState = !isCollapsed;
    
    // Update state lokal dan global
    setIsCollapsed(newState);
    if (isClient) {
      globalSidebarState = newState;
      try {
        localStorage.setItem('sidebarCollapsed', newState.toString());
      } catch (err) {
        console.log('LocalStorage not available');
      }
    }
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

      {/* Mobile Menu Component */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        router={router}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Desktop Sidebar dan Notifications Component - render hanya setelah client side */}
      {isClient && isDOMLoaded && (
        <>
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
          
          <NotificationsDropdown
            showNotifications={showNotifications}
            notifications={notifications}
            ref={notificationsRef}
          />
        </>
      )}
      
      {/* Main Content */}
      <main 
        ref={mainRef} 
        className={`main-content ${isNavigating ? 'navigating' : ''} mobile-content`}
      >
        {/* Tambahkan placeholder div untuk mencegah konten bergeser saat sidebar dimuat */}
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 