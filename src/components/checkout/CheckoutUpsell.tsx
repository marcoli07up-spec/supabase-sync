import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/format';
import { Product } from '@/types';

interface CheckoutUpsellProps {
  cartProductIds: string[];
  onAddProduct: (product: Product) => void;
}

export function CheckoutUpsell({ cartProductIds, onAddProduct }: CheckoutUpsellProps) {
  const { data: products, isLoading } = useProducts();

  // Get one featured product not in cart for upsell
  const upsellProduct = products
    ?.filter(p => !cartProductIds.includes(p.id) && p.featured && (p.stock ?? 0) > 0)
    ?.[0];

  if (isLoading || !upsellProduct) {
    return null;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
      <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">OFERTA</span>
        Aproveite e leve também
      </h4>
      <div className="flex items-center gap-4">
        <img
          src={upsellProduct.image_url || '/placeholder.svg'}
          alt={upsellProduct.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-2 mb-1">{upsellProduct.name}</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(upsellProduct.price)}</p>
          <p className="text-xs text-muted-foreground">Frete grátis</p>
        </div>
        <Button
          size="sm"
          variant="default"
          className="shrink-0"
          onClick={() => onAddProduct(upsellProduct)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
