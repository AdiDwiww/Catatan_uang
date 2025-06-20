import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Handler untuk mencegah flash hitam pada transisi halaman
    const handleRouteChangeStart = (url) => {
      // Pada load pertama, jangan tampilkan animasi
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }
      
      // Mulai loading state
      setLoading(true);
      
      // Tambahkan class untuk menonaktifkan pointer events saat loading
      document.documentElement.classList.add('route-transition-active');
      
      // Buat overlay untuk mencegah flash
      if (!document.getElementById('route-transition-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'route-transition-backdrop';
        backdrop.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-color: var(--body-bg-color);
          opacity: 0;
          pointer-events: none;
        `;
        document.body.appendChild(backdrop);
      }
      
      // Buat efek loading untuk memberi feedback visual
      if (!document.getElementById('page-transition-loader')) {
        const loader = document.createElement('div');
        loader.id = 'page-transition-loader';
        loader.className = 'page-transition-loader';
        loader.innerHTML = `
          <div class="page-transition-progress"></div>
        `;
        document.body.appendChild(loader);

        // Force reflow untuk memastikan animasi berjalan
        loader.offsetHeight;
      }
    };

    const handleRouteChangeComplete = () => {
      // Hapus kelas transisi setelah delay singkat
      setTimeout(() => {
        document.documentElement.classList.remove('route-transition-active');
      }, 50);
      
      // Hapus loader dengan animasi fade-out
      const loader = document.getElementById('page-transition-loader');
      if (loader) {
        loader.classList.add('completing');
        setTimeout(() => {
          if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
      
      // Hapus backdrop
      const backdrop = document.getElementById('route-transition-backdrop');
      if (backdrop) {
        setTimeout(() => {
          if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }, 100);
      }
      
      // Selesai loading
      setTimeout(() => {
        setLoading(false);
      }, 100);
    };

    const handleRouteChangeError = () => {
      // Hapus kelas dan loader jika terjadi error
      document.documentElement.classList.remove('route-transition-active');
      
      const loader = document.getElementById('page-transition-loader');
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
      
      const backdrop = document.getElementById('route-transition-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      setLoading(false);
    };

    // Tambahkan style untuk loader dan animasi
    const style = document.createElement('style');
    style.id = 'page-transition-styles';
    style.innerHTML = `
      .route-transition-active {
        cursor: wait;
      }
      
      .route-transition-active * {
        pointer-events: none !important;
      }
      
      .page-transition-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        z-index: 1000;
        background-color: transparent;
        opacity: 1;
        transition: opacity 300ms ease;
        pointer-events: none !important;
      }
      
      .page-transition-loader.completing {
        opacity: 0;
      }
      
      .page-transition-progress {
        height: 100%;
        width: 0%;
        background-color: #6366F1;
        background-image: linear-gradient(to right, #6366F1, #8B5CF6);
        box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
        animation: loading 1.2s ease-in-out forwards;
      }
      
      /* Perbaiki style app-wrapper agar tidak mengganggu scroll */
      .app-wrapper {
        min-height: 100%;
        width: 100%;
        position: relative;
        overflow-y: visible;
        display: flex;
        flex-direction: column;
      }
      
      /* Pastikan content bisa di-scroll */
      html, body {
        overflow-y: auto !important;
      }
      
      /* Jangan menggunakan fixed height yang dapat mengganggu scroll */
      .page-loading {
        opacity: 1;
      }
      
      @keyframes loading {
        0% { width: 0; }
        20% { width: 20%; }
        45% { width: 45%; }
        60% { width: 60%; }
        80% { width: 80%; }
        95% { width: 95%; }
        100% { width: 100%; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .page-transition-progress {
          animation-duration: 0.6s;
        }
      }
    `;
    document.head.appendChild(style);

    // Pre-cache halaman
    const precachePages = ['/customer', '/transaksi', '/laporan', '/'];
    precachePages.forEach(page => {
      router.prefetch(page);
    });

    // Register listeners
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      // Clean up
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
      
      // Hapus style
      const styleElement = document.getElementById('page-transition-styles');
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
      
      const loader = document.getElementById('page-transition-loader');
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
      
      const backdrop = document.getElementById('route-transition-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    };
  }, [router, initialLoad]);

  return (
    <SessionProvider session={session}>
      <div className={`app-wrapper ${loading ? 'page-loading' : ''}`}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp; 