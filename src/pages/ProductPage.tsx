import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Truck, Shield, RefreshCw, Star, Check, Clock, Award, Zap, CreditCard } from 'lucide-react';
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
      <section className="py-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative">
                <div className={`aspect-square rounded-2xl overflow-hidden bg-muted border border-border ${(product.stock ?? 0) <= 0 ? 'grayscale' : ''}`}>
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Out of stock overlay */}
                  {(product.stock ?? 0) <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-2xl font-bold px-6 py-3 rounded-lg uppercase tracking-wider shadow-lg">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                {(product.stock ?? 0) > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-sm font-bold px-3 py-1">
                        -{discount}% OFF
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1">
                      Seminovo Revisado
                    </Badge>
                  </div>
                )}

                {/* Stock badge - Show "Última unidade disponível!" for seminovos */}
                {(product.stock ?? 0) <= 3 && (product.stock ?? 0) > 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-destructive/90 text-destructive-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {product.name.toLowerCase().includes('seminov') 
                        ? 'Última unidade disponível!' 
                        : `Apenas ${product.stock} unidade${product.stock !== 1 ? 's' : ''} disponível!`}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Rating - Hide for seminovos (unique items don't have reviews) */}
              {!product.name.toLowerCase().includes('seminov') && productReviews && productReviews.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(averageRating) ? 'text-primary fill-primary' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({productReviews.length} avaliações)
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Stock status */}
              <div className="mb-4">
                {(product.stock ?? 0) > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Em estoque - Pronta entrega
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-sm font-medium">
                    Produto indisponível
                  </div>
                )}
              </div>

              {/* Prices */}
              <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                {product.original_price && product.original_price > product.price && (
                  <p className="text-lg text-muted-foreground line-through">
                    De: {formatCurrency(product.original_price)}
                  </p>
                )}
                
                {/* PIX Price - Main highlight */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-bold text-primary text-2xl">
                      {formatCurrency(pixPrice)} no PIX
                    </span>
                    {discount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Economize {formatCurrency(cardPrice - pixPrice)} pagando à vista
                  </p>
                </div>

                {/* Card Price */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">
                    <strong className="text-foreground text-base">{formatCurrency(cardPrice)}</strong> no cartão
                  </span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  em até <strong className="text-foreground">12x de {formatCurrency(cardPrice / 12)}</strong> sem juros
                </p>
              </div>

              {/* CTA Buttons - Single unit only for seminovos */}
              <div className="space-y-3 mb-6">
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

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Frete Grátis</p>
                    <p className="text-xs text-muted-foreground">Todo Brasil</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">1 Ano Garantia</p>
                    <p className="text-xs text-muted-foreground">Cobertura total</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <RefreshCw className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">90 Dias</p>
                    <p className="text-xs text-muted-foreground">Para troca</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Revisado</p>
                    <p className="text-xs text-muted-foreground">100% testado</p>
                  </div>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="mb-6">
                <ShippingCalculator />
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 text-lg">Descrição do Produto</h3>
                  <div 
                    className="text-foreground leading-relaxed prose prose-sm max-w-none 
                      prose-p:text-foreground prose-p:my-2 
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-foreground prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5
                      prose-ol:text-foreground prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5
                      prose-li:text-foreground prose-li:my-1
                      prose-table:border prose-table:border-border prose-table:my-4 prose-table:w-full
                      prose-td:border prose-td:border-border prose-td:p-2 prose-td:text-foreground
                      prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold
                      prose-headings:text-foreground prose-headings:font-semibold"
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
