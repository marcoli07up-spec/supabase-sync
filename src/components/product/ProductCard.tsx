import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/ecommerce';
import { formatCurrency, calculateDiscount } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = calculateDiscount(product.original_price || 0, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/produto/${product.id}`}>
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="badge-discount">-{discount}%</span>
            )}
            {product.featured && (
              <span className="badge-new">Destaque</span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to cart button */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              className="w-full"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">
              {product.category.name}
            </p>
          )}

          {/* Name */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.original_price && product.original_price > product.price && (
              <span className="price-original">
                {formatCurrency(product.original_price)}
              </span>
            )}
            <span className={discount > 0 ? 'price-discount' : 'price-current'}>
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Installments */}
          <p className="text-xs text-muted-foreground mt-1">
            em até 12x de {formatCurrency(product.price / 12)}
          </p>

          {/* Stock indicator */}
          {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-destructive mt-2">
              Últimas {product.stock} unidades!
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
