import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useSearchProducts } from '@/hooks/useProducts';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: products, isLoading } = useSearchProducts(query);

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Busca</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Resultados para "{query}"</h1>
          </div>
          <p className="text-muted-foreground">
            {products?.length || 0} produto{products?.length !== 1 ? 's' : ''} encontrado{products?.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProductGrid 
          products={products} 
          isLoading={isLoading}
          emptyMessage={`Nenhum produto encontrado para "${query}". Tente outros termos.`}
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
