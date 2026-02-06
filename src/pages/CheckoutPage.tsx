import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, CreditCard, QrCode, Shield, Lock, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { formatCurrency, formatCardNumber, formatCardExpiry, formatPhone, formatCEP } from '@/lib/format';
import { CheckoutFormData } from '@/types/ecommerce';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_cep: '',
    customer_address: '',
    customer_city: '',
    customer_state: '',
    payment_method: 'pix',
  });

  const total = getTotal();
  const shipping = total >= 299 ? 0 : 29.90;
  const finalTotal = total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'customer_phone') {
      formattedValue = formatPhone(value.replace(/\D/g, '').slice(0, 11));
    } else if (name === 'customer_cep') {
      formattedValue = formatCEP(value.replace(/\D/g, '').slice(0, 8));
    } else if (name === 'card_number') {
      formattedValue = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
    } else if (name === 'card_expiry') {
      formattedValue = formatCardExpiry(value.replace(/\D/g, '').slice(0, 4));
    } else if (name === 'card_cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        formData: { ...formData, payment_method: paymentMethod },
        items,
        total: finalTotal,
      });

      clearCart();
      navigate(`/pedido/${order.id}`);
    } catch (error) {
      toast({
        title: 'Erro ao criar pedido',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Button asChild>
            <Link to="/">Continuar comprando</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="customer_name">Nome Completo *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">E-mail *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Telefone *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_cep">CEP *</Label>
                    <Input
                      id="customer_cep"
                      name="customer_cep"
                      value={formData.customer_cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="customer_address">Endereço Completo *</Label>
                    <Input
                      id="customer_address"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, complemento"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_city">Cidade *</Label>
                    <Input
                      id="customer_city"
                      name="customer_city"
                      value={formData.customer_city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_state">Estado *</Label>
                    <Input
                      id="customer_state"
                      name="customer_state"
                      value={formData.customer_state}
                      onChange={handleInputChange}
                      placeholder="SP"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'pix' | 'credit_card')}
                  className="space-y-4"
                >
                  {/* PIX */}
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'pix' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                        <QrCode className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">PIX</p>
                          <p className="text-sm text-muted-foreground">
                            Aprovação imediata • 5% de desconto
                          </p>
                        </div>
                      </Label>
                      <span className="font-semibold text-success">
                        {formatCurrency(finalTotal * 0.95)}
                      </span>
                    </div>
                  </div>

                  {/* Credit Card */}
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cartão de Crédito</p>
                          <p className="text-sm text-muted-foreground">
                            Em até 12x sem juros
                          </p>
                        </div>
                      </Label>
                      <span className="font-semibold">
                        12x de {formatCurrency(finalTotal / 12)}
                      </span>
                    </div>

                    {paymentMethod === 'credit_card' && (
                      <div className="mt-4 pt-4 border-t grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label htmlFor="card_number">Número do Cartão</Label>
                          <Input
                            id="card_number"
                            name="card_number"
                            value={formData.card_number || ''}
                            onChange={handleInputChange}
                            placeholder="0000 0000 0000 0000"
                            required={paymentMethod === 'credit_card'}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="card_holder">Nome no Cartão</Label>
                          <Input
                            id="card_holder"
                            name="card_holder"
                            value={formData.card_holder || ''}
                            onChange={handleInputChange}
                            placeholder="NOME COMO NO CARTÃO"
                            className="uppercase"
                            required={paymentMethod === 'credit_card'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_expiry">Validade</Label>
                          <Input
                            id="card_expiry"
                            name="card_expiry"
                            value={formData.card_expiry || ''}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            required={paymentMethod === 'credit_card'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_cvv">CVV</Label>
                          <Input
                            id="card_cvv"
                            name="card_cvv"
                            value={formData.card_cvv || ''}
                            onChange={handleInputChange}
                            placeholder="000"
                            required={paymentMethod === 'credit_card'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qtd: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                      {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
                    </span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Desconto PIX (5%)</span>
                      <span>-{formatCurrency(finalTotal * 0.05)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {formatCurrency(paymentMethod === 'pix' ? finalTotal * 0.95 : finalTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Compra 100% Segura</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
