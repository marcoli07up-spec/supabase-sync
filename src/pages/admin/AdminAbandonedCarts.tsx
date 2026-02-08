import { MessageCircle, Eye, CheckCircle, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAbandonedCarts, useUpdateAbandonedCartStatus } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePixSettings, generatePixEMV } from '@/hooks/usePixSettings';
import { QRCodeSVG } from 'qrcode.react';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
}

interface AbandonedCart {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_city: string | null;
  customer_state: string | null;
  customer_cep: string | null;
  cart_items: unknown;
  cart_total: number;
  status: string;
  contacted_at: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  abandoned: 'bg-red-500',
  contacted: 'bg-yellow-500',
  recovered: 'bg-green-500',
  lost: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  abandoned: 'Abandonado',
  contacted: 'Contatado',
  recovered: 'Recuperado',
  lost: 'Perdido',
};

export default function AdminAbandonedCarts() {
  const { data: carts, isLoading } = useAbandonedCarts();
  const { data: pixSettings } = usePixSettings();
  const updateStatus = useUpdateAbandonedCartStatus();
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [pixCart, setPixCart] = useState<AbandonedCart | null>(null);

  const openWhatsApp = (cart: AbandonedCart) => {
    if (!cart.customer_phone) {
      toast.error('Cliente sem telefone cadastrado');
      return;
    }

    const phone = cart.customer_phone.replace(/\D/g, '');
    const items = (cart.cart_items as CartItem[]) || [];
    const itemsText = items
      .filter(i => i?.product?.name)
      .map(i => `• ${i.product.name} (${i.quantity}x)`)
      .join('\n');
    
    const message = encodeURIComponent(
      `Olá ${cart.customer_name || 'cliente'}!\n\n` +
      `Vi que você deixou alguns itens no carrinho na iCamStore:\n\n` +
      `${itemsText}\n\n` +
      `Total: ${formatCurrency(cart.cart_total)}\n\n` +
      `Posso ajudar a finalizar sua compra?`
    );

    // Mark as contacted
    updateStatus.mutate({ 
      id: cart.id, 
      status: 'contacted', 
      contacted_at: new Date().toISOString() 
    });

    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const markAsRecovered = (cart: AbandonedCart) => {
    updateStatus.mutate({ id: cart.id, status: 'recovered' });
    toast.success('Carrinho marcado como recuperado!');
  };

  const markAsLost = (cart: AbandonedCart) => {
    updateStatus.mutate({ id: cart.id, status: 'lost' });
    toast.success('Carrinho marcado como perdido.');
  };

  const generatePixCode = (cart: AbandonedCart): string => {
    if (!pixSettings?.pix_key) {
      return '';
    }
    return generatePixEMV({
      pixKey: pixSettings.pix_key,
      merchantName: pixSettings.merchant_name,
      merchantCity: pixSettings.merchant_city,
      amount: cart.cart_total,
      txId: cart.id.slice(0, 8).toUpperCase(),
    });
  };

  const copyPixCode = (cart: AbandonedCart) => {
    const code = generatePixCode(cart);
    if (!code) {
      toast.error('Configure a chave PIX em Admin > PIX');
      return;
    }
    navigator.clipboard.writeText(code);
    toast.success('Código PIX copiado!');
  };

  const validCartItems = (cart: AbandonedCart) => 
    ((cart.cart_items as CartItem[]) || []).filter(item => item?.product);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Carrinhos Abandonados</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : carts && carts.length > 0 ? (
        <div className="space-y-4">
          {carts.map((cart) => (
            <Card key={cart.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">#{cart.id.slice(0, 8).toUpperCase()}</span>
                      <Badge className={statusColors[cart.status]}>
                        {statusLabels[cart.status] || cart.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{cart.customer_name || 'Cliente anônimo'}</p>
                    <p className="text-sm text-muted-foreground">
                      {cart.customer_phone || 'Sem telefone'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Abandonado em {formatDateTime(cart.created_at)}
                    </p>
                    {cart.contacted_at && (
                      <p className="text-sm text-muted-foreground">
                        Contatado em {formatDateTime(cart.contacted_at)}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(cart.cart_total)}</p>
                    <p className="text-sm text-muted-foreground">
                      {validCartItems(cart).length} itens
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedCart(cart)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Pedido
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => copyPixCode(cart)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar PIX
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => setPixCart(cart)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>

                  {cart.customer_phone && (
                    <Button size="sm" variant="default" onClick={() => openWhatsApp(cart)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}

                  {cart.status !== 'recovered' && (
                    <Button size="sm" variant="outline" onClick={() => markAsRecovered(cart)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Recuperado
                    </Button>
                  )}

                  {cart.status !== 'lost' && (
                    <Button size="sm" variant="ghost" onClick={() => markAsLost(cart)}>
                      Marcar como Perdido
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum carrinho abandonado.</p>
          </CardContent>
        </Card>
      )}

      {/* Cart Details Dialog */}
      <Dialog open={!!selectedCart} onOpenChange={() => setSelectedCart(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Pedido #{selectedCart?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          {selectedCart && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Dados do Cliente</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Nome:</strong> {selectedCart.customer_name || 'Não informado'}</p>
                  <p><strong>Telefone:</strong> {selectedCart.customer_phone || 'Não informado'}</p>
                  {selectedCart.customer_email && (
                    <p><strong>Email:</strong> {selectedCart.customer_email}</p>
                  )}
                  {selectedCart.customer_address && (
                    <p><strong>Endereço:</strong> {selectedCart.customer_address}</p>
                  )}
                  {(selectedCart.customer_city || selectedCart.customer_state) && (
                    <p><strong>Cidade/UF:</strong> {selectedCart.customer_city} - {selectedCart.customer_state}</p>
                  )}
                  {selectedCart.customer_cep && (
                    <p><strong>CEP:</strong> {selectedCart.customer_cep}</p>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-2">
                <h4 className="font-semibold">Itens do Carrinho</h4>
                {validCartItems(selectedCart).map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                    {item.product?.image_url && (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product?.name || 'Produto'}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || 'Produto removido'}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.product?.price || 0)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between p-3 bg-primary/10 rounded-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(selectedCart.cart_total)}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => copyPixCode(selectedCart)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar PIX
                </Button>
                {selectedCart.customer_phone && (
                  <Button size="sm" variant="default" onClick={() => openWhatsApp(selectedCart)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PIX QR Code Dialog */}
      <Dialog open={!!pixCart} onOpenChange={() => setPixCart(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              PIX - {formatCurrency(pixCart?.cart_total || 0)}
            </DialogTitle>
          </DialogHeader>

          {pixCart && (
            <div className="space-y-4">
              {pixSettings?.pix_key ? (
                <>
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG 
                      value={generatePixCode(pixCart)} 
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Cliente: {pixCart.customer_name || 'Anônimo'}</p>
                    <p className="font-mono">#{pixCart.id.slice(0, 8).toUpperCase()}</p>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => {
                      copyPixCode(pixCart);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Código PIX
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Configure sua chave PIX em Admin → Ferramenta PIX
                  </p>
                  <Button variant="outline" onClick={() => setPixCart(null)}>
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
