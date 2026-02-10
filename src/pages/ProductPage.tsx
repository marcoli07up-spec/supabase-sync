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

  const discount = product ? getDiscountPercentage(product.original_price || 0, product.price) : 0;
  
  // Get all images (main + secondary)
  const allImages = product ? [
    product.image_url,
    ...(product.images || []).filter(img => img !== product.image_url)
  ].filter(Boolean) as string[] : [];
  
  const currentImage = selectedImage || product?.image_url || '/placeholder.svg';
  const pixPrice = product ? product.price * 0.95 : 0;
  const cardPrice = product ? product.price * 1.05 : 0;

  // Track View Content when product loads
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
      // Just add to cart and animate - don't navigate immediately
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
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product details */}
      <section className="py-4 sm:py-8">
        <div className="container-custom px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
            {/* Product images */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main image */}
              <div className="relative">
                <div className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-muted border border-border ${(product.stock ?? 0) <= 0 ? 'grayscale' : ''}`}>
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Out of stock overlay */}
                  {(product.stock ?? 0) <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-xl sm:text-2xl font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg uppercase tracking-wider shadow-lg">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                {(product.stock ?? 0) > 0 && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1">
                        -{discount}% OFF
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs sm:text-sm font-medium px-2 sm:px-3 py-0.5 sm:py-1">
                      Seminovo Revisado
                    </Badge>
                  </div>
                )}

                {/* Stock badge */}
                {(product.stock ?? 0) <= 3 && (product.stock ?? 0) > 0 && (
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="bg-destructive/90 text-destructive-foreground text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      {product.name.toLowerCase().includes('seminov') 
                        ? 'Última unidade disponível!' 
                        : `Apenas ${product.stock} unidade${product.stock !== 1 ? 's' : ''} disponível!`}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {allImages.length > 1 && (
                <div className="relative group/thumbs">
                  {/* Left arrow */}
                  <button
                    onClick={() => {
                      if (thumbContainerRef.current) {
                        thumbContainerRef.current.scrollBy({ left: -160, behavior: 'smooth' });
                      }
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-background/90 border border-border rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-primary-foreground transition-colors -ml-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Thumbnails */}
                  <div
                    ref={thumbContainerRef}
                    className="flex gap-2 overflow-x-auto pb-2 px-8 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImage === img 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => {
                      if (thumbContainerRef.current) {
                        thumbContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
                      }
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-background/90 border border-border rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-primary-foreground transition-colors -mr-1"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col min-w-0">
              {/* Rating - Hide for seminovos (unique items don't have reviews) */}
              {!product.name.toLowerCase().includes('seminov') && productReviews && productReviews.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
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
                    ({productReviews.length} avaliações)
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Stock status */}
              <div className="mb-3 sm:mb-4">
                {(product.stock ?? 0) > 0 ? (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-success/10 text-success px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Em estoque - Pronta entrega
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-destructive/10 text-destructive px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                    Produto indisponível
                  </div>
                )}
              </div>

              {/* Prices */}
              <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                {product.original_price && product.original_price > product.price && (
                  <p className="text-sm sm:text-lg text-muted-foreground line-through">
                    De: {formatCurrency(product.original_price)}
                  </p>
                )}
                
                {/* PIX Price - Main highlight */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                    <span className="font-bold text-primary text-lg sm:text-xl md:text-2xl">
                      {formatCurrency(pixPrice)} no PIX
                    </span>
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-[10px] sm:text-xs">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Economize {formatCurrency(cardPrice - pixPrice)} pagando à vista
                  </p>
                </div>

                {/* Card Price */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong className="text-foreground text-sm sm:text-base">{formatCurrency(cardPrice)}</strong> no cartão
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground ml-6">
                  em até <strong className="text-foreground">12x de {formatCurrency(cardPrice / 12)}</strong> sem juros
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold"
                  onClick={handleBuyNow}
                  disabled={(product.stock ?? 0) <= 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar agora
                </Button>
                
                <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                  * Produto seminovo - unidade única disponível
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary rounded-lg">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Frete Grátis</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Todo Brasil</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">1 Ano Garantia</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Cobertura total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary rounded-lg">
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">90 Dias</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Para troca</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary rounded-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Revisado</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">100% testado</p>
                  </div>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="mb-4 sm:mb-6">
                <ShippingCalculator />
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-4 sm:pt-6 min-w-0">
                  <h3 className="font-semibold mb-3 text-base sm:text-lg">Descrição do Produto</h3>
                  <div 
                    className="text-foreground leading-relaxed prose prose-sm max-w-none min-w-0
                      prose-p:text-foreground prose-p:my-1.5 sm:prose-p:my-2 prose-p:text-xs sm:prose-p:text-sm prose-p:leading-relaxed
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-foreground prose-ul:my-1.5 sm:prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-5
                      prose-ol:text-foreground prose-ol:my-1.5 sm:prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4 sm:prose-ol:pl-5
                      prose-li:text-foreground prose-li:my-0.5 sm:prose-li:my-1 prose-li:text-xs sm:prose-li:text-sm
                      prose-headings:text-foreground prose-headings:font-semibold prose-headings:text-sm sm:prose-headings:text-base prose-headings:mt-3 prose-headings:mb-1.5
                      prose-img:rounded-lg prose-img:my-3
                      [&_table]:text-[10px] [&_table]:sm:text-sm [&_table]:w-full [&_table]:border [&_table]:border-border [&_table]:my-3 sm:[&_table]:my-4
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

      {/* Product Reviews Section */}
      {product.name.toLowerCase().includes('seminov') ? (
        /* Compact review form for seminovos */
        <section className="py-4">
          <div className="container-custom max-w-md mx-auto">
            <ReviewForm productId={id || ''} productName={product.name} compact />
          </div>
        </section>
      ) : (
        /* Full reviews section for regular products */
        <section className="py-10 bg-secondary/30">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6">Avaliações deste produto</h2>
            <div className="grid lg:grid-cols-3 gap-8">
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
        <section className="py-8 bg-secondary">
          <div className="container-custom">
            <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      {/* Social Proof - Customer Reviews Carousel - Always show for all products */}
      {reviews && reviews.length > 0 && (
        <ReviewsCarousel reviews={reviews} />
      )}
    </Layout>
  );
}
