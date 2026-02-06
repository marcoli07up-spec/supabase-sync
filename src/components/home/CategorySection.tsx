import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const categoryImages: Record<string, string> = {
  'cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  'lentes': 'https://images.unsplash.com/photo-1617005082133-5c80d1b93f36?w=400&q=80',
  'acessorios': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
  'tripés': 'https://images.unsplash.com/photo-1548872591-1f6de16f6ba6?w=400&q=80',
  'iluminação': 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=400&q=80',
  'bolsas': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
};

export function CategorySection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Categorias</h2>
          <Button variant="ghost" asChild>
            <Link to="/categorias">
              Ver Todas <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((category) => {
            const imageUrl = categoryImages[category.slug.toLowerCase()] || 
              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80';

            return (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-center">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
