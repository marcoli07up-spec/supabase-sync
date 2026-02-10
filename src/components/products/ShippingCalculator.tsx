import { useState } from 'react';
import { Truck, Package, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCEP } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ShippingResult {
  city: string;
  state: string;
}

export function ShippingCalculator() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [error, setError] = useState('');

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(raw);
    setResult(null);
    setError('');
  };

  const handleSearch = async () => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) {
      setError('CEP inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }

      setResult({
        city: data.localidade,
        state: data.uf,
      });
    } catch {
      setError('Erro ao consultar CEP');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Calcular frete</span>
      </div>

      <div className="flex gap-2 mb-2">
        <Input
          value={formatCEP(cep)}
          onChange={handleCepChange}
          onKeyDown={handleKeyDown}
          placeholder="00000-000"
          className="h-10"
          maxLength={9}
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading || cep.length < 8}
          variant="outline"
          className="shrink-0 h-10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground underline hover:text-foreground"
      >
        Não sei meu CEP
      </a>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Entrega para <strong className="text-foreground">{result.city} - {result.state}</strong>
            </span>
          </div>

          {/* Free shipping */}
          <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Até 14 dias úteis</p>
              </div>
            </div>
            <span className="text-sm font-bold text-success">Grátis</span>
          </div>

          {/* Express shipping */}
          <div className="flex items-center justify-between border border-border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Frete Expresso</p>
                <p className="text-xs text-muted-foreground">Até 9 dias úteis</p>
              </div>
            </div>
            <span className="text-sm font-bold">R$ 14,90</span>
          </div>
        </div>
      )}
    </div>
  );
}
