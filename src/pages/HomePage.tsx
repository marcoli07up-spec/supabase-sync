import { Link } from 'react-router-dom';
import { ChevronRight, Truck, RefreshCw, Shield, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useBanners } from '@/hooks/useBanners';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useReviews } from '@/hooks/useReviews';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

export default function HomePage() {
  const { data: banners, isLoading: bannersLoading } = useBanners();
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: reviews } = useReviews();

  return (
    <Layout>
      {/* Hero Banner Carousel */}
      <section className="relative">
        {bannersLoading ? (
          <Skeleton className="w-full aspect-[21/9] md:aspect-[3/1]" />
        ) : banners && banners.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden">
                    <img
                      src={banner.image_url}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
                      <div className="container-custom">
                        <div className="max-w-lg">
                          {banner.title && (
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                              {banner.title}
                            </h1>
                          )}
                          {banner.subtitle && (
                            <p className="text-muted-foreground text-sm md:text-lg mb-4 md:mb-6">
                              {banner.subtitle}
                            </p>
                          )}
                          {banner.link && (
                            <Link to={banner.link}>
                              <Button size="lg" className="group">
                                {banner.button_text || 'Ver mais'}
                                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        ) : null}
      </section>

      {/* Benefits bar */}
      <section className="bg-secondary py-4 md:py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Entrega em todo Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Parcelamento</p>
                <p className="text-xs text-muted-foreground">Em até 3x sem juros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Pagamento à vista</p>
                <p className="text-xs text-muted-foreground">Ganhe 5% desconto</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Segurança</p>
                <p className="text-xs text-muted-foreground">Loja com SSL</p>
              </div>
            </div>
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
          <ProductGrid
            products={featuredProducts || []}
            isLoading={featuredLoading}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12 bg-secondary">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Navegue por Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-all text-center group"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Todos os Produtos</h2>
          <ProductGrid
            products={allProducts || []}
            isLoading={productsLoading}
          />
        </div>
      </section>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="py-8 md:py-12 bg-secondary">
          <div className="container-custom">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">O que nossos clientes dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-primary fill-primary' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    "{review.comment}"
                  </p>
                  <p className="font-semibold text-sm">{review.reviewer_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About section */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Sobre nós</h2>
            <p className="text-muted-foreground mb-6">
              Paixão por imagem e compromisso com confiança. Somos uma loja especializada em{' '}
              <strong className="text-foreground">câmeras e equipamentos fotográficos</strong>, com loja física, 
              atendimento especializado e envio para todo o Brasil. Trabalhamos com produtos novos e seminovos revisados,{' '}
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
    </Layout>
  );
}
