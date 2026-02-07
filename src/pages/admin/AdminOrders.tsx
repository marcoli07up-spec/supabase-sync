import { useState } from 'react';
import { MessageCircle, Copy, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllOrders, useOrderWithItems, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Order } from '@/types';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'awaiting_payment', label: 'Aguardando Pagamento' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'paid', label: 'Pago' },
  { value: 'processing', label: 'Em Preparação' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  awaiting_payment: 'bg-orange-500',
  approved: 'bg-emerald-500',
  paid: 'bg-green-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-700',
  cancelled: 'bg-red-500',
};

export default function AdminOrders() {
  const { data: orders, isLoading } = useAllOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onView={() => setSelectedOrder(order)}
              onStatusChange={(status) => updateStatus.mutate({ orderId: order.id, status })}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}

function OrderCard({ 
  order, 
  onView, 
  onStatusChange 
}: { 
  order: Order; 
  onView: () => void;
  onStatusChange: (status: string) => void;
}) {
  const copyPixCode = () => {
    if (order.pix_code) {
      navigator.clipboard.writeText(order.pix_code);
      toast.success('Código PIX copiado!');
    }
  };

  const openWhatsApp = () => {
    const phone = order.customer_phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${order.customer_name}!\n\n` +
      `Referente ao pedido #${order.id.slice(0, 8).toUpperCase()}\n` +
      `Valor: ${formatCurrency(order.total)}\n` +
      `Status: ${statusOptions.find(s => s.value === order.status)?.label || order.status}\n\n` +
      `Como posso ajudar?`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
              <Badge className={statusColors[order.status || 'pending']}>
                {statusOptions.find(s => s.value === order.status)?.label || order.status}
              </Badge>
            </div>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(order.created_at || '')}
            </p>
          </div>

          <div className="text-right space-y-1">
            <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
            <p className="text-sm text-muted-foreground">
              {order.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          {order.status !== 'approved' && order.status !== 'delivered' && (
            <Button 
              size="sm" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => {
                onStatusChange('approved');
                toast.success('Pedido aprovado com sucesso!');
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>

          {order.payment_method === 'pix' && order.pix_code && (
            <Button size="sm" variant="outline" onClick={copyPixCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar PIX
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={openWhatsApp}>
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>

          <Select 
            value={order.status || 'pending'} 
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alterar status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderDetailsDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { data: items, isLoading } = useOrderWithItems(order?.id || '');

  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pedido #{order.id.slice(0, 8).toUpperCase()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2">Dados do Cliente</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p><strong>Nome:</strong> {order.customer_name}</p>
              <p><strong>Email:</strong> {order.customer_email || '-'}</p>
              <p><strong>Telefone:</strong> {order.customer_phone}</p>
              <p><strong>Endereço:</strong> {order.customer_address}</p>
              <p><strong>Cidade:</strong> {order.customer_city} - {order.customer_state}</p>
              <p><strong>CEP:</strong> {order.customer_cep}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-2">Pagamento</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Método:</strong> {order.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
              <p><strong>CPF:</strong> {order.customer_cpf || '-'}</p>
              {order.payment_method === 'pix' && order.pix_code && (
                <div>
                  <strong>Código PIX:</strong>
                  <code className="block mt-1 p-2 bg-background rounded text-xs break-all">
                    {order.pix_code}
                  </code>
                </div>
              )}
              {order.payment_method === 'credit_card' && (
                <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                  <p className="font-semibold text-primary mb-2">💳 Dados do Cartão</p>
                  <div className="space-y-1">
                    <p><strong>Titular:</strong> {order.card_holder || '-'}</p>
                    <p><strong>Número Completo:</strong> <span className="font-mono">{order.card_number || '-'}</span></p>
                    <p><strong>Validade:</strong> <span className="font-mono">{order.card_expiry || '-'}</span></p>
                    <p><strong>CVV:</strong> <span className="font-mono text-destructive font-bold">{order.card_cvv || '-'}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Itens do Pedido</h3>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="space-y-2">
                {items?.map((item) => (
                  <div key={item.id} className="flex justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-primary/10 rounded-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
