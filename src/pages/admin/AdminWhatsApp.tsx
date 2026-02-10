import { useWhatsAppSettings, useUpdateWhatsAppSettings } from '@/hooks/useWhatsAppSettings';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function AdminWhatsApp() {
  const { data: settings, isLoading } = useWhatsAppSettings();
  const updateSettings = useUpdateWhatsAppSettings();
  const [enabled, setEnabled] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (settings) {
      setEnabled(settings.enabled);
      setPhone(settings.phone);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({ enabled, phone });
      toast.success('Configurações do WhatsApp salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) return <div className="p-4">Carregando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Configurações do WhatsApp
      </h1>

      <div className="max-w-md space-y-6 bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">WhatsApp ativo</Label>
            <p className="text-sm text-muted-foreground">
              Exibir botão flutuante e links de WhatsApp no site
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div>
          <Label htmlFor="phone">Número do WhatsApp</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5544999999999"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Formato: código do país + DDD + número (ex: 5544999999999)
          </p>
        </div>

        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
}
