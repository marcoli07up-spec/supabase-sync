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

  // Hide cart button on checkout page
  const isCheckoutPage = location.pathname === '/checkout';

  const openWhatsApp = () => {
    const phone = '5511999999999'; // Replace with actual store phone
    const message = encodeURIComponent(
      'Olá! Gostaria de mais informações sobre os produtos da iCamStore.'
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCartClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-between items-end pointer-events-none">
      {/* WhatsApp Button - Left */}
      <Button
        onClick={openWhatsApp}
        size="lg"
        className="pointer-events-auto h-14 w-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] shadow-lg hover:shadow-xl transition-all"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Cart Button - Right (only show when has items and not on checkout) */}
      {!isCheckoutPage && itemCount > 0 && (
        <Button
          onClick={handleCartClick}
          size="lg"
          className={cn(
            "pointer-events-auto h-14 rounded-full shadow-lg hover:shadow-xl transition-all",
            "flex items-center gap-2 px-5",
            isAnimating && "animate-bounce scale-110"
          )}
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className={cn("h-5 w-5", isAnimating && "animate-pulse")} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs font-medium opacity-90">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
            <span className="font-bold text-sm">{formatCurrency(getTotal())}</span>
          </div>
        </Button>
      )}
    </div>
  );
}
