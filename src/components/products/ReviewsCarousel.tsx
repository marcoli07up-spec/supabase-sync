import { Star, CheckCircle, Users, Package } from 'lucide-react';
import { Review } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  // Take only first 8 reviews for carousel
  const displayReviews = reviews.slice(0, 8);

  if (displayReviews.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-b from-background to-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Avaliações Verificadas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">O que nossos clientes dizem</h2>
          <div className="flex items-center justify-center gap-4 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">+5.000 clientes satisfeitos</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span className="text-sm">+10.000 pedidos entregues</span>
            </div>
          </div>
        </div>

        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {displayReviews.map((review) => (
                <CarouselItem key={review.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-lg">
                          {review.reviewer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{review.reviewer_name}</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-success shrink-0" />
                          <span className="text-xs text-success">Compra verificada</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-primary fill-primary' : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm flex-1 line-clamp-4">
                      "{review.comment}"
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
