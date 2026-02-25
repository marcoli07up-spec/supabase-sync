import { useState, useEffect } from 'react';
import { Copy, QrCode, Check, Settings, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePixSettings, useUpdatePixSettings } from '@/hooks/usePixSettings';

export default function AdminPix() {
  const { data: pixSettings, isLoading } = usePixSettings();
  const updateSettings = useUpdatePixSettings();

  const [formData, setFormData] = useState({
    pix_key: '',
    merchant_name: '',
    merchant_city: '',
    whatsapp_threshold_enabled: true,
    whatsapp_threshold_value: 2500,
  });

  useEffect(() => {
    if (pixSettings) {
      setFormData({
        pix_key: pixSettings.pix_key || '',
        merchant_name: pixSettings.merchant_name || '',
        merchant_city: pixSettings.merchant_city || '',
        whatsapp_threshold_enabled: pixSettings.whatsapp_threshold_enabled ?? true,
        whatsapp_threshold_value: pixSettings.whatsapp_threshold_value || 2500,
      });
    }
  }, [pixSettings]);

  const handleSave = async () => {
    if (!formData.pix_key.trim()) {
      toast.error('A chave PIX é obrigatória');
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
          Gerencie sua chave PIX e regras de checkout
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Dados do Recebedor PIX
            </CardTitle>
            <CardDescription>
              Estes dados serão usados para gerar o QR Code e o código "Copia e Cola" no checkout.
            </CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="merchant_city">Cidade</Label>
                <Input
                  id="merchant_city"
                  value={formData.merchant_city}
                  onChange={(e) => setFormData({ ...formData, merchant_city: e.target.value.toUpperCase() })}
                  placeholder="Ex: MARINGA"
                  maxLength={15}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Regra de Valor (WhatsApp)
            </CardTitle>
            <CardDescription>
              Configure se pedidos acima de um certo valor devem ser finalizados via WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label className="text-base">Habilitar limite de valor</Label>
                <p className="text-sm text-muted-foreground">
                  Se ativo, pedidos acima do valor definido serão direcionados ao WhatsApp.
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
                  onChange={(e) => setFormData({ ...formData, whatsapp_threshold_value: parseFloat(e.target.value) || 0 })}
                  placeholder="2500"
                />
                <p className="text-xs text-muted-foreground">
                  Pedidos ≥ este valor não gerarão PIX automático.
                </p>
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