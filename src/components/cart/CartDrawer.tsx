import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from './CartItem';
import { CartUpsell } from './CartUpsell';
import { formatCurrency } from '@/lib/format';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, getTotal, getTotalWithDiscount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const pixDiscount = 5;
  const totalWithPixDiscount = getTotalWithDiscount(pixDiscount);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'itens'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div>
              <p className="font-medium mb-1">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground">
                Adicione produtos para continuar
              </p>
            </div>
            <Button onClick={() => setIsOpen(false)}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Totals and checkout */}
            <div className="border-t border-border pt-4 space-y-4">
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-success font-bold">Grátis</span>
                </div>
                
                {/* PIX Highlighted Discount */}
                <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary fill-current" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Total no PIX</span>
                    </div>
                    <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">5% OFF</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-black text-primary leading-none">
                      {formatCurrency(totalWithPixDiscount)}
                    </p>
                    <p className="text-[10px] text-success font-bold uppercase">Economize {formatCurrency(getTotal() * 0.05)}</p>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-1">
                  <span className="text-muted-foreground text-sm">Total</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Button onClick={handleCheckout} className="w-full h-14 text-base font-bold" size="lg">
                Finalizar Compra
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Continuar comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}