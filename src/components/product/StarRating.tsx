import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  count
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 > 0;

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                filled || partial ? 'text-yellow-400' : 'text-muted-foreground/30',
                filled && 'fill-current'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {count !== undefined && ` (${count} ${count === 1 ? 'avaliação' : 'avaliações'})`}
        </span>
      )}
    </div>
  );
}
