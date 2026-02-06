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

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
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
    </div>
  );
}

function AboutSection() {
  return (
    <section className="py-8 md:py-12 bg-background border-t border-border">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Sobre a iCamStore</h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
          Paixão por imagem e compromisso com confiança. Somos uma loja especializada em câmeras e equipamentos fotográficos seminovos, 
          oferecendo produtos revisados com garantia de 1 ano. Nossa missão é tornar a fotografia profissional acessível para todos, 
          com equipamentos de qualidade a preços justos e atendimento personalizado.
        </p>
      </div>
    </section>
  );
}
