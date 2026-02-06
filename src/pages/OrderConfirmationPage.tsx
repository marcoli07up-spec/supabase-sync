import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Copy } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useOrder(id || '');
  const { toast } = useToast();

  const copyPixCode = () => {
    if (data?.order.pix_code) {
      navigator.clipboard.writeText(data.order.pix_code);
      toast({
        title: 'Código PIX copiado!',
        description: 'Cole no app do seu banco para pagar.',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <Button asChild>
            <Link to="/">Voltar para a loja</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const { order, items } = data;

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Pedido Realizado!</h1>
            <p className="text-muted-foreground">
              Obrigado pela sua compra. Você receberá um e-mail com os detalhes.
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</h2>
              <span className="text-sm text-muted-foreground">
                {formatDateTime(order.created_at || '')}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 bg-success text-success-foreground rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Confirmado</span>
              </div>
              <div className="h-0.5 flex-1 bg-muted min-w-8" />
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">Preparando</span>
              </div>
              <div className="h-0.5 flex-1 bg-muted min-w-8" />
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">Enviado</span>
              </div>
            </div>

            {/* PIX Payment */}
            {order.payment_method === 'pix' && order.pix_code && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">📱</span> Pagamento via PIX
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Copie o código abaixo e cole no app do seu banco para pagar.
                  O pagamento é confirmado em poucos segundos.
                </p>
                <div className="bg-background border rounded p-3 mb-3">
                  <p className="text-xs font-mono break-all">{order.pix_code}</p>
                </div>
                <Button onClick={copyPixCode} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código PIX
                </Button>
              </div>
            )}

            {/* Credit Card Payment */}
            {order.payment_method === 'credit_card' && (
              <div className="bg-success/10 text-success rounded-lg p-4 mb-6">
                <p className="font-medium">✓ Pagamento aprovado com cartão de crédito</p>
                {order.card_number && (
                  <p className="text-sm mt-1">Final **** {order.card_number}</p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-semibold">Itens do Pedido</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} x{item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">Endereço de Entrega</h3>
            <p className="text-sm">
              {order.customer_name}<br />
              {order.customer_address}<br />
              {order.customer_city} - {order.customer_state}<br />
              CEP: {order.customer_cep}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to={`/rastreio?pedido=${order.id}`}>
                <Package className="h-4 w-4 mr-2" />
                Rastrear Pedido
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmationPage;
