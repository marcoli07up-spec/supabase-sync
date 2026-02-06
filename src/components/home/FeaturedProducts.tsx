import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useFeaturedProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Destaques</h2>
            <p className="text-muted-foreground mt-1">Os produtos mais populares da loja</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/produtos">
              Ver Todos <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}
