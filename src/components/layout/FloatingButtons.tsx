import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '@/lib/format';

export function FloatingButtons() {
  const { getItemCount, setIsOpen, isAnimating, getTotal } = useCart();
  const itemCount = getItemCount();
  const location = useLocation();

  const isCheckoutPage = location.pathname === '/checkout';
  const isOrderPage = location.pathname === '/pedido';
  const isProductPage = location.pathname.startsWith('/produto');
  const hideFloatingButtons = isCheckoutPage || isOrderPage;

  const openWhatsApp = () => {
    window.open('https://wa.me/5544999999999?text=Olá! Gostaria de mais informações.', '_blank');
  };

  const handleCartClick = () => {
    setIsOpen(true);
  };

  return (
    <div className={cn("fixed left-4 right-4 z-50 flex justify-between items-end pointer-events-none", isProductPage ? "bottom-[76px]" : "bottom-4")}>
      {/* WhatsApp Button - Left */}
      {!hideFloatingButtons && (
        <Button
          onClick={openWhatsApp}
          size="lg"
          className="pointer-events-auto h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1da851] shadow-lg hover:shadow-xl transition-all p-0 flex items-center justify-center"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <MessageCircle className="h-7 w-7 text-white fill-white" />
        </Button>
      )}

      {/* Cart Button - Right */}
      {!hideFloatingButtons && itemCount > 0 && (
        <Button
          onClick={handleCartClick}
          size="lg"
          className={cn(
            "pointer-events-auto h-16 rounded-full shadow-lg hover:shadow-xl transition-all",
            "flex items-center gap-2 px-6",
            isAnimating && "animate-bounce scale-110"
          )}
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className={cn("h-6 w-6", isAnimating && "animate-pulse")} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs font-medium opacity-90">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
            <span className="font-bold text-sm">{formatCurrency(getTotal())}</span>
          </div>
        </Button>
      )}
    </div>
  );
}
