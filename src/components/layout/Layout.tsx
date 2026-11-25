import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CompareDrawer } from '../ui/CompareDrawer';
import { QuickViewModal } from '../ui/QuickViewModal';
import { SizeGuideModal } from '../ui/SizeGuideModal';
import { ToastContainer } from '../ui/ToastContainer';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, search]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4ED] text-[#202020]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <QuickViewModal />
      <SizeGuideModal />
      <CompareDrawer />
      <WhatsAppButton />
      <ToastContainer />
    </div>
  );
}
