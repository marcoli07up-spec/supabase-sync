import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const categoryImages: Record<string, string> = {
  'cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  'lentes': 'https://images.unsplash.com/photo-1617005082133-5c80d1b93f36?w=600&q=80',
  'acessorios': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
  'tripés': 'https://images.unsplash.com/photo-1548872591-1f6de16f6ba6?w=600&q=80',
  'iluminação': 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600&q=80',
  'bolsas': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
};

const AllCategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Categorias</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Todas as Categorias</h1>
          <p className="text-muted-foreground">
            Explore nossos produtos por categoria
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories?.map((category) => {
              const imageUrl = categoryImages[category.slug.toLowerCase()] ||
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80';

              return (
                <Link
                  key={category.id}
                  to={`/categoria/${category.slug}`}
                  className="group relative aspect-video rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="font-bold text-xl">{category.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Ver produtos →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllCategoriesPage;
