import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatCurrency, formatInstallments, getDiscountPercentage } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = getDiscountPercentage(product.original_price || 0, product.price);
  const pixPrice = product.price * 0.95;

  return (
    <div className="card-product group flex flex-col h-full">
      {/* Image */}
      <Link to={`/produto/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            (product.stock ?? 0) <= 0 ? 'grayscale' : ''
          }`}
        />
        
        {/* Out of stock overlay */}
        {(product.stock ?? 0) <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-lg font-bold px-4 py-2 rounded-lg uppercase tracking-wider shadow-lg">
              Esgotado
            </span>
          </div>
        )}
        
        {/* Discount badge */}
        {discount > 0 && (product.stock ?? 0) > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Reinauguration free shipping badge */}
        {(product.stock ?? 0) > 0 && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded">
            🚚 FRETE GRÁTIS
          </span>
        )}

        {/* Quick actions overlay - only show if in stock */}
        {(product.stock ?? 0) > 0 && (
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Link to={`/produto/${product.id}`}>
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4 mr-1" />
                Ver mais
              </Button>
            </Link>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        {/* Stock status */}
        <div className="mb-2">
          {(product.stock ?? 0) > 0 ? (
            <span className="badge-stock-available">Em estoque</span>
          ) : (
            <span className="badge-stock-unavailable">Indisponível</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/produto/${product.id}`} className="flex-1">
          <h3 className="font-medium text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Prices */}
        <div className="mb-3 space-y-0.5">
          {product.original_price && product.original_price > product.price && (
            <p className="price-original text-[10px] sm:text-xs">{formatCurrency(product.original_price)}</p>
          )}
          
          {/* PIX Price Highlight */}
          <div className="flex items-center gap-1.5">
            <p className="text-primary font-black text-lg sm:text-2xl leading-none">
              {formatCurrency(pixPrice)}
            </p>
            <div className="flex items-center gap-0.5 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
              <Zap className="h-2.5 w-2.5 fill-current" />
              PIX
            </div>
          </div>

          <p className="text-muted-foreground text-[10px] sm:text-xs">
            ou {formatCurrency(product.price)} no cartão
          </p>
          <p className="price-installment text-[9px] sm:text-[11px]">
            em até 12x de {formatCurrency(product.price / 12)}
          </p>
          <p className="text-[10px] sm:text-xs text-success font-bold mt-1">FRETE GRÁTIS</p>
        </div>

        {/* Add to cart */}
        <Button
          onClick={() => addItem(product)}
          disabled={(product.stock ?? 0) <= 0}
          className="w-full text-xs sm:text-sm font-bold"
          size="sm"
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Comprar agora
        </Button>
      </div>
    </div>
  );
}