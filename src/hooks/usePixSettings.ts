import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface PixSettings {
  enabled: boolean;
  pix_key: string;
  merchant_name: string;
  merchant_city: string;
  whatsapp_threshold_enabled: boolean;
  whatsapp_threshold_value: number;
  checkout_type: 'receiver' | 'streetpay';
}

const DEFAULT_SETTINGS: PixSettings = {
  enabled: false,
  pix_key: '',
  merchant_name: '',
  merchant_city: '',
  whatsapp_threshold_enabled: true,
  whatsapp_threshold_value: 2500,
  checkout_type: 'receiver',
};

export function usePixSettings() {
  return useQuery({
    queryKey: ['pix-settings'],
    queryFn: async (): Promise<PixSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'pix_config')
        .maybeSingle();

      if (error) {
        console.error('Error fetching PIX settings:', error);
        return DEFAULT_SETTINGS;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        return {
          ...DEFAULT_SETTINGS,
          ...(data.value as Partial<PixSettings>),
        };
      }

      return DEFAULT_SETTINGS;
    },
  });
}

export function useUpdatePixSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: PixSettings) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'pix_config')
        .maybeSingle();

      const jsonValue: Json = settings as unknown as Json;

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: jsonValue })
          .eq('key', 'pix_config');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key: 'pix_config', value: jsonValue }]);
        if (error) throw error;
      }

      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pix-settings'] });
    },
  });
}