"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePixSettings, useUpdatePixSettings } from '@/hooks/usePixSettings';
import { toast } from 'sonner';

export default function AdminPix() {
  const { data: settings, isLoading } = usePixSettings();
  const updateSettings = useUpdatePixSettings();
  const [enabled, setEnabled] = useState(false);
  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('');
  const [whatsappThresholdEnabled, setWhatsappThresholdEnabled] = useState(false);
  const [whatsappThresholdValue, setWhatsappThresholdValue] = useState(2500);
  const [checkoutType, setCheckoutType] = useState<'receiver' | 'streetpay'>('receiver');

  useEffect(() => {
    if (settings) {
      setEnabled(settings.enabled);
      setPixKey(settings.pix_key || '');
      setMerchantName(settings.merchant_name || '');
      setMerchantCity(settings.merchant_city || '');
      setWhatsappThresholdEnabled(settings.whatsapp_threshold_enabled || false);
      setWhatsappThresholdValue(settings.whatsapp_threshold_value || 2500);
      setCheckoutType(settings.checkout_type || 'receiver');
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        enabled,
        pix_key: pixKey,
        merchant_name: merchantName,
        merchant_city: merchantCity,
        whatsapp_threshold_enabled: whatsappThresholdEnabled,
        whatsapp_threshold_value: whatsappThresholdValue,
        checkout_type: checkoutType,
      });
      toast.success('Configurações do PIX salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) return <div className="p-4">Carregando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações PIX</h1>

      <div className="max-w-md space-y-6 bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">PIX ativo</Label>
            <p className="text-sm text-muted-foreground">
              Habilitar geração de PIX para pedidos
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div>
          <Label htmlFor="pixKey">Chave PIX (para pedidos abaixo do limite)</Label>
          <Input
            id="pixKey"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="ex: seuemail@exemplo.com ou (44) 99999-9999"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Chave PIX para pedidos abaixo do valor mínimo
          </p>
        </div>

        <div>
          <Label htmlFor="merchantName">Nome do Estabelecimento (Street Pay)</Label>
          <Input
            id="merchantName"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            placeholder="ex: Câmeras Prime"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="merchantCity">Cidade do Estabelecimento (Street Pay)</Label>
          <Input
            id="merchantCity"
            value={merchantCity}
            onChange={(e) => setMerchantCity(e.target.value)}
            placeholder="ex: Maringá"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Forma de pagamento</Label>
          <Select value={checkoutType} onValueChange={(v) => setCheckoutType(v as 'receiver' | 'streetpay')}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o tipo de checkout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receiver">Dados do Recebedor PIX</SelectItem>
              <SelectItem value="streetpay">Checkout Street Pay</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {checkoutType === 'receiver' 
              ? 'Todos os pedidos usarão a chave PIX informada acima.' 
              : 'Pedidos acima do limite usarão o sistema Street Pay.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Switch 
            checked={whatsappThresholdEnabled} 
            onCheckedChange={setWhatsappThresholdEnabled} 
          />
          <div>
            <Label>Usar WhatsApp para pedidos acima de</Label>
            <p className="text-xs text-muted-foreground">Envia link de pedido via WhatsApp</p>
          </div>
        </div>

        <div className="ml-8">
          <Input
            type="number"
            value={whatsappThresholdValue}
            onChange={(e) => setWhatsappThresholdValue(parseInt(e.target.value) || 0)}
            placeholder="Valor mínimo"
            className="w-32"
          />
          <p className="text-xs text-muted-foreground mt-1">R$</p>
        </div>

        <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full">
          {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}