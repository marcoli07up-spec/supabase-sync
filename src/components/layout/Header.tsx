import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCategories } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: categories
  } = useCategories();
  const {
    getItemCount,
    setIsCartOpen
  } = useCart();
  const itemCount = getItemCount();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm)}`;
    }
  };
  return <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top bar */}
      

      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-semibold hover:text-primary">
                  Início
                </Link>
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Categorias</p>
                  {categories?.map(category => <Link key={category.id} to={`/categoria/${category.slug}`} className="block py-2 hover:text-primary">
                      {category.name}
                    </Link>)}
                </div>
                <div className="border-t pt-4">
                  <Link to="/rastreio" className="block py-2 hover:text-primary">
                    Rastrear Pedido
                  </Link>
                  <Link to="/sobre" className="block py-2 hover:text-primary">
                    Sobre Nós
                  </Link>
                  <Link to="/contato" className="block py-2 hover:text-primary">
                    Contato
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground font-bold text-xl sm:text-2xl px-3 py-1 rounded">
              CF
            </div>
            <span className="hidden sm:block text-lg font-semibold">Câmera & Foto</span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input type="search" placeholder="Buscar produtos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10" />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <Input type="search" placeholder="Buscar produtos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10" />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>}
      </div>

      {/* Categories bar - Desktop */}
      <nav className="hidden lg:block border-t bg-muted/30">
        <div className="container-custom">
          <ul className="flex items-center gap-8 py-3">
            <li>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  Categorias <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories?.map(category => <DropdownMenuItem key={category.id} asChild>
                      <Link to={`/categoria/${category.slug}`}>{category.name}</Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {categories?.slice(0, 5).map(category => <li key={category.id}>
                <Link to={`/categoria/${category.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                  {category.name}
                </Link>
              </li>)}
            <li>
              <Link to="/rastreio" className="text-sm font-medium hover:text-primary transition-colors">
                Rastrear Pedido
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>;
}