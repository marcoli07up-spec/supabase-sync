import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: async () => {
      // First get the category
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (categoryError) throw categoryError;
      if (!category) return [];

      // Then get products for that category
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categorySlug,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!productId,
  });
}

export function useRelatedProducts(productId: string, categoryId: string | null) {
  return useQuery({
    queryKey: ['products', 'related', productId, categoryId],
    queryFn: async () => {
      if (!categoryId) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('category_id', categoryId)
        .neq('id', productId)
        .limit(12);

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categoryId,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data as Product[];
    },
    enabled: query.length >= 2,
  });
}
