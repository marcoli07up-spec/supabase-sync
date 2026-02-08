import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MessageCircle, QrCode, Truck, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { formatCurrency } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; description: string }> = {
  pending: { icon: Clock, label: 'Pendente', color: 'text-yellow-500', description: 'Seu pedido está sendo processado.' },
  awaiting_payment: { icon: QrCode, label: 'Aguardando Pagamento', color: 'text-orange-500', description: 'Aguardando confirmação do pagamento PIX.' },
  paid: { icon: CheckCircle, label: 'Pago', color: 'text-green-500', description: 'Pagamento confirmado! Preparando seu pedido.' },
  processing: { icon: Package, label: 'Em Preparação', color: 'text-blue-500', description: 'Estamos preparando seu pedido para envio.' },
  shipped: { icon: Truck, label: 'Enviado', color: 'text-purple-500', description: 'Seu pedido está a caminho!' },
  delivered: { icon: CheckCircle, label: 'Entregue', color: 'text-green-700', description: 'Pedido entregue com sucesso!' },
  cancelled: { icon: Clock, label: 'Cancelado', color: 'text-red-500', description: 'Este pedido foi cancelado.' },
};

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order and items
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        setIsLoading(false);
        return;
      }

      setOrder(orderData as Order);

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      setItems((itemsData || []) as OrderItem[]);
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  // Real-time subscription for order status updates
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (!orderId) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">O ID do pedido não foi informado.</p>
          <Button onClick={() => navigate('/')}>Voltar para a loja</Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">Não conseguimos encontrar o pedido solicitado.</p>
          <Button onClick={() => navigate('/')}>Voltar para a loja</Button>
        </div>
      </Layout>
    );
  }

  const status = order.status || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const openWhatsApp = () => {
    const phone = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Gostaria de verificar meu pedido.\n\n` +
      `Pedido: #${order.id.slice(0, 8).toUpperCase()}\n` +
      `Nome: ${order.customer_name}\n` +
      `Valor: ${formatCurrency(order.total)}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          {/* Status Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className={`h-10 w-10 ${statusInfo.color}`} />
            </div>
            <h1 className="text-2xl font-bold mb-2">{statusInfo.label}</h1>
            <p className="text-muted-foreground">{statusInfo.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Pedido: <span className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Itens do Pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {status === 'awaiting_payment' && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="h-5 w-5 text-orange-500" />
                <h2 className="font-bold text-lg">Pagamento Pendente</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Entre em contato conosco pelo WhatsApp para receber o código PIX e finalizar seu pagamento.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ⏳ Esta página será atualizada automaticamente quando o pagamento for confirmado.
              </p>
              <Button onClick={openWhatsApp} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Solicitar PIX no WhatsApp
              </Button>
            </div>
          )}

          {status === 'paid' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="font-bold text-lg">Pagamento Confirmado!</h2>
              </div>
              <p className="text-muted-foreground">
                Seu pagamento foi recebido. Estamos preparando seu pedido para envio.
              </p>
            </div>
          )}

          {status === 'shipped' && order.tracking_code && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5 text-purple-500" />
                <h2 className="font-bold text-lg">Pedido Enviado!</h2>
              </div>
              <p className="text-muted-foreground mb-2">Código de rastreio:</p>
              <p className="font-mono font-bold text-lg">{order.tracking_code}</p>
            </div>
          )}

          {/* Delivery Info */}
          <div className="bg-secondary/50 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Endereço de Entrega</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p>{order.customer_address}</p>
              <p>{order.customer_city} - {order.customer_state}</p>
              <p>CEP: {order.customer_cep}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={openWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar no WhatsApp
            </Button>
            <Button className="flex-1" onClick={() => navigate('/')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
