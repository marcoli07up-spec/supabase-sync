import { ShoppingCart } from 'lucide-react';
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
    window.open('https://wa.me/5511972238165?text=Olá! Gostaria de mais informações.', '_blank');
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
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.672.15-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.207-.242-.579-.487-.5-.672-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2C6.479 2 2 6.477 2 12c0 2.119.663 4.085 1.795 5.727L2 22l4.389-1.757A9.956 9.956 0 0 0 12.004 22C17.523 22 22 17.522 22 12c0-5.523-4.477-10-9.996-10z"/>
          </svg>
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
