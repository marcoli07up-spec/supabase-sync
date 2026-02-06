import { useState } from 'react';
import { Search, Package, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminTracking() {
  const queryClient = useQueryClient();
  const [newCpf, setNewCpf] = useState('');
  const [newTrackingCode, setNewTrackingCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all tracking entries from orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_cpf, customer_name, pix_code, created_at')
        .not('customer_cpf', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateTrackingCode = useMutation({
    mutationFn: async ({ cpf, trackingCode }: { cpf: string; trackingCode: string }) => {
      // Find order by CPF and update pix_code as tracking code
      const { data: existingOrder, error: findError } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_cpf', cpf.replace(/\D/g, ''))
        .single();

      if (findError || !existingOrder) {
        // Create a new order entry for tracking
        const { error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_cpf: cpf.replace(/\D/g, ''),
            customer_name: customerName || 'Cliente',
            customer_phone: '0',
            total: 0,
            status: 'shipped',
            pix_code: trackingCode,
          });

        if (insertError) throw insertError;
      } else {
        // Update existing order
        const { error: updateError } = await supabase
          .from('orders')
          .update({ pix_code: trackingCode })
          .eq('id', existingOrder.id);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tracking'] });
      toast.success('Código de rastreio cadastrado!');
      setNewCpf('');
      setNewTrackingCode('');
      setCustomerName('');
    },
    onError: () => {
      toast.error('Erro ao cadastrar rastreio');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCpf || !newTrackingCode) {
      toast.error('Preencha o CPF e o código de rastreio');
      return;
    }
    updateTrackingCode.mutate({ cpf: newCpf, trackingCode: newTrackingCode });
  };

  const filteredOrders = orders?.filter(order => 
    order.customer_cpf?.includes(searchTerm.replace(/\D/g, '')) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciar Rastreios</h1>

      {/* Add new tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Cadastrar Código de Rastreio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-4">
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
            <div>
              <Label htmlFor="tracking">Código de Rastreio</Label>
              <Input
                id="tracking"
                value={newTrackingCode}
                onChange={(e) => setNewTrackingCode(e.target.value)}
                placeholder="Ex: BR123456789"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={updateTrackingCode.isPending} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar
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
                  <TableHead>Código de Rastreio</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">
                      {order.customer_cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      {order.pix_code ? (
                        <Badge variant="secondary" className="font-mono">
                          {order.pix_code}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Não cadastrado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Nenhum rastreio encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
