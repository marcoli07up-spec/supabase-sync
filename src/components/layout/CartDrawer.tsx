import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, calculateDiscount } from '@/lib/format';
import { useFeaturedProducts } from '@/hooks/useProducts';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotal } = useCart();
  const { data: featuredProducts } = useFeaturedProducts();
  const total = getTotal();

  // Get upsell products (products not in cart)
  const cartProductIds = items.map((item) => item.product.id);
  const upsellProducts = featuredProducts
    ?.filter((product) => !cartProductIds.includes(product.id))
    .slice(0, 2);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <Button onClick={() => setIsCartOpen(false)} asChild>
              <Link to="/">Continuar Comprando</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const discount = calculateDiscount(
                    item.product.original_price || 0,
                    item.product.price
                  );

                  return (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.product.image_url || '/placeholder.svg'}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                        {discount > 0 && (
                          <span className="absolute top-1 left-1 badge-discount text-[10px]">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <span className="price-original text-xs">
                              {formatCurrency(item.product.original_price)}
                            </span>
                          )}
                          <span className="font-semibold text-sm">
                            {formatCurrency(item.product.price)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upsell Section */}
              {upsellProducts && upsellProducts.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="pb-4">
                    <h4 className="font-semibold mb-3 text-sm">
                      ✨ Aproveite e adicione também:
                    </h4>
                    <div className="space-y-3">
                      {upsellProducts.map((product) => {
                        const discount = calculateDiscount(
                          product.original_price || 0,
                          product.price
                        );

                        return (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <img
                              src={product.image_url || '/placeholder.svg'}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                              <div className="flex items-center gap-2">
                                {discount > 0 && (
                                  <span className="text-xs text-destructive font-bold">
                                    -{discount}%
                                  </span>
                                )}
                                <span className="text-sm font-semibold">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              asChild
                            >
                              <Link to={`/produto/${product.id}`} onClick={() => setIsCartOpen(false)}>
                                Ver
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </ScrollArea>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Frete calculado no checkout
              </p>
              <div className="grid gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
