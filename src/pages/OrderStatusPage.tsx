import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MessageCircle, QrCode, Truck, Package, ShoppingBag, Copy, Check, Loader2, MapPin, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { formatCurrency } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { usePixSettings } from '@/hooks/usePixSettings';

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; description: string }> = {
  pending: { icon: Clock, label: 'Pendente', color: 'text-yellow-500', description: 'Seu pedido está sendo processado.' },
  awaiting_payment: { icon: QrCode, label: 'Aguardando Pagamento', color: 'text-orange-500', description: 'Aguardando confirmação do pagamento PIX.' },
  paid: { icon: CheckCircle, label: 'Pago', color: 'text-green-500', description: 'Pagamento confirmado! Preparando seu pedido para envio.' },
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
  const [copied, setCopied] = useState(false);
  
  const { data: pixSettings } = usePixSettings();

  const orderWithPix = order as Order & { 
    pix_qr_code?: string; 
    pix_qr_code_image?: string; 
    podpay_transaction_id?: string;
  };

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
          const updated = payload.new as Order;
          setOrder(updated);
          if (updated.status === 'paid' && order?.status === 'awaiting_payment') {
            toast.success('🎉 Pagamento confirmado! Seu pedido será enviado em breve.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, order?.status]);

  const copyPixCode = async () => {
    if (orderWithPix?.pix_qr_code) {
      try {
        await navigator.clipboard.writeText(orderWithPix.pix_qr_code);
        setCopied(true);
        toast.success('Código PIX copiado! Cole no app do seu banco.');
        setTimeout(() => setCopied(false), 3000);
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = orderWithPix.pix_qr_code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success('Código PIX copiado!');
        setTimeout(() => setCopied(false), 3000);
      }
    }
  };

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

  const openWhatsApp = (customMessage?: string) => {
    const phone = '554431011011';
    const message = customMessage ? encodeURIComponent(customMessage) : encodeURIComponent(
      `Olá! Tenho uma dúvida sobre meu pedido #${order.id.slice(0, 8).toUpperCase()}.\n\n` +
      `Nome: ${order.customer_name}\n` +
      `Telefone: ${order.customer_phone}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const openWhatsAppPix = () => {
    const itemsList = items.map((item, i) => 
      `  ${i + 1}. ${item.product_name} (x${item.quantity}) — ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');
    const paymentMethod = order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'card' ? 'Cartão de Crédito' : order.payment_method || 'Não informado';
    const message = 
      `Olá! Gostaria de finalizar o pagamento do meu pedido via PIX. Seguem os detalhes completos:\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛒 *DADOS DO PEDIDO*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 Nº do Pedido: #${order.id.slice(0, 8).toUpperCase()}\n` +
      `📅 Data: ${new Date(order.created_at || '').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n` +
      `💳 Forma de Pagamento: ${paymentMethod}\n` +
      `📌 Status: ${statusConfig[status]?.label || 'Pendente'}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *ITENS DO PEDIDO*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${itemsList}\n\n` +
      `💰 *TOTAL: ${formatCurrency(order.total)}*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *DADOS DO CLIENTE*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Nome: ${order.customer_name}\n` +
      `Telefone: ${order.customer_phone}\n` +
      `${order.customer_email ? `E-mail: ${order.customer_email}\n` : ''}` +
      `${order.customer_cpf ? `CPF: ${order.customer_cpf}\n` : ''}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🚚 *ENDEREÇO DE ENTREGA*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${order.customer_address}\n` +
      `${order.customer_city} - ${order.customer_state}\n` +
      `CEP: ${order.customer_cep}\n\n` +
      `Por favor, envie o código PIX para que eu possa efetuar o pagamento. Obrigado! 🙏`;
    openWhatsApp(message);
  };

  const hasPixCode = orderWithPix?.pix_qr_code;
  
  // WhatsApp Threshold Logic
  const isAboveThreshold = pixSettings?.whatsapp_threshold_enabled && order.total > (pixSettings?.whatsapp_threshold_value || 2500);

  return (
    <Layout>
      <div className="container-custom py-8 px-3 sm:px-4">
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

          {/* PIX Payment Section */}
          {status === 'awaiting_payment' && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-5 w-5 text-orange-500" />
                <h2 className="font-bold text-lg">Pague com PIX</h2>
              </div>

              {/* If PIX code available - show immediately */}
              {hasPixCode ? (
                <div className="space-y-4">
                  {orderWithPix.pix_qr_code_image && (
                    <div className="flex justify-center">
                      <img 
                        src={orderWithPix.pix_qr_code_image} 
                        alt="QR Code PIX" 
                        className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg border border-border"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-2 text-center">PIX Copia e Cola:</p>
                    <div className="bg-background border border-border rounded-lg p-3 text-xs font-mono break-all max-h-20 overflow-y-auto mb-3">
                      {orderWithPix.pix_qr_code}
                    </div>
                    <Button 
                      onClick={copyPixCode}
                      size="lg"
                      className={`w-full text-base font-bold py-5 transition-all ${copied ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    >
                      {copied ? <><Check className="h-5 w-5 mr-2" /> Código Copiado!</> : <><Copy className="h-5 w-5 mr-2" /> Copiar Código PIX</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">Aguardando geração do código PIX...</p>
                </div>
              )}

              {/* WhatsApp Option - Respecting Threshold */}
              <div className="mt-6 pt-6 border-t border-orange-500/20">
                {isAboveThreshold ? (
                  <div className="bg-background/50 p-4 rounded-lg border border-dashed border-orange-500/30 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Para pedidos acima de <strong>{formatCurrency(pixSettings?.whatsapp_threshold_value || 2500)}</strong>, o suporte via WhatsApp está temporariamente indisponível para pagamentos. Por favor, utilize o código PIX acima.
                    </p>
                  </div>
                ) : (
                  <Button onClick={openWhatsAppPix} variant="outline" className="w-full border-orange-500/50 text-orange-600 hover:bg-orange-500/10">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Solicitar PIX no WhatsApp
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground text-center mt-4">
                ⏳ Esta página será atualizada automaticamente quando o pagamento for confirmado.
              </p>
            </div>
          )}

          {/* Payment confirmed - show tracking & delivery info */}
          {(status === 'paid' || status === 'processing') && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="font-bold text-lg">Pagamento Confirmado!</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Seu pagamento foi recebido com sucesso. Estamos preparando seu pedido para envio.
              </p>

              {order.tracking_code && (
                <div className="bg-background border border-border rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Código de Rastreio:</p>
                  <p className="font-mono font-bold text-lg">{order.tracking_code}</p>
                </div>
              )}

              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Acompanhe sua entrega</p>
                    <p className="text-xs text-muted-foreground">
                      Acesse nosso site em <button onClick={() => navigate('/rastreio')} className="text-primary underline font-medium">Rastreamento</button> e digite seu CPF para acompanhar o status do envio em tempo real.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Prazo de entrega</p>
                    <p className="text-xs text-muted-foreground">
                      Após o envio, a entrega leva de 3 a 10 dias úteis dependendo da sua região.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => openWhatsApp()} 
                variant="outline" 
                className="w-full mt-4"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Dúvidas? Fale no WhatsApp
              </Button>
            </div>
          )}

          {/* Shipped */}
          {status === 'shipped' && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5 text-purple-500" />
                <h2 className="font-bold text-lg">Pedido Enviado!</h2>
              </div>

              {order.tracking_code && (
                <div className="bg-background border border-border rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Código de Rastreio:</p>
                  <p className="font-mono font-bold text-lg">{order.tracking_code}</p>
                </div>
              )}

              <div className="bg-background border border-border rounded-lg p-4 space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Acompanhe sua entrega</p>
                    <p className="text-xs text-muted-foreground">
                      Acesse <button onClick={() => navigate('/rastreio')} className="text-primary underline font-medium">Rastreamento</button> e digite seu CPF para ver o status atualizado do envio.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => openWhatsApp()} 
                variant="outline" 
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Dúvidas? Fale no WhatsApp
              </Button>
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
            <Button variant="outline" className="flex-1" onClick={() => openWhatsApp()}>
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