import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CreditCard, QrCode, Lock, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Layout } from '@/components/layout';
import { CheckoutSteps, CheckoutUpsell } from '@/components/checkout';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';
import { CheckoutFormData, PaymentMethod, Product } from '@/types';

const personalInfoSchema = z.object({
  customer_name: z.string().min(3, 'Nome completo é obrigatório'),
  customer_email: z.string().email('Email inválido'),
  customer_phone: z.string().min(10, 'Telefone inválido'),
});

const addressSchema = z.object({
  customer_cep: z.string().min(8, 'CEP inválido'),
  customer_address: z.string().min(5, 'Endereço é obrigatório'),
  customer_city: z.string().min(2, 'Cidade é obrigatória'),
  customer_state: z.string().min(2, 'Estado é obrigatório'),
});

const paymentSchema = z.object({
  payment_method: z.enum(['pix', 'credit_card']),
  card_number: z.string().optional(),
  card_holder: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
});

const fullSchema = personalInfoSchema.merge(addressSchema).merge(paymentSchema);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, getTotalWithDiscount, clearCart, addItem } = useCart();
  const createOrder = useCreateOrder();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      payment_method: 'pix',
    },
  });

  const pixDiscount = 5;
  const total = paymentMethod === 'pix' ? getTotalWithDiscount(pixDiscount) : getTotal();

  const handleNextStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await trigger(['customer_name', 'customer_email', 'customer_phone']);
    } else if (currentStep === 2) {
      isValid = await trigger(['customer_cep', 'customer_address', 'customer_city', 'customer_state']);
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAddUpsellProduct = (product: Product) => {
    addItem(product, 1);
    toast.success('Produto adicionado ao pedido!');
  };

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
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao carrinho para finalizar sua compra
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Continuar comprando
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const cartProductIds = items.map(item => item.product.id);

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
        <h1 className="text-2xl font-bold mb-6 text-center">Finalizar Compra</h1>

        {/* Steps indicator */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal info + Upsell + Order Summary */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Dados Pessoais</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="customer_name">Nome Completo *</Label>
                        <Input
                          id="customer_name"
                          {...register('customer_name')}
                          placeholder="Seu nome completo"
                          className="mt-1"
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
                          className="mt-1"
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
                          className="mt-1"
                        />
                        {errors.customer_phone && (
                          <p className="text-destructive text-sm mt-1">{errors.customer_phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upsell */}
                  <CheckoutUpsell 
                    cartProductIds={cartProductIds} 
                    onAddProduct={handleAddUpsellProduct} 
                  />

                  {/* Order summary in step 1 */}
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Resumo do Pedido</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3">
                          <img
                            src={item.product.image_url || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="button" size="lg" className="w-full" onClick={handleNextStep}>
                    Continuar para Endereço
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Endereço de Entrega</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer_cep">CEP *</Label>
                        <Input
                          id="customer_cep"
                          {...register('customer_cep')}
                          placeholder="00000-000"
                          className="mt-1"
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
                          className="mt-1"
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
                          className="mt-1"
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
                          className="mt-1"
                        />
                        {errors.customer_state && (
                          <p className="text-destructive text-sm mt-1">{errors.customer_state.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button type="button" size="lg" className="flex-1" onClick={handleNextStep}>
                      Continuar para Pagamento
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Forma de Pagamento</h2>
                    
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
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="pix" id="pix" />
                          <QrCode className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">PIX</p>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <span className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1 rounded-full">
                          5% OFF
                        </span>
                      </label>

                      <label
                        htmlFor="credit_card"
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <CreditCard className="h-6 w-6" />
                          <div>
                            <p className="font-medium">Cartão de Crédito</p>
                            <p className="text-sm text-muted-foreground">Em até 12x</p>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>

                    {/* Credit card fields */}
                    {paymentMethod === 'credit_card' && (
                      <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label htmlFor="card_number">Número do Cartão</Label>
                          <Input
                            id="card_number"
                            {...register('card_number')}
                            placeholder="0000 0000 0000 0000"
                            className="mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="card_holder">Nome no Cartão</Label>
                          <Input
                            id="card_holder"
                            {...register('card_holder')}
                            placeholder="Nome como está no cartão"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_expiry">Validade</Label>
                          <Input
                            id="card_expiry"
                            {...register('card_expiry')}
                            placeholder="MM/AA"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_cvv">CVV</Label>
                          <Input
                            id="card_cvv"
                            {...register('card_cvv')}
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
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
                          Finalizar - {formatCurrency(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
              <h2 className="font-semibold mb-4">Resumo</h2>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Itens ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
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

              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
