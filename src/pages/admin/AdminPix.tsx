import { useState, useEffect } from 'react';
import { Save, ShieldCheck, MessageCircle, CreditCard, AlertCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePixSettings, useUpdatePixSettings, generatePixEMV } from '@/hooks/usePixSettings';

export default function AdminPix() {
  const { data: pixSettings, isLoading } = usePixSettings();
  const updateSettings = useUpdatePixSettings();

  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('');
  const [whatsappThresholdEnabled, setWhatsappThresholdEnabled] = useState(true);
  const [whatsappThresholdValue, setWhatsappThresholdValue] = useState(2500);
  
  const [testCode, setTestCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pixSettings) {
      setPixKey(pixSettings.pix_key || '');
      setMerchantName(pixSettings.merchant_name || '');
      setMerchantCity(pixSettings.merchant_city || '');
      setWhatsappThresholdEnabled(pixSettings.whatsapp_threshold_enabled ?? true);
      setWhatsappThresholdValue(pixSettings.whatsapp_threshold_value ?? 2500);
    }
  }, [pixSettings]);

  // Gera um código de teste sempre que os dados mudam
  useEffect(() => {
    if (pixKey.trim()) {
      const code = generatePixEMV({
        pixKey: pixKey.trim(),
        merchantName: merchantName || 'iCamStore',
        merchantCity: merchantCity || 'SAO PAULO',
        amount: 100.00, // Valor de teste
        txId: 'TESTE'
      });
      setTestCode(code);
    } else {
      setTestCode('');
    }
  }, [pixKey, merchantName, merchantCity]);

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
      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      // Mensagem amigável para erro de RLS
      if (error.message?.includes('row-level security')) {
        toast.error('Erro de permissão: Você precisa rodar o comando SQL no Supabase para liberar o acesso à tabela site_settings.');
      } else {
        toast.error(`Erro ao salvar: ${error.message}`);
      }
    }
  };

  const copyTestCode = () => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    toast.success('Código de teste copiado!');
    setTimeout(() => setCopied(false), 2000);
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
          Gerencie sua chave PIX e o limitador de suporte via WhatsApp.
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
              Configure a chave que receberá os pagamentos. Aceita E-mail, CPF, CNPJ ou Chave Aleatória.
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
                  placeholder="Ex: seu-email@gmail.com ou 000.000.000-00"
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

            {testCode && (
              <div className="mt-4 p-4 bg-muted rounded-lg border border-dashed border-border">
                <Label className="text-xs uppercase text-muted-foreground mb-2 block">Prévia do Código (Teste de R$ 100,00)</Label>
                <div className="flex gap-2">
                  <div className="bg-background p-2 rounded border text-[10px] font-mono break-all flex-1 max-h-16 overflow-y-auto">
                    {testCode}
                  </div>
                  <Button size="icon" variant="outline" onClick={copyTestCode} className="shrink-0">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
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
            {updateSettings.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}