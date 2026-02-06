import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGallery } from '@/components/product/ProductGallery';
import { StarRating } from '@/components/product/StarRating';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useAverageRating, useProductReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, calculateDiscount, formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: relatedProducts } = useRelatedProducts(id || '', product?.category_id || null);
  const { data: ratingData } = useAverageRating(id || '');
  const { data: reviews } = useProductReviews(id || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/">Voltar para a loja</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const discount = calculateDiscount(product.original_price || 0, product.price);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link to={`/categoria/${product.category.slug}`} className="hover:text-primary">
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={images} productName={product.name} />

          {/* Info */}
          <div className="space-y-6">
            {/* Category & Name */}
            {product.category && (
              <Link
                to={`/categoria/${product.category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            {ratingData && ratingData.count > 0 && (
              <StarRating
                rating={ratingData.average}
                showValue
                count={ratingData.count}
              />
            )}

            {/* Price */}
            <div className="space-y-1">
              {discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="price-original text-lg">
                    {formatCurrency(product.original_price || 0)}
                  </span>
                  <span className="badge-discount">-{discount}%</span>
                </div>
              )}
              <p className="text-3xl font-bold">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                em até 12x de {formatCurrency(product.price / 12)} sem juros
              </p>
              <p className="text-sm text-success font-medium">
                ou {formatCurrency(product.price * 0.95)} à vista (5% de desconto)
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock !== null && quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>

            {/* Stock */}
            {product.stock !== null && product.stock > 0 && product.stock <= 10 && (
              <p className="text-sm text-destructive">
                Apenas {product.stock} unidades em estoque!
              </p>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Frete Grátis*</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Garantia 1 ano</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">7 dias para troca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">
              Avaliações ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-muted-foreground">
                  Este produto ainda não possui uma descrição detalhada.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                          {review.reviewer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{review.reviewer_name}</p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mt-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Este produto ainda não possui avaliações.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductPage;
