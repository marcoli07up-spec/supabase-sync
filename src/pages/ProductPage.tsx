import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Truck, Shield, RefreshCw, Star, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, formatInstallments, getDiscountPercentage } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading } = useProduct(id || '');
  const { data: relatedProducts } = useRelatedProducts(id || '', product?.category_id || null);
  const { data: reviews } = useProductReviews(id || '');
  const { addItem } = useCart();

  const discount = product ? getDiscountPercentage(product.original_price || 0, product.price) : 0;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product info */}
            <div>
              {/* Stock */}
              <div className="mb-2">
                {(product.stock ?? 0) > 0 ? (
                  <span className="badge-stock-available">Em estoque</span>
                ) : (
                  <span className="badge-stock-unavailable">Indisponível</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              {/* Prices */}
              <div className="mb-6">
                {product.original_price && product.original_price > product.price && (
                  <p className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.original_price)}
                  </p>
                )}
                <p className="text-3xl font-bold">{formatCurrency(product.price)}</p>
                <p className="text-muted-foreground">
                  ou {formatInstallments(product.price)}
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  No PIX com 5% de desconto: <strong>{formatCurrency(product.price * 0.95)}</strong>
                </p>
                <p className="text-sm text-success font-medium mt-1">FRETE GRÁTIS</p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Quantity and Add to cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={(product.stock ?? 0) <= 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao carrinho
                </Button>
              </div>

              {/* Benefits */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Frete Grátis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>1 Ano de Garantia</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span>90 dias para troca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="py-8 bg-secondary">
          <div className="container-custom">
            <h2 className="text-xl font-bold mb-6">Avaliações</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-primary fill-primary' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">"{review.comment}"</p>
                  <p className="font-semibold text-sm">{review.reviewer_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-8">
          <div className="container-custom">
            <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </Layout>
  );
}
