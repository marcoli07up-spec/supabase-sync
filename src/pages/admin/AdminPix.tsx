import { useState, useEffect } from 'react';
import { QrCode, Save, AlertTriangle, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { usePixSettings, useUpdatePixSettings } from '@/hooks/usePixSettings';

export default function AdminPix() {
  const { data: pixSettings, isLoading } = usePixSettings();
  const updateSettings = useUpdatePixSettings();

  const [formData, setFormData] = useState({
    pix_mode: 'manual' as 'manual' | 'street_pay',
    pix_key: '',
    merchant_name: '',
    merchant_city: '',
    street_pay_api_key: '',
    whatsapp_threshold_enabled: true,
    whatsapp_threshold_value: 2500,
  });

  useEffect(() => {
    if (pixSettings) {
      setFormData({
        pix_mode: pixSettings.pix_mode || 'manual',
        pix_key: pixSettings.pix_key || '',
        merchant_name: pixSettings.merchant_name || '',
        merchant_city: pixSettings.merchant_city || '',
        street_pay_api_key: pixSettings.street_pay_api_key || '',
        whatsapp_threshold_enabled: pixSettings.whatsapp_threshold_enabled ?? true,
        whatsapp_threshold_value: pixSettings.whatsapp_threshold_value ?? 2500,
      });
    }
  }, [pixSettings]);

  const handleSave = async () => {
    if (formData.pix_mode === 'manual' && !formData.pix_key.trim()) {
      toast.error('A chave PIX é obrigatória no modo manual');
      return;
    }
    if (formData.pix_mode === 'street_pay' && !formData.street_pay_api_key.trim()) {
      toast.error('A API Key da Street Pay é obrigatória');
      return;
    }

    try {
      await updateSettings.mutateAsync(formData);
      toast.success('Configurações de pagamento salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações de Pagamento</h1>
        <p className="text-muted-foreground">
          Gerencie como seus clientes pagam via PIX
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Modo de Operação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Modo de Operação PIX
            </CardTitle>
            <CardDescription>
              Escolha entre usar uma chave estática (manual) ou o checkout automático da Street Pay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.pix_mode} 
              onValueChange={(v) => setFormData({ ...formData, pix_mode: v as 'manual' | 'street_pay' })}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.pix_mode === 'manual' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual" />
                  <div>
                    <p className="font-bold">PIX Manual (Copia e Cola)</p>
                    <p className="text-xs text-muted-foreground">Usa sua chave PIX direta</p>
                  </div>
                </div>
              </label>
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.pix_mode === 'street_pay' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="street_pay" />
                  <div>
                    <p className="font-bold">Street Pay (Automático)</p>
                    <p className="text-xs text-muted-foreground">Checkout com baixa automática</p>
                  </div>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Configurações Manuais */}
        {formData.pix_mode === 'manual' && (
          <Card className="animate-in fade-in slide-in-from-top-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-5 w-5 text-primary" />
                Dados do Recebedor PIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pix_key">Chave PIX *</Label>
                  <Input
                    id="pix_key"
                    value={formData.pix_key}
                    onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
                    placeholder="CPF, CNPJ, E-mail ou Chave Aleatória"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchant_name">Nome do Beneficiário</Label>
                  <Input
                    id="merchant_name"
                    value={formData.merchant_name}
                    onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value.toUpperCase() })}
                    placeholder="Ex: CAMERAS PRIME"
                    maxLength={25}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configurações Street Pay */}
        {formData.pix_mode === 'street_pay' && (
          <Card className="animate-in fade-in slide-in-from-top-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <img src="https://app.streetpayments.com.br/assets/images/logo-icon.png" className="h-5 w-5" alt="" />
                Configuração Street Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street_pay_api_key">API Key (Token)</Label>
                <Input
                  id="street_pay_api_key"
                  type="password"
                  value={formData.street_pay_api_key}
                  onChange={(e) => setFormData({ ...formData, street_pay_api_key: e.target.value })}
                  placeholder="Insira seu token da Street Pay"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Você encontra este token no painel da Street Pay em Configurações > API.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regra de Valor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Regra de Valor (WhatsApp)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label className="text-base">Habilitar limite de valor</Label>
                <p className="text-sm text-muted-foreground">
                  Pedidos acima deste valor serão direcionados ao WhatsApp.
                </p>
              </div>
              <Switch
                checked={formData.whatsapp_threshold_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, whatsapp_threshold_enabled: checked })}
              />
            </div>

            {formData.whatsapp_threshold_enabled && (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="threshold_value">Valor Limite (R$)</Label>
                <Input
                  id="threshold_value"
                  type="number"
                  value={formData.whatsapp_threshold_value}
                  onChange={(e) => setFormData({ ...formData, whatsapp_threshold_value: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" disabled={updateSettings.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
}