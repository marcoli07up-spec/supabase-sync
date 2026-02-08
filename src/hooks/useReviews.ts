import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      // Only fetch approved reviews with display_date <= now
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .lte('display_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Review[];
    },
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      // Only fetch approved reviews for this product with display_date <= now
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('approved', true)
        .lte('display_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });
}
