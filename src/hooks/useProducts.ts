import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types/ecommerce';

export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!productId,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useRelatedProducts(productId: string, categoryId: string | null) {
  return useQuery({
    queryKey: ['related-products', productId, categoryId],
    queryFn: async (): Promise<Product[]> => {
      if (!categoryId) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .eq('category_id', categoryId)
        .neq('id', productId)
        .limit(4);

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categoryId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: ['search-products', searchTerm],
    queryFn: async (): Promise<Product[]> => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      return data as Product[];
    },
    enabled: searchTerm.length >= 2,
  });
}
