import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/layout';
import { useOrder, useOrderItems } from '@/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-500', step: 1 },
  awaiting_payment: { label: 'Aguardando Pagamento', icon: Clock, color: 'text-yellow-500', step: 1 },
  paid: { label: 'Pago', icon: CheckCircle, color: 'text-green-500', step: 2 },
  processing: { label: 'Em Preparação', icon: Package, color: 'text-blue-500', step: 2 },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-blue-500', step: 3 },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-500', step: 4 },
  cancelled: { label: 'Cancelado', icon: AlertCircle, color: 'text-red-500', step: 0 },
};

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get('pedido') || '';
  const [searchInput, setSearchInput] = useState(orderId);
  
  const { data: order, isLoading: orderLoading, error } = useOrder(orderId);
  const { data: orderItems, isLoading: itemsLoading } = useOrderItems(orderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ pedido: searchInput.trim() });
    }
  };

  const copyPixCode = () => {
    if (order?.pix_code) {
      navigator.clipboard.writeText(order.pix_code);
      toast.success('Código PIX copiado!');
    }
  };

  const status = order?.status || 'pending';
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Rastrear Pedido</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Digite o código do pedido"
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Order details */}
        {orderId && (
          <>
            {orderLoading ? (
              <div className="max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : error || !order ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
                <p className="text-muted-foreground mb-4">
                  Verifique o código do pedido e tente novamente.
                </p>
                <Link to="/">
                  <Button>Voltar para a loja</Button>
                </Link>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Order header */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Pedido</p>
                      <p className="font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-medium">{statusInfo.label}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Realizado em {formatDateTime(order.created_at || '')}
                  </p>
                </div>

                {/* Status timeline */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Status do Pedido</h3>
                  <div className="flex justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-4 left-0 right-0 h-1 bg-border">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(statusInfo.step / 4) * 100}%` }}
                      />
                    </div>

                    {/* Steps */}
                    {[
                      { step: 1, label: 'Pedido Recebido', icon: Package },
                      { step: 2, label: 'Em Preparação', icon: Package },
                      { step: 3, label: 'Enviado', icon: Truck },
                      { step: 4, label: 'Entregue', icon: CheckCircle },
                    ].map(({ step, label, icon: Icon }) => (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            statusInfo.step >= step
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs mt-2 text-center max-w-[80px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PIX payment info */}
                {order.payment_method === 'pix' && order.status === 'awaiting_payment' && order.pix_code && (
                  <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                    <h3 className="font-semibold mb-2">Pagamento via PIX</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Copie o código abaixo e pague no seu app de banco
                    </p>
                    <div className="flex gap-2">
                      <Input value={order.pix_code} readOnly className="font-mono" />
                      <Button onClick={copyPixCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-primary mt-2 font-medium">
                      Valor com 5% de desconto: {formatCurrency(order.total)}
                    </p>
                  </div>
                )}

                {/* Order items */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Itens do Pedido</h3>
                  {itemsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orderItems?.map((item) => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <hr className="border-border my-4" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Endereço de Entrega</h3>
                  <p className="text-sm">
                    {order.customer_name}<br />
                    {order.customer_address}<br />
                    {order.customer_city} - {order.customer_state}<br />
                    CEP: {order.customer_cep}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!orderId && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Rastreie seu pedido</h2>
            <p className="text-muted-foreground">
              Digite o código do pedido acima para ver o status da entrega.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
