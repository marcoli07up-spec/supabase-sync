import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';

export function CartUpsell() {
  const { data: products, isLoading } = useProducts();
  const { items, addItem } = useCart();

  // Get products not in cart for upsell
  const cartProductIds = items.map(item => item.product.id);
  const upsellProducts = products
    ?.filter(p => !cartProductIds.includes(p.id) && p.featured)
    .slice(0, 3) || [];

  if (isLoading || upsellProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <h4 className="font-semibold mb-3 text-sm">Você também pode gostar</h4>
      <div className="space-y-3">
        {upsellProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs line-clamp-1">{product.name}</p>
              <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 shrink-0"
              onClick={() => addItem(product)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
