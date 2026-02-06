import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export function FloatingButtons() {
  const { getItemCount, setIsOpen } = useCart();
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
    if (itemCount > 0) {
      setIsOpen(true);
    } else {
      toast.info('Seu carrinho está vazio');
    }
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
            "flex items-center gap-2 px-6 relative"
          )}
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold">{itemCount}</span>
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        </Button>
      )}
    </div>
  );
}
