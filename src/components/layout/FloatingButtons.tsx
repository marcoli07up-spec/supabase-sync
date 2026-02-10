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

  const openInstagramDM = () => {
    window.open('https://ig.me/m/cameras.icam', '_blank');
  };

  const handleCartClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-between items-end pointer-events-none">
      {/* Instagram DM Button - Left */}
      <Button
        onClick={openInstagramDM}
        size="lg"
        className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-to-br from-[hsl(330,70%,50%)] via-[hsl(350,80%,55%)] to-[hsl(30,90%,55%)] hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
        aria-label="Enviar mensagem no Instagram"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      </Button>

      {/* Cart Button - Right */}
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
