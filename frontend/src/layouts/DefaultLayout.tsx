// src/layouts/DefaultLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export default function DefaultLayout() {
  const { pathname } = useLocation();
  const showLayout = pathname !== '/login' && pathname !== '/signup';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-unihelp-white">
      {showLayout && <Header />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {showLayout && <Footer />}
      <Toaster 
      containerClassName='mt-18'
        position="top-right"
        toastOptions={{
          duration: 4000,
          icon: '🎉',
          style: { 
            fontFamily: 'inherit',
            background: '#00D4AB',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          },
        }}
      />
    </div>
  );
}
