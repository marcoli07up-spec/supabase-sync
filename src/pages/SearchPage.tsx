import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useSearchProducts } from '@/hooks/useProducts';
import { trackSearch } from '@/lib/facebook-pixel';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: products, isLoading } = useSearchProducts(query);

  // Track Search event
  useEffect(() => {
    if (query && query.length >= 2) {
      trackSearch({
        search_string: query,
        content_ids: products?.map(p => p.id),
        content_type: 'product',
      });
    }
  }, [query, products]);

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Resultados para "{query}"
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Buscando...' : `${products?.length || 0} produtos encontrados`}
          </p>
        </div>

        {query.length < 2 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Digite pelo menos 2 caracteres para buscar
            </p>
          </div>
        ) : (
          <ProductGrid
            products={products || []}
            isLoading={isLoading}
            emptyMessage="Nenhum produto encontrado para sua busca"
          />
        )}

        {!isLoading && products?.length === 0 && query.length >= 2 && (
          <div className="text-center mt-8">
            <Link to="/" className="text-primary hover:underline">
              Ver todos os produtos
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
