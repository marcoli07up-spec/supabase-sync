import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrackOrder } from '@/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Loader2 } from 'lucide-react';

const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('pedido') || '');
  const trackOrder = useTrackOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      trackOrder.mutate(orderId.trim());
    }
  };

  const order = trackOrder.data;

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Pendente', icon: Clock },
      { status: 'confirmed', label: 'Confirmado', icon: CheckCircle },
      { status: 'preparing', label: 'Preparando', icon: Package },
      { status: 'shipped', label: 'Enviado', icon: Truck },
      { status: 'delivered', label: 'Entregue', icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex((step) => step.status === order?.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Rastrear Pedido</span>
        </nav>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Rastrear Pedido</h1>
            <p className="text-muted-foreground">
              Digite o código do pedido para acompanhar o status da entrega
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <Input
              type="text"
              placeholder="Digite o código do pedido..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={trackOrder.isPending}>
              {trackOrder.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Error State */}
          {trackOrder.isError && (
            <div className="text-center py-8 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-medium">
                Não foi possível encontrar o pedido. Verifique o código e tente novamente.
              </p>
            </div>
          )}

          {/* No Order Found */}
          {trackOrder.isSuccess && !order && (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Pedido não encontrado. Verifique o código digitado.
              </p>
            </div>
          )}

          {/* Order Found */}
          {order && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido</p>
                    <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-semibold">{formatDateTime(order.created_at || '')}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="relative">
                  <div className="flex justify-between">
                    {getStatusSteps().map((step, index) => (
                      <div key={step.status} className="flex flex-col items-center relative z-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <p
                          className={`text-xs mt-2 text-center ${
                            step.current ? 'font-semibold' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Progress Bar */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                    <div
                      className="h-full bg-success transition-all"
                      style={{
                        width: `${
                          (getStatusSteps().findIndex((s) => s.current) /
                            (getStatusSteps().length - 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Detalhes do Pedido</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cliente</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-mail</p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground">Endereço</p>
                    <p className="font-medium">
                      {order.customer_address}, {order.customer_city} - {order.customer_state}, {order.customer_cep}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          {!order && !trackOrder.isError && (
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>Você encontra o código do pedido no e-mail de confirmação ou na página do pedido.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TrackingPage;
