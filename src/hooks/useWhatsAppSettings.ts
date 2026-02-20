import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface WhatsAppSettings {
  enabled: boolean;
  phone: string;
}

const DEFAULT_SETTINGS: WhatsAppSettings = {
  enabled: false,
  phone: '554431011011',
};

export function useWhatsAppSettings() {
  return useQuery({
    queryKey: ['whatsapp-settings'],
    queryFn: async (): Promise<WhatsAppSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'whatsapp_config')
        .maybeSingle();

      if (error) {
        console.error('Error fetching WhatsApp settings:', error);
        return DEFAULT_SETTINGS;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        return {
          ...DEFAULT_SETTINGS,
          ...(data.value as Partial<WhatsAppSettings>),
        };
      }

      return DEFAULT_SETTINGS;
    },
  });
}

export function useUpdateWhatsAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: WhatsAppSettings) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'whatsapp_config')
        .maybeSingle();

      const jsonValue: Json = settings as unknown as Json;

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: jsonValue })
          .eq('key', 'whatsapp_config');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key: 'whatsapp_config', value: jsonValue }]);
        if (error) throw error;
      }

      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
    },
  });
}
