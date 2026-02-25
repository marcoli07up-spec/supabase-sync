import { useState, useEffect } from 'react';
import { Save, ShieldCheck, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
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

  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('');
  const [whatsappThresholdEnabled, setWhatsappThresholdEnabled] = useState(true);
  const [whatsappThresholdValue, setWhatsappThresholdValue] = useState(2500);

  useEffect(() => {
    if (pixSettings) {
      setPixKey(pixSettings.pix_key || '');
      setMerchantName(pixSettings.merchant_name || '');
      setMerchantCity(pixSettings.merchant_city || '');
      setWhatsappThresholdEnabled(pixSettings.whatsapp_threshold_enabled ?? true);
      setWhatsappThresholdValue(pixSettings.whatsapp_threshold_value ?? 2500);
    }
  }, [pixSettings]);

  const handleSave = async () => {
    if (!pixKey.trim()) {
      toast.error('A chave PIX é obrigatória');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        pix_key: pixKey.trim(),
        merchant_name: merchantName.trim() || 'iCamStore',
        merchant_city: merchantCity.trim() || 'SAO PAULO',
        whatsapp_threshold_enabled: whatsappThresholdEnabled,
        whatsapp_threshold_value: whatsappThresholdValue,
      });
      toast.success('Configurações de pagamento salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(`Erro ao salvar: ${error.message || 'Verifique as permissões do banco de dados'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações de Pagamento</h1>
        <p className="text-muted-foreground">
          Gerencie como seus clientes pagam e como o suporte via WhatsApp é acionado.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* PIX Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Dados do Recebedor (PIX)
            </CardTitle>
            <CardDescription>
              Esses dados são usados para gerar o código PIX "Copia e Cola" no checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="pix_key">Chave PIX *</Label>
                <Input
                  id="pix_key"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, CNPJ, E-mail ou Chave Aleatória"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="merchant_name">Nome do Beneficiário</Label>
                <Input
                  id="merchant_name"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="Ex: iCamStore"
                  className="mt-1"
                  maxLength={25}
                />
              </div>
              <div>
                <Label htmlFor="merchant_city">Cidade</Label>
                <Input
                  id="merchant_city"
                  value={merchantCity}
                  onChange={(e) => setMerchantCity(e.target.value)}
                  placeholder="Ex: SAO PAULO"
                  className="mt-1"
                  maxLength={15}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Threshold */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Limitador de WhatsApp
            </CardTitle>
            <CardDescription>
              Define até qual valor o cliente pode solicitar o pagamento via WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label className="text-base">Habilitar Limitador</Label>
                <p className="text-sm text-muted-foreground">
                  Se desativado, o botão de WhatsApp aparecerá para qualquer valor.
                </p>
              </div>
              <Switch
                checked={whatsappThresholdEnabled}
                onCheckedChange={setWhatsappThresholdEnabled}
              />
            </div>

            {whatsappThresholdEnabled && (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="threshold_value">Valor Máximo para WhatsApp (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="threshold_value"
                    type="number"
                    value={whatsappThresholdValue}
                    onChange={(e) => setWhatsappThresholdValue(Number(e.target.value))}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Pedidos acima deste valor não mostrarão o botão de solicitar PIX no WhatsApp.
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>Dica de Segurança:</strong> Limitar o WhatsApp para valores altos ajuda a evitar fraudes e garante que pagamentos maiores passem pelo fluxo automático do site.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={updateSettings.isPending}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
}