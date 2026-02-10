import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Truck, Shield, RefreshCw, Star, Check, Clock, Award, Zap, CreditCard, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { ProductGrid, ReviewsCarousel } from '@/components/products';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useReviews, useProductReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, formatInstallments, getDiscountPercentage } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { trackViewContent } from '@/lib/facebook-pixel';
import { ReviewForm } from '@/components/products/ReviewForm';
import { ProductReviews } from '@/components/products/ProductReviews';
import { ShippingCalculator } from '@/components/products/ShippingCalculator';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: relatedProducts } = useRelatedProducts(id || '', product?.category_id || null);
  const { data: reviews } = useReviews();
  const { data: productReviews } = useProductReviews(id || '');
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const discount = product ? getDiscountPercentage(product.original_price || 0, product.price) : 0;
  
  const allImages = product ? [
    product.image_url,
    ...(product.images || []).filter(img => img !== product.image_url)
  ].filter(Boolean) as string[] : [];
  
  const currentImage = selectedImage || allImages[currentIndex] || product?.image_url || '/placeholder.svg';
  const pixPrice = product ? product.price * 0.95 : 0;
  const cardPrice = product ? product.price * 1.05 : 0;

  // Swipe handling for mobile image gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < allImages.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedImage(allImages[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setSelectedImage(allImages[currentIndex - 1]);
      }
    }
  };

  useEffect(() => {
    if (product) {
      trackViewContent({
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BRL',
      });
    }
  }, [product]);

  const handleBuyNow = () => {
    if (product) {
      addItem(product, 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/">
            <Button>Voltar para a loja</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const averageRating = productReviews?.length 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : 5;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/50 py-2 sm:py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary shrink-0">Home</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-2 sm:py-8">
        <div className="container-custom px-0 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-0 sm:gap-8 lg:gap-12">
            
            {/* === IMAGE SECTION === */}
            <div className="space-y-2 sm:space-y-4">
              {/* Main image - full width on mobile with swipe */}
              <div
                ref={mainImageRef}
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className={`aspect-square sm:rounded-2xl overflow-hidden bg-muted sm:border border-border ${(product.stock ?? 0) <= 0 ? 'grayscale' : ''}`}>
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {(product.stock ?? 0) <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-lg sm:text-2xl font-bold px-4 py-2 rounded-lg uppercase tracking-wider shadow-lg">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                {(product.stock ?? 0) > 0 && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5">
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-xs sm:text-sm font-bold px-2 py-0.5">
                        -{discount}%
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-[10px] sm:text-sm font-medium px-2 py-0.5">
                      Seminovo
                    </Badge>
                  </div>
                )}

                {/* Image counter dots on mobile */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setCurrentIndex(i); setSelectedImage(allImages[i]); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-primary w-4' : 'bg-foreground/40'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Stock warning */}
                {(product.stock ?? 0) <= 3 && (product.stock ?? 0) > 0 && (
                  <div className="absolute bottom-10 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4">
                    <div className="bg-destructive/90 text-destructive-foreground text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {product.name.toLowerCase().includes('seminov') 
                        ? 'Última unidade disponível!' 
                        : `Apenas ${product.stock} unidade${product.stock !== 1 ? 's' : ''} disponível!`}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail gallery - desktop & tablet only */}
              {allImages.length > 1 && (
                <div className="relative hidden sm:block px-0">
                  <button
                    onClick={() => thumbContainerRef.current?.scrollBy({ left: -140, behavior: 'smooth' })}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/90 border border-border rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div
                    ref={thumbContainerRef}
                    className="flex gap-2 overflow-x-auto pb-1 px-9"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedImage(img); setCurrentIndex(index); }}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImage === img 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img src={img} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => thumbContainerRef.current?.scrollBy({ left: 140, behavior: 'smooth' })}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/90 border border-border rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* === PRODUCT INFO === */}
            <div className="flex flex-col min-w-0 px-4 sm:px-0 pt-3 sm:pt-0">
              
              {/* Rating */}
              {!product.name.toLowerCase().includes('seminov') && productReviews && productReviews.length > 0 && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.round(averageRating) ? 'text-primary fill-primary' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    ({productReviews.length})
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Stock */}
              <div className="mb-3 sm:mb-4">
                {(product.stock ?? 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-success/10 text-success px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Check className="h-3.5 w-3.5" />
                    Em estoque
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Indisponível
                  </span>
                )}
              </div>

              {/* Pricing Card */}
              <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                {product.original_price && product.original_price > product.price && (
                  <p className="text-sm sm:text-lg text-muted-foreground line-through mb-1">
                    De: {formatCurrency(product.original_price)}
                  </p>
                )}
                
                {/* PIX */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 mb-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Zap className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-bold text-primary text-xl sm:text-2xl">
                      {formatCurrency(pixPrice)}
                    </span>
                    <span className="text-xs text-primary font-medium">no PIX</span>
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-[10px] ml-auto">
                        -{discount}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    Economize {formatCurrency(cardPrice - pixPrice)}
                  </p>
                </div>

                {/* Card */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong className="text-foreground text-sm sm:text-base">{formatCurrency(cardPrice)}</strong> no cartão
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                  12x de <strong className="text-foreground">{formatCurrency(cardPrice / 12)}</strong> sem juros
                </p>
              </div>

              {/* CTA - desktop only */}
              <div className="hidden sm:block space-y-3 mb-6">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold"
                  onClick={handleBuyNow}
                  disabled={(product.stock ?? 0) <= 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar agora
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  * Produto seminovo - unidade única disponível
                </p>
              </div>

              {/* Benefits - 2x2 grid on mobile */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {[
                  { icon: Truck, label: 'Frete Grátis', sub: 'Todo o Brasil' },
                  { icon: Shield, label: 'Garantia', sub: 'Cobertura total' },
                  { icon: RefreshCw, label: '90 Dias', sub: 'Para troca' },
                  { icon: Award, label: 'Revisado', sub: '100% testado' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-secondary rounded-lg">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium leading-tight">{label}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Calculator */}
              <div className="mb-4 sm:mb-6">
                <ShippingCalculator />
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-border pt-4 sm:pt-6 min-w-0">
                  <h3 className="font-semibold mb-3 text-base sm:text-lg">Descrição do Produto</h3>
                  <div 
                    className="text-foreground leading-relaxed prose prose-sm max-w-none min-w-0
                      prose-p:text-foreground prose-p:my-1.5 prose-p:text-[13px] sm:prose-p:text-sm prose-p:leading-relaxed
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-foreground prose-ul:my-1.5 prose-ul:list-disc prose-ul:pl-4
                      prose-ol:text-foreground prose-ol:my-1.5 prose-ol:list-decimal prose-ol:pl-4
                      prose-li:text-foreground prose-li:my-0.5 prose-li:text-[13px] sm:prose-li:text-sm
                      prose-headings:text-foreground prose-headings:font-semibold prose-headings:text-sm sm:prose-headings:text-base prose-headings:mt-3 prose-headings:mb-1.5
                      prose-img:rounded-lg prose-img:my-3
                      [&_table]:text-[11px] sm:[&_table]:text-sm [&_table]:w-full [&_table]:border [&_table]:border-border [&_table]:my-3
                      [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-normal [&_table]:max-w-full
                      [&_td]:border [&_td]:border-border [&_td]:p-1.5 sm:[&_td]:p-2 [&_td]:text-foreground [&_td]:break-words [&_td]:align-top
                      [&_th]:border [&_th]:border-border [&_th]:p-1.5 sm:[&_th]:p-2 [&_th]:bg-muted [&_th]:text-foreground [&_th]:font-semibold
                      [&_br]:hidden sm:[&_br]:block
                      [&_img]:max-w-full [&_img]:h-auto"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {product.name.toLowerCase().includes('seminov') ? (
        <section className="py-4">
          <div className="container-custom max-w-md mx-auto">
            <ReviewForm productId={id || ''} productName={product.name} compact />
          </div>
        </section>
      ) : (
        <section className="py-6 sm:py-10 bg-secondary/30">
          <div className="container-custom">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Avaliações deste produto</h2>
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2">
                <ProductReviews productId={id || ''} />
              </div>
              <div>
                <ReviewForm productId={id || ''} productName={product.name} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-6 sm:py-8 bg-secondary">
          <div className="container-custom">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      {/* Reviews Carousel */}
      {reviews && reviews.length > 0 && (
        <ReviewsCarousel reviews={reviews} />
      )}

      {/* Sticky mobile buy bar */}
      {(product.stock ?? 0) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-3 sm:hidden">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {product.original_price && product.original_price > product.price && (
                <p className="text-[10px] text-muted-foreground line-through leading-none mb-0.5">
                  {formatCurrency(product.original_price)}
                </p>
              )}
              <p className="text-base font-bold text-primary leading-tight">
                {formatCurrency(pixPrice)}
                <span className="text-[10px] font-normal text-muted-foreground ml-1">no PIX</span>
              </p>
            </div>
            <Button
              className="h-11 px-6 text-sm font-bold shrink-0"
              onClick={handleBuyNow}
            >
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Comprar
            </Button>
          </div>
        </div>
      )}

      {/* Spacer for sticky bar */}
      <div className="h-[72px] sm:hidden" />
    </Layout>
  );
}
