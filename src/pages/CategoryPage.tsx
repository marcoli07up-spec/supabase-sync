import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useCategory } from '@/hooks/useCategories';
import { useProductsByCategory } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(slug || '');
  const { data: products, isLoading: productsLoading } = useProductsByCategory(slug || '');

  if (categoryLoading) {
    return (
      <Layout>
        <div className="bg-secondary py-3">
          <div className="container-custom">
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="container-custom py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <ProductGrid products={[]} isLoading={true} />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Products */}
      <section className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <span className="text-sm text-muted-foreground">
              {products?.length || 0} produtos
            </span>
          </div>
          <ProductGrid
            products={products || []}
            isLoading={productsLoading}
            emptyMessage={`Nenhum produto encontrado em ${category.name}`}
          />
        </div>
      </section>
    </Layout>
  );
}
