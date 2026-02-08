import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCategories } from '@/hooks/useCategories';
import { useSearchProducts } from '@/hooks/useProducts';
import logoImg from '@/assets/logo.png';
import { formatCurrency } from '@/lib/format';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: categories } = useCategories();
  const { data: suggestions } = useSearchProducts(searchTerm);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/busca?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/produto/${productId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
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
                  {categories?.map(category => (
                    <Link key={category.id} to={`/categoria/${category.slug}`} className="block py-2 hover:text-primary">
                      {category.name}
                    </Link>
                  ))}
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
          <Link to="/" className="flex items-center">
            <img 
              src={logoImg} 
              alt="iCamStore" 
              className="h-8 sm:h-12"
            />
          </Link>

          {/* Search - Desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Buscar câmeras, lentes, acessórios..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pr-10"
                />
                {searchTerm && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-8 top-0"
                    onClick={() => {
                      setSearchTerm('');
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchTerm.length >= 2 && suggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {suggestions.slice(0, 6).map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                  >
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-sm text-primary font-bold">{formatCurrency(product.price)}</p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    navigate(`/busca?q=${encodeURIComponent(searchTerm)}`);
                  }}
                  className="w-full p-3 text-center text-sm text-primary hover:bg-muted transition-colors border-t"
                >
                  Ver todos os resultados
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
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
                  {categories?.map(category => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link to={`/categoria/${category.slug}`}>{category.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {categories?.slice(0, 5).map(category => (
              <li key={category.id}>
                <Link to={`/categoria/${category.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/rastreio" className="text-sm font-medium hover:text-primary transition-colors">
                Rastrear Pedido
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
