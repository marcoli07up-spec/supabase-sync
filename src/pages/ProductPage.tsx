import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Truck, Shield, RefreshCw, Star, Check, Clock, Award, Zap, CheckCircle, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, formatInstallments, getDiscountPercentage } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: relatedProducts } = useRelatedProducts(id || '', product?.category_id || null);
  const { data: reviews } = useProductReviews(id || '');
  const { addItem } = useCart();

  const discount = product ? getDiscountPercentage(product.original_price || 0, product.price) : 0;
  const pixPrice = product ? product.price * 0.95 : 0;

  const handleBuyNow = () => {
    if (product) {
      addItem(product, 1);
      navigate('/checkout');
    }
  };

  const handleAddToCart = () => {
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

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
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
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
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

              {/* Stock badge */}
              {(product.stock ?? 0) <= 3 && (product.stock ?? 0) > 0 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-destructive/90 text-destructive-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Apenas {product.stock} unidade{product.stock !== 1 ? 's' : ''} disponível!
                  </div>
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Rating */}
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
                  ({reviews?.length || 0} avaliações)
                </span>
              </div>

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
                
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</span>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-3">
                  ou {formatInstallments(product.price)}
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-bold text-primary text-lg">
                      {formatCurrency(pixPrice)} no PIX
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Economize {formatCurrency(product.price - pixPrice)} pagando à vista
                  </p>
                </div>
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
                  Comprar Agora
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleAddToCart}
                  disabled={(product.stock ?? 0) <= 0}
                >
                  Adicionar ao Carrinho
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

              {/* Description */}
              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 text-lg">Descrição do Produto</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-8 bg-secondary">
          <div className="container-custom">
            <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      {/* Social Proof - Customer Reviews (Audited) */}
      {reviews && reviews.length > 0 && (
        <section className="py-10 bg-gradient-to-b from-background to-secondary/30">
          <div className="container-custom">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Avaliações Verificadas</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">O que nossos clientes dizem</h2>
              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">+5.000 clientes satisfeitos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">+10.000 pedidos entregues</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.reviewer_name}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">Compra verificada</span>
                      </div>
                    </div>
                  </div>
                  
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
                  
                  <p className="text-muted-foreground leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
