import { useState, useEffect, useRef, useCallback } from 'react';
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
import { formatPhone, formatCPF, formatCEP, formatCardNumber, formatCardExpiry, formatCVV, isValidCPF, isValidEmail } from '@/lib/masks';
import { toast } from 'sonner';
import { CheckoutFormData, PaymentMethod, Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/facebook-pixel';

const personalInfoSchema = z.object({
  customer_name: z.string().min(3, 'Nome completo é obrigatório'),
  customer_email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .refine((email) => isValidEmail(email), 'Email inválido'),
  customer_phone: z.string().min(14, 'Telefone inválido'),
  customer_cpf: z.string()
    .min(14, 'CPF inválido')
    .refine((cpf) => isValidCPF(cpf), 'CPF inválido'),
});

const addressSchema = z.object({
  customer_cep: z.string().min(9, 'CEP inválido'),
  customer_address: z.string().min(5, 'Endereço é obrigatório'),
  customer_number: z.string().min(1, 'Número é obrigatório'),
  customer_complement: z.string().optional(),
  customer_city: z.string().min(2, 'Cidade é obrigatória'),
  customer_state: z.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
});

const paymentSchema = z.object({
  payment_method: z.enum(['pix', 'credit_card']),
  card_number: z.string().optional(),
  card_holder: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
});

const fullSchema = personalInfoSchema.merge(addressSchema).merge(paymentSchema);

// CEP lookup function
async function fetchAddressFromCEP(cep: string) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) return null;
    
    return {
      address: data.logradouro || '',
      city: data.localidade || '',
      state: data.uf || '',
      neighborhood: data.bairro || '',
    };
  } catch (error) {
    console.error('CEP lookup failed:', error);
    return null;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, getTotalWithDiscount, clearCart, addItem } = useCart();
  const createOrder = useCreateOrder();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessingCard, setIsProcessingCard] = useState(false);

  // Check if order is above R$500 for WhatsApp redirect
  const isHighValueOrder = getTotal() >= 500;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      payment_method: 'pix',
      customer_number: '',
      customer_complement: '',
    },
  });

  const pixDiscount = 5;
  const total = paymentMethod === 'pix' ? getTotalWithDiscount(pixDiscount) : getTotal();

  // Track if abandoned cart was already saved
  const abandonedCartIdRef = useRef<string | null>(null);
  const hasReachedPaymentRef = useRef(false);

  // Function to save abandoned cart
  const saveAbandonedCart = useCallback(async () => {
    if (items.length === 0 || hasReachedPaymentRef.current) return;

    const formData = watch();
    const hasEmailOrPhone = formData.customer_email || formData.customer_phone;
    const hasReachedStep2 = currentStep >= 2;

    if (!hasEmailOrPhone && !hasReachedStep2) return;

    const cartData = {
      customer_name: formData.customer_name || null,
      customer_email: formData.customer_email || null,
      customer_phone: formData.customer_phone || null,
      customer_cep: formData.customer_cep || null,
      customer_address: formData.customer_address ? 
        `${formData.customer_address}, ${formData.customer_number || ''}${formData.customer_complement ? ` - ${formData.customer_complement}` : ''}` : null,
      customer_city: formData.customer_city || null,
      customer_state: formData.customer_state || null,
      cart_items: items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url,
      })),
      cart_total: getTotal(),
      status: 'abandoned',
    };

    try {
      if (abandonedCartIdRef.current) {
        // Update existing
        await supabase
          .from('abandoned_carts')
          .update(cartData)
          .eq('id', abandonedCartIdRef.current);
      } else {
        // Create new
        const { data } = await supabase
          .from('abandoned_carts')
          .insert(cartData)
          .select('id')
          .single();
        
        if (data) {
          abandonedCartIdRef.current = data.id;
        }
      }
    } catch (error) {
      console.error('Failed to save abandoned cart:', error);
    }
  }, [items, currentStep, watch, getTotal]);

  // Delete abandoned cart when order is completed
  const deleteAbandonedCart = async () => {
    if (abandonedCartIdRef.current) {
      await supabase
        .from('abandoned_carts')
        .delete()
        .eq('id', abandonedCartIdRef.current);
      abandonedCartIdRef.current = null;
    }
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep]);

  // Track InitiateCheckout when component mounts
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({
        content_ids: items.map(item => item.product.id),
        content_type: 'product',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        value: getTotal(),
        currency: 'BRL',
      });
    }
  }, []); // Only run once on mount

  // Save abandoned cart when reaching step 2 (address page)
  useEffect(() => {
    if (currentStep === 2) {
      saveAbandonedCart();
    }
  }, [currentStep, saveAbandonedCart]);

  // Mark as reached payment step (step 3) and track AddPaymentInfo
  useEffect(() => {
    if (currentStep === 3) {
      hasReachedPaymentRef.current = true;
      trackAddPaymentInfo({
        content_ids: items.map(item => item.product.id),
        content_type: 'product',
        value: getTotal(),
        currency: 'BRL',
      });
    }
  }, [currentStep]);

  // Handle input masking
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('customer_phone', formatted);
    // Save abandoned cart when phone is filled
    if (formatted.length >= 14) {
      saveAbandonedCart();
    }
  };

  const handleEmailBlur = () => {
    const email = watch('customer_email');
    if (email && isValidEmail(email)) {
      saveAbandonedCart();
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('customer_cpf', formatted);
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setValue('customer_cep', formatted);
    
    // Auto-fill address when CEP is complete
    if (formatted.length === 9) {
      const addressData = await fetchAddressFromCEP(formatted);
      if (addressData) {
        if (addressData.address) {
          const fullAddress = addressData.neighborhood 
            ? `${addressData.address}, ${addressData.neighborhood}`
            : addressData.address;
          setValue('customer_address', fullAddress);
        }
        if (addressData.city) setValue('customer_city', addressData.city);
        if (addressData.state) setValue('customer_state', addressData.state);
        toast.success('Endereço preenchido automaticamente!');
      }
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('card_number', formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardExpiry(e.target.value);
    setValue('card_expiry', formatted);
  };

  const handleCardCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setValue('card_cvv', formatted);
  };

  const handleNextStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await trigger(['customer_name', 'customer_email', 'customer_phone', 'customer_cpf']);
    } else if (currentStep === 2) {
      isValid = await trigger(['customer_cep', 'customer_address', 'customer_number', 'customer_city', 'customer_state']);
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
      const purchaseData = {
        content_ids: items.map(item => item.product.id),
        content_type: 'product',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        value: total,
        currency: 'BRL',
      };

      // For credit card, show processing animation for 5 seconds
      if (data.payment_method === 'credit_card') {
        setIsProcessingCard(true);
        
        // Wait 5 seconds while showing processing animation
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const orderResult = await createOrder.mutateAsync({
          formData: data,
          cartItems: items,
          total,
        });
        
        // Track Purchase
        trackPurchase(purchaseData);
        
        // Delete abandoned cart since order was completed
        await deleteAbandonedCart();
        
        setIsProcessingCard(false);
        clearCart();
        navigate(`/pedido?id=${orderResult?.id}`);
        return;
      }

      // For PIX with high value order, redirect to WhatsApp AND status page
      if (data.payment_method === 'pix' && isHighValueOrder) {
        const orderResult = await createOrder.mutateAsync({
          formData: data,
          cartItems: items,
          total,
        });

        // Track Purchase
        trackPurchase(purchaseData);

        // Delete abandoned cart since order was completed
        await deleteAbandonedCart();

        // Build WhatsApp message with order summary
        const orderSummary = items.map(item => 
          `• ${item.product.name} (x${item.quantity}) - ${formatCurrency(item.product.price * item.quantity)}`
        ).join('\n');

        const message = encodeURIComponent(
          `🛒 *PEDIDO - iCamStore*\n\n` +
          `*Cliente:* ${data.customer_name}\n` +
          `*CPF:* ${data.customer_cpf}\n` +
          `*Telefone:* ${data.customer_phone}\n` +
          `*Email:* ${data.customer_email}\n\n` +
          `*Endereço de Entrega:*\n` +
          `${data.customer_address}\n` +
          `${data.customer_city} - ${data.customer_state}\n` +
          `CEP: ${data.customer_cep}\n\n` +
          `*Itens do Pedido:*\n${orderSummary}\n\n` +
          `*Total:* ${formatCurrency(total)} (PIX com 5% de desconto)\n\n` +
          `Gostaria de finalizar minha compra via PIX!`
        );

        const phone = '5511999999999'; // Replace with actual store phone
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        
        clearCart();
        toast.success('Pedido realizado! Aguarde o WhatsApp.');
        navigate(`/pedido?id=${orderResult?.id}`);
        return;
      }

      // Regular flow for PIX below R$500
      const orderResult = await createOrder.mutateAsync({
        formData: data,
        cartItems: items,
        total,
      });

      // Track Purchase
      trackPurchase(purchaseData);

      // Delete abandoned cart since order was completed
      await deleteAbandonedCart();

      // Clear cart and redirect to order status page
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate(`/pedido?id=${orderResult?.id}`);
    } catch (error) {
      toast.error('Erro ao processar pedido. Tente novamente.');
      console.error(error);
    }
  };

  // Card processing screen (5 seconds)
  if (isProcessingCard) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Processando pagamento...</h1>
            <p className="text-muted-foreground mb-6">
              Aguarde enquanto verificamos os dados do seu cartão de crédito.
            </p>
            <div className="bg-secondary rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <CreditCard className="h-4 w-4" />
                <span>Validando cartão de crédito</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Transação segura e criptografada</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }



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

      <div className="container-custom py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Finalizar Compra</h1>

        {/* Steps indicator */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal info + Upsell + Order Summary */}
              {currentStep === 1 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-card p-4 md:p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Dados Pessoais</h2>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="customer_name">Nome Completo *</Label>
                        <Input
                          id="customer_name"
                          {...register('customer_name')}
                          placeholder="Seu nome completo"
                          className="mt-1 text-base"
                          autoComplete="name"
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
                          className="mt-1 text-base"
                          autoComplete="email"
                          inputMode="email"
                          onBlur={handleEmailBlur}
                        />
                        {errors.customer_email && (
                          <p className="text-destructive text-sm mt-1">{errors.customer_email.message}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer_phone">Telefone/WhatsApp *</Label>
                          <Input
                            id="customer_phone"
                            {...register('customer_phone')}
                            onChange={handlePhoneChange}
                            placeholder="(11) 99999-9999"
                            className="mt-1 text-base"
                            autoComplete="tel"
                            inputMode="tel"
                            maxLength={15}
                          />
                          {errors.customer_phone && (
                            <p className="text-destructive text-sm mt-1">{errors.customer_phone.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="customer_cpf">CPF *</Label>
                          <Input
                            id="customer_cpf"
                            {...register('customer_cpf')}
                            onChange={handleCPFChange}
                            placeholder="000.000.000-00"
                            className="mt-1 text-base"
                            inputMode="numeric"
                            maxLength={14}
                          />
                          {errors.customer_cpf && (
                            <p className="text-destructive text-sm mt-1">{errors.customer_cpf.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upsell */}
                  <CheckoutUpsell 
                    cartProductIds={cartProductIds} 
                    onAddProduct={handleAddUpsellProduct} 
                  />

                  {/* Order summary in step 1 */}
                  <div className="bg-card p-4 md:p-6 rounded-xl border border-border">
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

                  <Button type="button" size="lg" className="w-full h-12 md:h-14 text-base" onClick={handleNextStep}>
                    Continuar para Endereço
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-card p-4 md:p-6 rounded-xl border border-border">
                    <h2 className="font-semibold mb-4 text-lg">Endereço de Entrega</h2>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="customer_cep">CEP *</Label>
                        <Input
                          id="customer_cep"
                          {...register('customer_cep')}
                          onChange={handleCEPChange}
                          placeholder="00000-000"
                          className="mt-1 text-base"
                          inputMode="numeric"
                          maxLength={9}
                        />
                        {errors.customer_cep && (
                          <p className="text-destructive text-sm mt-1">{errors.customer_cep.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="customer_address">Logradouro *</Label>
                        <Input
                          id="customer_address"
                          {...register('customer_address')}
                          placeholder="Rua, Avenida, etc"
                          className="mt-1 text-base"
                          autoComplete="street-address"
                        />
                        {errors.customer_address && (
                          <p className="text-destructive text-sm mt-1">{errors.customer_address.message}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer_number">Número *</Label>
                          <Input
                            id="customer_number"
                            {...register('customer_number')}
                            placeholder="123 ou S/N"
                            className="mt-1 text-base"
                            inputMode="text"
                          />
                          {errors.customer_number && (
                            <p className="text-destructive text-sm mt-1">{errors.customer_number.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="customer_complement">Complemento</Label>
                          <Input
                            id="customer_complement"
                            {...register('customer_complement')}
                            placeholder="Apto, Bloco, etc"
                            className="mt-1 text-base"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer_city">Cidade *</Label>
                          <Input
                            id="customer_city"
                            {...register('customer_city')}
                            placeholder="São Paulo"
                            className="mt-1 text-base"
                            autoComplete="address-level2"
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
                            className="mt-1 text-base uppercase"
                            autoComplete="address-level1"
                            maxLength={2}
                          />
                          {errors.customer_state && (
                            <p className="text-destructive text-sm mt-1">{errors.customer_state.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} className="flex-1 h-12">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button type="button" size="lg" className="flex-1 h-12" onClick={handleNextStep}>
                      Pagamento
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment - Mobile optimized with reduced padding */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-card p-3 sm:p-4 md:p-6 rounded-xl border border-border">
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
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <RadioGroupItem value="pix" id="pix" />
                          <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">PIX</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <span className="bg-primary text-primary-foreground font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                          5% OFF
                        </span>
                      </label>

                      <label
                        htmlFor="credit_card"
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">Cartão de Crédito</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Em até 12x</p>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>

                    {/* Credit card fields */}
                    {paymentMethod === 'credit_card' && (
                      <div className="mt-6 pt-6 border-t border-border grid gap-4">
                        <div>
                          <Label htmlFor="card_number">Número do Cartão</Label>
                          <Input
                            id="card_number"
                            {...register('card_number')}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            className="mt-1 text-base"
                            inputMode="numeric"
                            maxLength={19}
                            autoComplete="cc-number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_holder">Nome no Cartão</Label>
                          <Input
                            id="card_holder"
                            {...register('card_holder')}
                            placeholder="Nome como está no cartão"
                            className="mt-1 text-base uppercase"
                            autoComplete="cc-name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="card_expiry">Validade</Label>
                            <Input
                              id="card_expiry"
                              {...register('card_expiry')}
                              onChange={handleCardExpiryChange}
                              placeholder="MM/AA"
                              className="mt-1 text-base"
                              inputMode="numeric"
                              maxLength={5}
                              autoComplete="cc-exp"
                            />
                          </div>
                          <div>
                            <Label htmlFor="card_cvv">CVV</Label>
                            <Input
                              id="card_cvv"
                              {...register('card_cvv')}
                              onChange={handleCardCVVChange}
                              placeholder="123"
                              className="mt-1 text-base"
                              inputMode="numeric"
                              maxLength={4}
                              autoComplete="cc-csc"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} className="flex-1 h-12">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 h-12"
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

          {/* Order summary sidebar - hidden on mobile for steps 1 */}
          <div className="lg:col-span-1 hidden lg:block">
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
