import { Link } from 'react-router-dom';
import { Truck, RefreshCw, Shield, CreditCard, Star, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// Category images
import camerasImg from '@/assets/categories/cameras.png';
import lentesImg from '@/assets/categories/lentes.png';
import audioImg from '@/assets/categories/audio.png';
import mochilasImg from '@/assets/categories/mochilas.png';
import iluminacaoImg from '@/assets/categories/iluminacao.png';

// Banner images
import bannerLentesImg from '@/assets/banners/lentes-premium.png';
import bannerAudioImg from '@/assets/banners/audio-premium.png';
import bannerIluminacaoImg from '@/assets/banners/iluminacao-premium.png';
import bannerUsadosImg from '@/assets/banners/usados-premium.png';

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

const bannerImages = [
  { src: bannerLentesImg, alt: 'Lentes', link: '/categoria/lentes' },
  { src: bannerAudioImg, alt: 'Áudio', link: '/categoria/audio' },
  { src: bannerIluminacaoImg, alt: 'Iluminação', link: '/categoria/iluminacao' },
  { src: bannerUsadosImg, alt: 'Usados', link: '/categoria/cameras-seminovas' },
];
const promoImages = [{
  src: freteGratisImg,
  alt: 'Frete Grátis'
}, {
  src: pixDescontoImg,
  alt: 'Desconto no PIX'
}, {
  src: garantiaImg,
  alt: '1 Ano de Garantia'
}, {
  src: pagamentoSeguroImg,
  alt: 'Pagamento Seguro'
}];
export default function HomePage() {
  const {
    data: featuredProducts,
    isLoading: featuredLoading
  } = useFeaturedProducts();
  const {
    data: allProducts,
    isLoading: productsLoading
  } = useProducts();
  const {
    data: reviews
  } = useReviews();
  const categories = [{
    id: '1',
    name: 'Câmeras',
    slug: 'cameras'
  }, {
    id: '2',
    name: 'Lentes',
    slug: 'lentes'
  }, {
    id: '3',
    name: 'Áudio',
    slug: 'audio'
  }, {
    id: '4',
    name: 'Mochilas',
    slug: 'mochilas'
  }, {
    id: '5',
    name: 'Iluminação',
    slug: 'iluminacao'
  }];
  return <Layout>
      {/* Hero Banner Carousel */}
      <section className="relative">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            require("embla-carousel-autoplay").default({
              delay: 4000,
              stopOnInteraction: false,
            })
          ]}
        >
          <CarouselContent>
            {bannerImages.map((banner, index) => <CarouselItem key={index}>
                <Link to={banner.link} className="block relative aspect-[21/9] md:aspect-[3/1] overflow-hidden">
                  <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
                </Link>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Benefits bar with promo images */}
      <section className="py-4 md:py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {promoImages.map((promo, index) => <div key={index} className="aspect-video overflow-hidden rounded-xl">
                <img src={promo.src} alt={promo.alt} className="w-full h-full object-cover" />
              </div>)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Produtos em Destaque</h2>
            <Link to="/categoria/cameras" className="text-primary text-sm hover:underline">
              Ver todos
            </Link>
          </div>
          <ProductGrid products={featuredProducts || []} isLoading={featuredLoading} />
        </div>
      </section>

      {/* Categories with Images */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Navegue por Categoria</h2>
          <div className="flex flex-col md:grid md:grid-cols-5 gap-3 md:gap-4">
            {categories.map(category => <Link key={category.id} to={`/categoria/${category.slug}`} className="relative aspect-[16/9] md:aspect-[3/4] rounded-2xl overflow-hidden group">
                <img src={categoryImages[category.slug]} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{category.name}</h3>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Todos os Produtos</h2>
          <ProductGrid products={allProducts || []} isLoading={productsLoading} />
        </div>
      </section>

      {/* Reviews with Reclame Aqui Badge */}
      {reviews && reviews.length > 0 && <section className="py-8 md:py-12 bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">O que nossos clientes dizem</h2>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Avaliações auditadas pelo</span>
                <span className="font-bold text-green-600">Reclame Aqui</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                  Nota 9.2
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviews.slice(0, 4).map(review => <div key={review.id} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({
                length: 5
              }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} />)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{review.reviewer_name}</p>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verificado
                    </span>
                  </div>
                </div>)}
            </div>
            <div className="text-center mt-6">
              <a href="https://www.reclameaqui.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <img src="https://www.reclameaqui.com.br/dist/img/logo-reclame-aqui.svg" alt="Reclame Aqui" className="h-5" onError={e => {
              e.currentTarget.style.display = 'none';
            }} />
                Ver todas as avaliações
              </a>
            </div>
          </div>
        </section>}

      {/* About section */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Sobre a iCamStore</h2>
            <p className="text-muted-foreground mb-6">
              Paixão por imagem e compromisso com confiança. Somos uma loja especializada em{' '}
              <strong className="text-foreground">câmeras e equipamentos fotográficos seminovos</strong>, com loja física, 
              atendimento especializado e envio para todo o Brasil. Trabalhamos com produtos revisados,{' '}
              <strong className="text-foreground">nota fiscal</strong>,{' '}
              <strong className="text-foreground">rastreio</strong> e{' '}
              <strong className="text-foreground">1 ano de garantia</strong> para sua total tranquilidade.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Envio com rastreio</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Satisfação ou Reembolso</p>
                <p className="text-xs text-muted-foreground">Dinheiro de volta em 7 dias</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Suporte Profissional</p>
                <p className="text-xs text-muted-foreground">Atendimento especializado</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Compra Segura</p>
                <p className="text-xs text-muted-foreground">PIX e Cartão</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
}