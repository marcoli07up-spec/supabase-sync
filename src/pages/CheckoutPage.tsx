import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, QrCode, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Layout } from '@/components/layout';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';
import { CheckoutFormData, PaymentMethod } from '@/types';

const checkoutSchema = z.object({
  customer_name: z.string().min(3, 'Nome completo é obrigatório'),
  customer_email: z.string().email('Email inválido'),
  customer_phone: z.string().min(10, 'Telefone inválido'),
  customer_cep: z.string().min(8, 'CEP inválido'),
  customer_address: z.string().min(5, 'Endereço é obrigatório'),
  customer_city: z.string().min(2, 'Cidade é obrigatória'),
  customer_state: z.string().min(2, 'Estado é obrigatório'),
  payment_method: z.enum(['pix', 'credit_card']),
  card_number: z.string().optional(),
  card_holder: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, getTotalWithDiscount, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'pix',
    },
  });

  const pixDiscount = 5;
  const total = paymentMethod === 'pix' ? getTotalWithDiscount(pixDiscount) : getTotal();

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const order = await createOrder.mutateAsync({
        formData: data,
        cartItems: items,
        total,
      });

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate(`/rastreio?pedido=${order.id}`);
    } catch (error) {
      toast.error('Erro ao processar pedido. Tente novamente.');
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Button onClick={() => navigate('/')}>
            Continuar comprando
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal info */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold mb-4">Dados Pessoais</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="customer_name">Nome Completo *</Label>
                    <Input
                      id="customer_name"
                      {...register('customer_name')}
                      placeholder="Seu nome completo"
                    />
                    {errors.customer_name && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      {...register('customer_email')}
                      placeholder="seu@email.com"
                    />
                    {errors.customer_email && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="customer_phone"
                      {...register('customer_phone')}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.customer_phone && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold mb-4">Endereço de Entrega</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_cep">CEP *</Label>
                    <Input
                      id="customer_cep"
                      {...register('customer_cep')}
                      placeholder="00000-000"
                    />
                    {errors.customer_cep && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_cep.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="customer_address">Endereço Completo *</Label>
                    <Input
                      id="customer_address"
                      {...register('customer_address')}
                      placeholder="Rua, número, complemento"
                    />
                    {errors.customer_address && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_address.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_city">Cidade *</Label>
                    <Input
                      id="customer_city"
                      {...register('customer_city')}
                      placeholder="São Paulo"
                    />
                    {errors.customer_city && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_state">Estado *</Label>
                    <Input
                      id="customer_state"
                      {...register('customer_state')}
                      placeholder="SP"
                    />
                    {errors.customer_state && (
                      <p className="text-destructive text-sm mt-1">{errors.customer_state.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold mb-4">Forma de Pagamento</h2>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setPaymentMethod(value as PaymentMethod);
                    setValue('payment_method', value as PaymentMethod);
                  }}
                  className="space-y-3"
                >
                  <label
                    htmlFor="pix"
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pix" id="pix" />
                      <QrCode className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold text-sm">5% OFF</span>
                  </label>

                  <label
                    htmlFor="credit_card"
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Em até 12x</p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>

                {/* Credit card fields */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="card_number">Número do Cartão</Label>
                      <Input
                        id="card_number"
                        {...register('card_number')}
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="card_holder">Nome no Cartão</Label>
                      <Input
                        id="card_holder"
                        {...register('card_holder')}
                        placeholder="Nome como está no cartão"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_expiry">Validade</Label>
                      <Input
                        id="card_expiry"
                        {...register('card_expiry')}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_cvv">CVV</Label>
                      <Input
                        id="card_cvv"
                        {...register('card_cvv')}
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
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
                    Finalizar Pedido - {formatCurrency(total)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border sticky top-4">
              <h2 className="font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image_url || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                      <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-border my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-success">
                    <span>Desconto PIX (5%)</span>
                    <span>-{formatCurrency(getTotal() * 0.05)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-success">Grátis</span>
                </div>
              </div>

              <hr className="border-border my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
