import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const AllProductsPage = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Todos os Produtos</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Todos os Produtos</h1>
          <p className="text-muted-foreground">
            {products?.length || 0} produto{products?.length !== 1 ? 's' : ''} encontrado{products?.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default AllProductsPage;
