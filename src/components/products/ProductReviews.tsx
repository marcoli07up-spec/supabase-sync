import { useState } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductReviews } from '@/hooks/useReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProductReviewsProps {
  productId: string;
}

const REVIEWS_PER_PAGE = 3;

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-muted/50 rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          Este produto ainda não possui avaliações aprovadas.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Seja o primeiro a avaliar!
        </p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-secondary/50 rounded-xl p-6 flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(averageRating)
                    ? 'text-primary fill-primary'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">{reviews.length} avaliação(ões)</p>
          <p className="text-sm text-muted-foreground">de compradores verificados</p>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{review.reviewer_name}</p>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="h-3 w-3" />
                    <span>Compra verificada</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'text-primary fill-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(review.display_date || review.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground">{review.comment}</p>
            
            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {review.images.map((image, index) => (
                  <a
                    key={index}
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
