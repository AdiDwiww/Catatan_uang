import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  
  // Efek untuk mengoptimalkan transisi halaman
  useEffect(() => {
    // Handler untuk mencegah flash hitam pada transisi halaman
    const handleRouteChangeStart = () => {
      // Pastikan transisi halaman mulus
      document.documentElement.classList.add('route-transition-active');
      
      // Buat efek loading untuk memberi feedback visual
      const loader = document.createElement('div');
      loader.className = 'page-transition-loader';
      loader.innerHTML = `
        <div class="page-transition-progress"></div>
      `;
      document.body.appendChild(loader);
    };

    const handleRouteChangeComplete = () => {
      // Hapus kelas transisi
      document.documentElement.classList.remove('route-transition-active');
      
      // Hapus loader dengan animasi fade-out
      const loader = document.querySelector('.page-transition-loader');
      if (loader) {
        loader.classList.add('completing');
        setTimeout(() => {
          if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
    };

    const handleRouteChangeError = () => {
      // Hapus kelas dan loader jika terjadi error
      document.documentElement.classList.remove('route-transition-active');
      
      const loader = document.querySelector('.page-transition-loader');
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    };

    // Tambahkan style untuk loader dan animasi
    const style = document.createElement('style');
    style.id = 'page-transition-styles';
    style.innerHTML = `
      .route-transition-active * {
        pointer-events: none;
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
        transition: opacity 300ms;
      }
      
      .page-transition-loader.completing {
        opacity: 0;
      }
      
      .page-transition-progress {
        height: 100%;
        width: 0%;
        background-color: #6366F1;
        animation: loading 1s ease-in-out forwards;
      }
      
      @keyframes loading {
        0% { width: 0; }
        20% { width: 20%; }
        60% { width: 60%; }
        80% { width: 80%; }
        95% { width: 95%; }
        100% { width: 100%; }
      }
    `;
    document.head.appendChild(style);

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
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp; 