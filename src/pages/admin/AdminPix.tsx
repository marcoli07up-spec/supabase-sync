import { useState, useEffect } from 'react';
import { Copy, QrCode, Check, Settings, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { usePixSettings, useUpdatePixSettings, generatePixEMV } from '@/hooks/usePixSettings';

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED${timestamp}${random}`;
};

export default function AdminPix() {
  const { data: pixSettings, isLoading } = usePixSettings();
  const updateSettings = useUpdatePixSettings();

  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('iCamStore');
  const [merchantCity, setMerchantCity] = useState('SAO PAULO');
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Load saved settings
  useEffect(() => {
    if (pixSettings) {
      if (pixSettings.pix_key) setPixKey(pixSettings.pix_key);
      if (pixSettings.merchant_name) setMerchantName(pixSettings.merchant_name);
      if (pixSettings.merchant_city) setMerchantCity(pixSettings.merchant_city);
    }
  }, [pixSettings]);

  // Auto-generate order ID on mount
  useEffect(() => {
    setOrderId(generateOrderId());
  }, []);

  const regenerateOrderId = () => {
    setOrderId(generateOrderId());
    toast.success('Novo ID gerado!');
  };

  const saveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        pix_key: pixKey,
        merchant_name: merchantName,
        merchant_city: merchantCity,
      });
      toast.success('Configurações do PIX salvas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error(error);
    }
  };

  // Generate PIX code
  const handleGeneratePixCode = () => {
    if (!pixKey.trim()) {
      toast.error('Informe a chave PIX');
      return;
    }

    const code = generatePixEMV({
      pixKey,
      merchantName,
      merchantCity,
      amount: parseFloat(amount) || undefined,
      txId: orderId,
    });

    setGeneratedCode(code);
    toast.success('Código PIX gerado com sucesso!');
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    const formatted = (parseInt(num || '0') / 100).toFixed(2);
    return formatted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
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
        <h1 className="text-2xl font-bold">Gerador de PIX</h1>
        <p className="text-muted-foreground">
          Gere códigos PIX copia e cola para seus clientes
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuração do PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PIX Key */}
            <div>
              <Label htmlFor="pix-key">Chave PIX *</Label>
              <Input
                id="pix-key"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Sua chave PIX (CPF, CNPJ, email, telefone ou aleatória)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Digite a chave exatamente como cadastrada no banco
              </p>
            </div>

            {/* Merchant Name */}
            <div>
              <Label htmlFor="merchant-name">Nome do Recebedor</Label>
              <Input
                id="merchant-name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Nome que aparecerá no PIX"
                className="mt-1"
                maxLength={25}
              />
            </div>

            {/* Merchant City */}
            <div>
              <Label htmlFor="merchant-city">Cidade</Label>
              <Input
                id="merchant-city"
                value={merchantCity}
                onChange={(e) => setMerchantCity(e.target.value)}
                placeholder="Cidade do recebedor"
                className="mt-1"
                maxLength={15}
              />
            </div>

            {/* Save Settings Button */}
            <Button 
              variant="outline" 
              onClick={saveSettings} 
              className="w-full"
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações do PIX'}
            </Button>

            <div className="border-t pt-4">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe em branco para valor livre
              </p>
            </div>

            {/* Order ID */}
            <div>
              <Label htmlFor="order-id">ID do Pedido</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="order-id"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="PEDIDO123"
                  className="flex-1"
                  maxLength={25}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={regenerateOrderId}
                  title="Gerar novo ID"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ID gerado automaticamente para rastreio
              </p>
            </div>

            <Button onClick={handleGeneratePixCode} className="w-full" size="lg">
              <QrCode className="h-4 w-4 mr-2" />
              Gerar Código PIX
            </Button>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Código PIX Gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG 
                    value={generatedCode} 
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">PIX Copia e Cola:</p>
                  <code className="block text-sm break-all font-mono bg-background p-3 rounded border">
                    {generatedCode}
                  </code>
                </div>

                <Button 
                  onClick={copyCode} 
                  className="w-full" 
                  variant={copied ? "secondary" : "default"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>

                <div className="bg-primary/10 p-4 rounded-lg text-sm space-y-2">
                  <p><strong>Recebedor:</strong> {merchantName}</p>
                  <p><strong>Cidade:</strong> {merchantCity}</p>
                  <p><strong>Chave:</strong> {pixKey}</p>
                  {parseFloat(amount) > 0 && (
                    <p><strong>Valor:</strong> R$ {parseFloat(amount).toFixed(2)}</p>
                  )}
                  {orderId && (
                    <p><strong>ID do Pedido:</strong> {orderId}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Preencha os dados e clique em "Gerar Código PIX"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="py-4">
          <h3 className="font-semibold mb-2">Como usar:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Informe sua chave PIX cadastrada no banco</li>
            <li>Preencha o valor (ou deixe em branco para valor livre)</li>
            <li>Clique em "Gerar Código PIX"</li>
            <li>Copie o código ou escaneie o QR Code</li>
            <li>O cliente cola no app do banco para pagar</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
