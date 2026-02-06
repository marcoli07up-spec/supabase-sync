import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/ecommerce';

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    },
  });
}

export function useAverageRating(productId: string) {
  return useQuery({
    queryKey: ['average-rating', productId],
    queryFn: async (): Promise<{ average: number; count: number }> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        average: sum / data.length,
        count: data.length,
      };
    },
    enabled: !!productId,
  });
}
