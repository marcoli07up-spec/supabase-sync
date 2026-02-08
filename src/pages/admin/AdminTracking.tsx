import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, Copy, ExternalLink, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrackingInfo, TrackingInfo } from '@/lib/tracking';

export default function AdminTracking() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [newCpf, setNewCpf] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTracking, setSelectedTracking] = useState<{
    orderId: string;
    cpf: string;
    name: string;
    createdAt: string;
    trackingCode: string;
  } | null>(null);

  // Pre-fill from URL params (when coming from approve order)
  useEffect(() => {
    const cpfParam = searchParams.get('cpf');
    if (cpfParam) {
      setNewCpf(cpfParam);
    }
  }, [searchParams]);

  // Get all tracking entries from orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_cpf, customer_name, tracking_code, created_at, status')
        .not('customer_cpf', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const markAsShipped = useMutation({
    mutationFn: async ({ cpf }: { cpf: string }) => {
      // Find order by CPF
      const { data: existingOrder, error: findError } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_cpf', cpf.replace(/\D/g, ''))
        .single();

      if (findError || !existingOrder) {
        toast.error('Pedido não encontrado com este CPF');
        throw new Error('Pedido não encontrado');
      } else {
        // Update existing order status to shipped
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'shipped' })
          .eq('id', existingOrder.id);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tracking'] });
      toast.success('Pedido marcado como enviado! Código de rastreio gerado automaticamente.');
      setNewCpf('');
      setCustomerName('');
    },
    onError: () => {
      toast.error('Erro ao marcar como enviado');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCpf) {
      toast.error('Preencha o CPF do cliente');
      return;
    }
    markAsShipped.mutate({ cpf: newCpf });
  };

  const copyTrackingLink = (cpf: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/rastreio?cpf=${cpf.replace(/\D/g, '')}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado! Envie para o cliente.');
  };

  const filteredOrders = orders?.filter(order => 
    order.customer_cpf?.includes(searchTerm.replace(/\D/g, '')) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Rastreios</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Add new tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Marcar Pedido como Enviado
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            O código de rastreio Jadlog é gerado automaticamente quando o pedido é criado.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cpf">CPF do Cliente</Label>
              <Input
                id="cpf"
                value={newCpf}
                onChange={(e) => setNewCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome do cliente"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={markAsShipped.isPending} className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                Marcar como Enviado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search and list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg">Rastreios Cadastrados</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por CPF ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Código de Rastreio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredOrders.map((order) => (
                    <TrackingRow 
                      key={order.id} 
                      order={order} 
                      onCopyLink={copyTrackingLink}
                      onViewTracking={() => setSelectedTracking({
                        orderId: order.id,
                        cpf: order.customer_cpf || '',
                        name: order.customer_name || '',
                        createdAt: order.created_at,
                        trackingCode: order.tracking_code || '',
                      })}
                    />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Nenhum rastreio encontrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Tracking Details Dialog */}
      <TrackingDetailsDialog 
        tracking={selectedTracking}
        onClose={() => setSelectedTracking(null)}
      />
    </div>
  );
}

function TrackingRow({ 
  order, 
  onCopyLink,
  onViewTracking
}: { 
  order: {
    id: string;
    customer_cpf: string | null;
    customer_name: string | null;
    tracking_code: string | null;
    created_at: string;
    status: string | null;
  };
  onCopyLink: (cpf: string) => void;
  onViewTracking: () => void;
}) {
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

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    awaiting_payment: 'Aguardando',
    approved: 'Aprovado',
    paid: 'Pago',
    processing: 'Preparando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return (
    <TableRow>
      <TableCell className="font-mono">
        {order.customer_cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
      </TableCell>
      <TableCell>{order.customer_name}</TableCell>
      <TableCell>
        <Badge className={statusColors[order.status || 'pending']}>
          {statusLabels[order.status || 'pending'] || order.status}
        </Badge>
      </TableCell>
      <TableCell>
        {order.tracking_code ? (
          <Badge variant="secondary" className="font-mono">
            {order.tracking_code}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(order.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {/* Only show tracking actions for orders with status 'shipped' */}
          {order.status === 'shipped' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onViewTracking}
                title="Ver rastreio em tempo real"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCopyLink(order.customer_cpf || '')}
                title="Copiar link de rastreio"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const baseUrl = window.location.origin;
                  window.open(`${baseUrl}/rastreio?cpf=${order.customer_cpf?.replace(/\D/g, '')}`, '_blank');
                }}
                title="Abrir página de rastreio"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          {order.status === 'approved' && (
            <span className="text-xs text-muted-foreground">Aguardando envio</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function TrackingDetailsDialog({ 
  tracking, 
  onClose 
}: { 
  tracking: {
    orderId: string;
    cpf: string;
    name: string;
    createdAt: string;
    trackingCode: string;
  } | null;
  onClose: () => void;
}) {
  if (!tracking) return null;

  const trackingInfo: TrackingInfo | null = tracking.createdAt 
    ? getTrackingInfo(tracking.orderId, tracking.createdAt) 
    : null;

  const copyLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/rastreio?cpf=${tracking.cpf.replace(/\D/g, '')}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!');
  };

  return (
    <Dialog open={!!tracking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Rastreio em Tempo Real
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">{tracking.name}</p>
            <p className="text-sm text-muted-foreground">
              CPF: {tracking.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
            </p>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Código: {tracking.trackingCode}
            </p>
          </div>

          {/* Copy Link Button */}
          <Button onClick={copyLink} className="w-full" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copiar Link para Enviar ao Cliente
          </Button>

          {/* Current Status */}
          {trackingInfo && (
            <>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-semibold">{trackingInfo.currentStatus}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {trackingInfo.events[0]?.description}
                </p>
                {trackingInfo.isReturned && (
                  <Badge variant="destructive" className="mt-2">Devolvido ao Remetente</Badge>
                )}
                {trackingInfo.deliveryAttempts > 0 && !trackingInfo.isReturned && (
                  <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">
                    {trackingInfo.deliveryAttempts}/3 Tentativas de Entrega
                  </Badge>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Histórico de Movimentação</h4>
                <div className="space-y-0 max-h-80 overflow-y-auto">
                  {trackingInfo.events.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        {index < trackingInfo.events.length - 1 && (
                          <div className="w-0.5 h-full min-h-[40px] bg-muted-foreground/20" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                        <p className={`font-medium text-sm ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {event.status}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}