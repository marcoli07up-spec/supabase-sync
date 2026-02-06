import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts, useCategories } from '@/hooks/useProducts';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading } = useProducts(slug);
  const { data: categories } = useCategories();

  const currentCategory = categories?.find((cat) => cat.slug === slug);

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/categorias" className="hover:text-primary">
            Categorias
          </Link>
          {currentCategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{currentCategory.name}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {currentCategory?.name || 'Categoria'}
          </h1>
          <p className="text-muted-foreground">
            {products?.length || 0} produto{products?.length !== 1 ? 's' : ''} encontrado{products?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
