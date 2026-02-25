import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface PixSettings {
  pix_key: string;
  merchant_name: string;
  merchant_city: string;
  whatsapp_threshold_enabled: boolean;
  whatsapp_threshold_value: number;
}

const DEFAULT_PIX_SETTINGS: PixSettings = {
  pix_key: '',
  merchant_name: 'iCamStore',
  merchant_city: 'SAO PAULO',
  whatsapp_threshold_enabled: true,
  whatsapp_threshold_value: 2500,
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
        return DEFAULT_PIX_SETTINGS;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        return {
          ...DEFAULT_PIX_SETTINGS,
          ...(data.value as Partial<PixSettings>),
        };
      }

      return DEFAULT_PIX_SETTINGS;
    },
  });
}

export function useUpdatePixSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: PixSettings) => {
      const jsonValue: Json = settings as unknown as Json;

      // Usando upsert para inserir ou atualizar baseado na coluna 'key'
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { 
            key: 'pix_config', 
            value: jsonValue,
            updated_at: new Date().toISOString()
          }, 
          { onConflict: 'key' }
        );
      
      if (error) throw error;
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pix-settings'] });
    },
  });
}

export const calculateCRC16 = (str: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

export function generatePixEMV(params: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txId?: string;
}): string {
  const { pixKey, merchantName, merchantCity, amount, txId } = params;
  if (!pixKey.trim()) return '';
  let payload = '000201';
  const gui = '0014br.gov.bcb.pix';
  const key = `01${String(pixKey.length).padStart(2, '0')}${pixKey}`;
  const merchantAccount = gui + key;
  payload += `26${String(merchantAccount.length).padStart(2, '0')}${merchantAccount}`;
  payload += '52040000';
  payload += '5303986';
  if (amount && amount > 0) {
    const amountStr = amount.toFixed(2);
    payload += `54${String(amountStr.length).padStart(2, '0')}${amountStr}`;
  }
  payload += '5802BR';
  const name = merchantName.substring(0, 25).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  payload += `59${String(name.length).padStart(2, '0')}${name}`;
  const city = merchantCity.substring(0, 15).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  payload += `60${String(city.length).padStart(2, '0')}${city}`;
  if (txId?.trim()) {
    const cleanTxId = txId.substring(0, 25).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const additionalData = `05${String(cleanTxId.length).padStart(2, '0')}${cleanTxId}`;
    payload += `62${String(additionalData.length).padStart(2, '0')}${additionalData}`;
  } else {
    payload += '6207' + '0503***';
  }
  payload += '6304';
  const crc = calculateCRC16(payload);
  payload += crc;
  return payload;
}