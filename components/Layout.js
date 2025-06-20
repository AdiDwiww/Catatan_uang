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
  const noAnimationStyleRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pageTransition, setPageTransition] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Transaksi baru telah ditambahkan', time: '5 menit yang lalu', isNew: true },
    { id: 2, text: 'Laporan bulanan tersedia', time: '1 jam yang lalu', isNew: false },
    { id: 3, text: 'Pengingat: Update data customer', time: '1 hari yang lalu', isNew: false },
  ]);
  const [isClient, setIsClient] = useState(false);
  
  // Ukuran sidebar dalam pixel (bukan rem) untuk konsistensi absolut
  const collapsedWidth = 80; // 5rem = 80px
  const expandedWidth = 288; // 18rem = 288px
  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;

  // Fungsi helper untuk safely remove sebuah element
  const safeRemoveElement = (element) => {
    try {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (err) {
      console.log('Error removing element:', err);
    }
  };

  // Deteksi client rendering dan inisialisasi state
  useEffect(() => {
    setIsClient(true);
    
    // Matikan semua animasi CSS saat halaman pertama kali dimuat
    try {
      const noAnimationStyle = document.createElement('style');
      noAnimationStyle.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
      document.head.appendChild(noAnimationStyle);
      noAnimationStyleRef.current = noAnimationStyle;
      
      // Load sidebar state
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
        console.log('LocalStorage not available');
      }
      
      // Hapus style noAnimation setelah load awal selesai
      setTimeout(() => {
        safeRemoveElement(noAnimationStyle);
        injectStyles();
      }, 300);
    } catch (err) {
      console.log('Error in init effect:', err);
    }
    
    return () => {
      if (noAnimationStyleRef.current) {
        safeRemoveElement(noAnimationStyleRef.current);
      }
    };
  }, []);
  
  // Fungsi untuk menginjeksi CSS styles
  const injectStyles = () => {
    if (!isClient) return;
    
    try {
      // Hapus style lama jika ada
      if (styleTagRef.current) {
        safeRemoveElement(styleTagRef.current);
        styleTagRef.current = null;
      }
      
      // Buat style tag baru
      const style = document.createElement('style');
      style.id = 'sidebar-dynamic-styles';
      
      // Set CSS dengan nilai absolut dalam pixel bukan rem
      style.textContent = `
        /* Sidebar styles */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${sidebarWidth}px;
          z-index: 30;
          box-sizing: border-box;
          will-change: transform;
          transform: translateZ(0);
          overflow: hidden;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dark .sidebar {
          background-color: #1f2937;
        }

        /* Main content styles */
        .main-content {
          margin-left: ${sidebarWidth}px;
          min-height: 100vh;
          position: relative;
          transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Prevent text flickering in sidebar */
        .sidebar-text {
          opacity: ${isCollapsed ? '0' : '1'};
          visibility: ${isCollapsed ? 'hidden' : 'visible'};
          white-space: nowrap;
          transition: opacity 200ms ease;
        }
        
        /* Prevent layout shifts by fixing sidebar inner elements */
        .sidebar-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Mobile optimizations */
        @media (max-width: 1023px) {
          .sidebar {
            display: none;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
        }
        
        /* Page transition animations */
        .page-content {
          position: relative;
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .transition-fade .page-content {
          animation-name: fadeIn;
        }
        
        .transition-slide-up .page-content {
          animation-name: slideUp;
        }
        
        .transition-slide-right .page-content {
          animation-name: slideRight;
        }
      `;
      
      document.head.appendChild(style);
      styleTagRef.current = style;
    } catch (err) {
      console.log('Error injecting styles:', err);
    }
  };

  // Effect untuk mengupdate CSS saat sidebar state berubah
  useEffect(() => {
    if (!isClient) return;
    injectStyles();
  }, [isCollapsed, isClient, sidebarWidth]);

  // Effect untuk menangani navigasi
  useEffect(() => {
    if (!isClient) return;
    
    // Pilih animasi transisi halaman secara acak
    const getRandomTransition = () => {
      const transitions = ['transition-fade', 'transition-slide-up', 'transition-slide-right'];
      const randomIndex = Math.floor(Math.random() * transitions.length);
      return transitions[randomIndex];
    };
    
    const handleStart = (url) => {
      try {
        // Abaikan navigasi dalam halaman yang sama atau hanya perbedaan query params
        if (url.split('?')[0] === router.asPath.split('?')[0]) {
          return;
        }
        
        // Pilih animasi transisi baru
        setPageTransition('');
        setIsNavigating(true);
        
        // Pastikan sidebar tetap pada posisinya
        if (sidebarRef.current) {
          sidebarRef.current.style.transition = 'none';
        }
        
        // Pastikan main content tetap pada posisinya
        if (mainRef.current) {
          mainRef.current.style.transition = 'none';
          mainRef.current.style.marginLeft = `${sidebarWidth}px`;
        }
      } catch (err) {
        console.log('Error handling navigation start:', err);
      }
    };
    
    const handleComplete = (url) => {
      try {
        // Abaikan navigasi dalam halaman yang sama atau hanya perbedaan query params
        if (url.split('?')[0] === router.asPath.split('?')[0]) {
          return;
        }
        
        // Terapkan animasi setelah navigasi selesai
        setTimeout(() => {
          try {
            // Reset sidebar dan main content styles
            if (sidebarRef.current) {
              sidebarRef.current.style.transition = '';
            }
            
            if (mainRef.current) {
              mainRef.current.style.transition = '';
            }
            
            setIsNavigating(false);
            setPageTransition(getRandomTransition());
          } catch (err) {
            console.log('Error resetting after navigation:', err);
          }
        }, 50);
        
        setIsMobileMenuOpen(false);
      } catch (err) {
        console.log('Error handling navigation complete:', err);
      }
    };
    
    const handleBeforeHistoryChange = () => {
      try {
        // Pastikan sidebar tetap pada posisinya
        if (sidebarRef.current) {
          sidebarRef.current.style.transition = 'none';
        }
      } catch (err) {
        console.log('Error handling history change:', err);
      }
    };
    
    // Handle klik di luar notification dropdown
    const handleOutsideClick = (event) => {
      try {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
          setShowNotifications(false);
        }
      } catch (err) {
        console.log('Error handling outside click:', err);
      }
    };
    
    try {
      // Register event listeners
      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
      document.addEventListener('mousedown', handleOutsideClick);
    } catch (err) {
      console.log('Error registering event listeners:', err);
    }
    
    return () => {
      try {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
        document.removeEventListener('mousedown', handleOutsideClick);
      } catch (err) {
        console.log('Error cleaning up event listeners:', err);
      }
    };
  }, [router, isClient, sidebarWidth]);

  const toggleDarkMode = () => {
    try {
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
    } catch (err) {
      console.log('Error toggling dark mode:', err);
    }
  };

  const toggleMobileMenu = () => {
    try {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } catch (err) {
      console.log('Error toggling mobile menu:', err);
    }
  };
  
  // Tambahkan debounce sederhana untuk mencegah toggle berulang
  const toggleSidebar = () => {
    try {
      // Mencegah toggle selama navigasi
      if (isNavigating) return;
      
      // Mencegah toggle berulang cepat
      if (sidebarRef.current && sidebarRef.current.dataset.toggling === 'true') return;
      
      if (sidebarRef.current) {
        sidebarRef.current.dataset.toggling = 'true';
        
        const newState = !isCollapsed;
        
        // Update state lokal dan global
        setIsCollapsed(newState);
        globalSidebarState = newState;
        
        try {
          localStorage.setItem('sidebarCollapsed', newState.toString());
        } catch (err) {
          console.log('LocalStorage not available');
        }
        
        // Reset toggling state setelah animasi selesai
        setTimeout(() => {
          try {
            if (sidebarRef.current) {
              sidebarRef.current.dataset.toggling = 'false';
            }
          } catch (err) {
            console.log('Error resetting toggle state:', err);
          }
        }, 350);
      }
    } catch (err) {
      console.log('Error toggling sidebar:', err);
    }
  };
  
  const toggleNotifications = (e) => {
    try {
      if (e) e.stopPropagation();
      setShowNotifications(!showNotifications);
    } catch (err) {
      console.log('Error toggling notifications:', err);
    }
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

      {/* Desktop Sidebar Component */}
      {isClient && (
        <>
          <div className="sidebar" ref={sidebarRef}>
            <div className="sidebar-inner h-full">
              <Sidebar 
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isDark={isDark}
                toggleDarkMode={toggleDarkMode}
                toggleNotifications={toggleNotifications}
                notifications={notifications}
                router={router}
              />
            </div>
          </div>
          
          <NotificationsDropdown
            showNotifications={showNotifications}
            notifications={notifications}
            ref={notificationsRef}
          />
        </>
      )}
      
      {/* Main Content */}
      <main ref={mainRef} className="main-content mobile-content">
        <div className={`pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${pageTransition}`}>
          <div className="page-content max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 