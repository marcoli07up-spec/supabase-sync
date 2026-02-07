import { ReactNode } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { StoreLocation } from './StoreLocation';
import { FloatingButtons } from './FloatingButtons';
import { CartDrawer } from '@/components/cart/CartDrawer';
interface LayoutProps {
  children: ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  return <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <StoreLocation />
      <AboutSection />
      <Footer />
      <FloatingButtons />
      <CartDrawer />
    </div>;
}
function AboutSection() {
  return;
}