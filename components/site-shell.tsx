'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </>
  );
}
