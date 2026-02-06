import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItemCount, setIsOpen } = useCart();
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = categories?.map(cat => ({
    label: cat.name.toUpperCase(),
    href: `/categoria/${cat.slug}`,
  })) || [];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar with info */}
      <div className="hidden md:block border-b border-border/50">
        <div className="container-custom py-2">
          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-primary">📦</span> Frete Grátis - Entrega em todo Brasil
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">💳</span> Parcelamento em até 3x sem juros
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">💰</span> Pagamento à vista - Ganhe desconto
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">🔒</span> Loja com SSL de proteção
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-primary p-2 rounded-lg">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary">câmera</span>
              <span className="text-xl font-bold text-foreground">&foto</span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="O que está buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 bg-secondary border-border"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 rounded-l-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <Button
              variant="outline"
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Carrinho</span>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-4 mt-6">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* Mobile navigation */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <hr className="border-border" />

                  {/* Footer links */}
                  <nav className="flex flex-col gap-2 text-sm">
                    <Link to="/rastreio" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:text-primary">
                      Rastrear Pedido
                    </Link>
                    <Link to="/sobre" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:text-primary">
                      Sobre Nós
                    </Link>
                    <Link to="/contato" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:text-primary">
                      Contato
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:block border-t border-border/50">
        <div className="container-custom">
          <ul className="flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="px-4 py-3 inline-block font-medium text-sm hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
