import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RefreshCw, Shield, CreditCard, Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';

// Category images
import camerasImg from '@/assets/categories/cameras.png';
import lentesImg from '@/assets/categories/lentes.png';
import audioImg from '@/assets/categories/audio.png';
import mochilasImg from '@/assets/categories/mochilas.png';
import iluminacaoImg from '@/assets/categories/iluminacao.png';

// Banner images - Desktop
import bannerLentesImg from '@/assets/banners/lentes-premium.png';
import bannerAudioImg from '@/assets/banners/audio-premium.png';
import bannerIluminacaoImg from '@/assets/banners/iluminacao-premium.png';
import bannerUsadosImg from '@/assets/banners/usados-premium.png';

// Banner images - Mobile
import mobileCamera from '@/assets/banners/mobile-cameras.png';
import mobileAudio from '@/assets/banners/mobile-audio.png';
import mobileTripe from '@/assets/banners/mobile-tripe.png';

// Promo images
import freteGratisImg from '@/assets/promos/frete-gratis.png';
import pixDescontoImg from '@/assets/promos/pix-desconto.png';
import garantiaImg from '@/assets/promos/garantia.png';
import pagamentoSeguroImg from '@/assets/promos/pagamento-seguro.png';

const categoryImages: Record<string, string> = {
  cameras: camerasImg,
  lentes: lentesImg,
  audio: audioImg,
  mochilas: mochilasImg,
  iluminacao: iluminacaoImg
};

const bannerImagesDesktop = [
  { src: bannerLentesImg, alt: 'Lentes', link: '/categoria/lentes' },
  { src: bannerAudioImg, alt: 'Áudio', link: '/categoria/audio' },
  { src: bannerIluminacaoImg, alt: 'Iluminação', link: '/categoria/iluminacao' },
  { src: bannerUsadosImg, alt: 'Usados', link: '/categoria/cameras-seminovas' },
];

const bannerImagesMobile = [
  { src: mobileCamera, alt: 'Câmeras de Ação', link: '/categoria/cameras' },
  { src: mobileAudio, alt: 'Áudio Pro', link: '/categoria/audio' },
  { src: mobileTripe, alt: 'Tripés', link: '/categoria/acessorios' },
];

const promoImages = [
  { src: freteGratisImg, alt: 'Frete Grátis' },
  { src: pixDescontoImg, alt: 'Desconto no PIX' },
  { src: garantiaImg, alt: '1 Ano de Garantia' },
  { src: pagamentoSeguroImg, alt: 'Pagamento Seguro' }
];

export default function HomePage() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);
  const mobileSlideCount = bannerImagesMobile.length;

  const onMobileSelect = useCallback(() => {
    if (!mobileApi) return;
    setMobileCurrentIndex(mobileApi.selectedScrollSnap());
  }, [mobileApi]);

  useEffect(() => {
    if (!mobileApi) return;
    onMobileSelect();
    mobileApi.on("select", onMobileSelect);
    return () => {
      mobileApi.off("select", onMobileSelect);
    };
  }, [mobileApi, onMobileSelect]);

  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: reviews } = useReviews();

  const categories = [
    { id: '1', name: 'Câmeras', slug: 'cameras' },
    { id: '2', name: 'Lentes', slug: 'lentes' },
    { id: '3', name: 'Áudio', slug: 'audio' },
    { id: '4', name: 'Mochilas', slug: 'mochilas' },
    { id: '5', name: 'Iluminação', slug: 'iluminacao' }
  ];

  return (
    <Layout>

      {/* Hero Banner Mobile */}
      <section className="relative md:hidden">
        <Carousel
          className="w-full"
          opts={{ align: "start", loop: true }}
          plugins={[autoplayPlugin.current]}
          setApi={setMobileApi}
        >
          <CarouselContent>
            {bannerImagesMobile.map((banner, index) => (
              <CarouselItem key={index}>
                <Link to={banner.link} className="block relative aspect-[2/3] overflow-hidden">
                  <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-10 w-10"
            onClick={() => mobileApi?.scrollPrev()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-10 w-10"
            onClick={() => mobileApi?.scrollNext()}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </Carousel>

        <div className="px-4 py-2">
          <Progress value={((mobileCurrentIndex + 1) / mobileSlideCount) * 100} className="h-1" />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {mobileCurrentIndex + 1} / {mobileSlideCount}
          </p>
        </div>
      </section>

      {/* Hero Banner Desktop */}
      <section className="relative hidden md:block">
        <Carousel
          className="w-full"
          opts={{ align: "start", loop: true }}
          plugins={[autoplayPlugin.current]}
        >
          <CarouselContent>
            {bannerImagesDesktop.map((banner, index) => (
              <CarouselItem key={index}>
                <Link to={banner.link} className="block relative aspect-[3/1] overflow-hidden">
                  <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Featured */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Produtos em Destaque</h2>
          <ProductGrid products={featuredProducts || []} isLoading={featuredLoading} />
        </div>
      </section>

      {/* All Products */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Todos os Produtos</h2>
          <ProductGrid products={allProducts || []} isLoading={productsLoading} />
        </div>
      </section>

      {/* About */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Sobre a Câmeras Prime</h2>
            <p className="text-muted-foreground mb-6">
              A <strong className="text-foreground">Câmeras Prime</strong> é especializada em câmeras e equipamentos fotográficos seminovos,
              com garantia, nota fiscal e envio para todo o Brasil.
            </p>
          </div>
        </div>
      </section>

    </Layout>
  );
}
