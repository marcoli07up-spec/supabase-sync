"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CreditCard, QrCode, Lock, Loader2, ShoppingBag, Zap, Truck } from 'lucide-react';
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
import { usePixSettings } from '@/hooks/usePixSettings';

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
  const { data: pixSettings } = usePixSettings();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [isProcessingPix, setIsProcessingPix] = useState(false);
  const [shippingOption, setShippingOption] = useState<'free' | 'express'>('free');

  const shippingCost = 19.90;
  const subtotal = getTotal();
  const currentShipping = shippingOption === 'express' ? shippingCost : 0;
  const totalWithShipping = subtotal + currentShipping;
  const total = paymentMethod === 'pix' ? getTotalWithDiscount(5, currentShipping) : totalWithShipping;

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

  const abandonedCartIdRef = useRef<string | null>(null);
  const hasReachedPaymentRef = useRef(false);

  const saveAbandonedCart = useCallback(async () => {
    if (items.length === 0 || hasReachedPaymentRef.current) return;
    const formData = watch();
    if (!formData.customer_email && !formData.customer_phone && currentStep < 2) return;

    const cartData = {
      customer_name: formData.customer_name || null,
      customer_email: formData.customer_email || null,
      customer_phone: formData.customer_phone || null,
      customer_cep: formData.customer_cep || null,
      customer_address: formData.customer_address ? `${formData.customer_address}, ${formData.customer_number || ''}` : null,
      customer_city: formData.customer_city || null,
      customer_state: formData.customer_state || null,
      cart_items: items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      cart_total: getTotal(),
      status: 'abandoned',
    };

    try {
      if (abandonedCartIdRef.current) {
        await supabase.from('abandoned_carts').update(cartData).eq('id', abandonedCartIdRef.current);
      } else {
        const { data } = await supabase.from('abandoned_carts').insert(cartData).select('id').single();
        if (data) abandonedCartIdRef.current = data.id;
      }
    } catch (error) {
      console.error('Failed to save abandoned cart:', error);
    }
  }, [items, currentStep, watch, getTotal]);

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
  }, []);

  useEffect(() => {
    if (currentStep === 2) saveAbandonedCart();
    if (currentStep === 3) {
      hasReachedPaymentRef.current = true;
      trackAddPaymentInfo({
        content_ids: items.map(item => item.product.id),
        content_type: 'product',
        value: getTotal(),
        currency: 'BRL',
      });
    }
  }, [currentStep, saveAbandonedCart]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('customer_phone', formatted);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('customer_cpf', formatted);
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setValue('customer_cep', formatted);
    if (formatted.length === 9) {
      const addressData = await fetchAddressFromCEP(formatted);
      if (addressData) {
        if (addressData.address) setValue('customer_address', addressData.address);
        if (addressData.city) setValue('customer_city', addressData.city);
        if (addressData.state) setValue('customer_state', addressData.state);
      }
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await trigger(['customer_name', 'customer_email', 'customer_phone', 'customer_cpf']);
    else if (currentStep === 2) isValid = await trigger(['customer_cep', 'customer_address', 'customer_number', 'customer_city', 'customer_state']);
    if (isValid) setCurrentStep(prev => prev + 1);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const purchaseData = { 
        content_ids: items.map(i => i.product.id), 
        content_type: 'product', 
        num_items: items.length, 
        value: total, 
        currency: 'BRL' 
      };

      if (data.payment_method === 'credit_card') {
        setIsProcessingCard(true);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const orderResult = await createOrder.mutateAsync({ formData: data, cartItems: items, total });
        trackPurchase(purchaseData);
        clearCart();
        navigate(`/pedido?id=${orderResult?.id}`);
        return;
      }

      // Check for WhatsApp threshold
      const thresholdEnabled = pixSettings?.whatsapp_threshold_enabled ?? true;
      const thresholdValue = pixSettings?.whatsapp_threshold_value ?? 2500;

      if (thresholdEnabled && subtotal >= thresholdValue) {
        const orderResult = await createOrder.mutateAsync({ formData: data, cartItems: items, total });
        trackPurchase(purchaseData);
        
        const orderSummary = items.map(item => 
          `• ${item.product.name} (x${item.quantity}) - ${formatCurrency(item.product.price * item.quantity)}`
        ).join('\n');

        const message = encodeURIComponent(
          `🛒 *PEDIDO - Câmeras Prime*\n\n` +
          `*Cliente:* ${data.customer_name}\n` +
          `*CPF:* ${data.customer_cpf}\n` +
          `*Telefone:* ${data.customer_phone}\n\n` +
          `*Itens do Pedido:*\n${orderSummary}\n\n` +
          `*Total:* ${formatCurrency(total)} (PIX com 5% de desconto)\n\n` +
          `Gostaria de finalizar minha compra via PIX!`
        );
        
        const phone = '554431011011';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        clearCart();
        navigate(`/pedido?id=${orderResult?.id}`);
        return;
      }

      setIsProcessingPix(true);
      const orderResult = await createOrder.mutateAsync({ formData: data, cartItems: items, total });
      trackPurchase(purchaseData);
      
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-pix-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ orderId: orderResult?.id }),
      });

      clearCart();
      navigate(`/pedido?id=${orderResult?.id}`);
    } catch (error) {
      toast.error('Erro ao processar pedido.');
      console.error(error);
    } finally {
      setIsProcessingCard(false);
      setIsProcessingPix(false);
    }
  };

  if (isProcessingCard || isProcessingPix) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold">Processando seu pedido...</h1>
        </div>
      </Layout>
    );
  }

  const OrderSummaryFlow = () => (
    <div className="bg-card p-4 md:p-6 rounded-xl border border-border">
      <h2 className="font-semibold mb-4 text-lg">Resumo do Pedido</h2>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
            </div>
            <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 mb-4">
        <h3 className="font-semibold text-sm mb-3">Opções de Frete</h3>
        <RadioGroup value={shippingOption} onValueChange={(v) => setShippingOption(v as 'free' | 'express')} className="space-y-3">
          <label htmlFor="free" className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${shippingOption === 'free' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="free" id="free" />
              <Truck className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-sm">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Até 14 dias úteis</p>
              </div>
            </div>
            <span className="text-sm font-bold text-success">Grátis</span>
          </label>
          <label htmlFor="express" className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${shippingOption === 'express' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="express" id="express" />
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Frete Expresso</p>
                <p className="text-xs text-muted-foreground">4 a 7 dias úteis</p>
              </div>
            </div>
            <span className="text-sm font-bold">{formatCurrency(shippingCost)}</span>
          </label>
        </RadioGroup>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Valor no Cartão</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frete</span>
          <span className={shippingOption === 'free' ? 'text-success font-bold' : 'font-medium'}>
            {shippingOption === 'free' ? 'Grátis' : formatCurrency(shippingCost)}
          </span>
        </div>
        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary fill-current" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Valor no PIX</span>
            </div>
            <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">5% OFF</span>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-primary leading-none">{formatCurrency(getTotalWithDiscount(5, currentShipping))}</p>
            <p className="text-[10px] text-success font-bold uppercase">Economize {formatCurrency((subtotal + currentShipping) * 0.05)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container-custom py-8 px-4">
        <CheckoutSteps currentStep={currentStep} />
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h2 className="font-semibold mb-4 text-lg">Dados Pessoais</h2>
                  <div className="grid gap-4">
                    <Input {...register('customer_name')} placeholder="Nome Completo" />
                    <Input {...register('customer_email')} placeholder="Email" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input {...register('customer_phone')} onChange={handlePhoneChange} placeholder="Telefone" />
                      <Input {...register('customer_cpf')} onChange={handleCPFChange} placeholder="CPF" />
                    </div>
                  </div>
                </div>
                <OrderSummaryFlow />
                <Button type="button" size="lg" className="w-full" onClick={handleNextStep}>Continuar para Endereço</Button>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h2 className="font-semibold mb-4 text-lg">Endereço</h2>
                  <div className="grid gap-4">
                    <Input {...register('customer_cep')} onChange={handleCEPChange} placeholder="CEP" />
                    <Input {...register('customer_address')} placeholder="Endereço" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input {...register('customer_number')} placeholder="Número" />
                      <Input {...register('customer_complement')} placeholder="Complemento" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input {...register('customer_city')} placeholder="Cidade" />
                      <Input {...register('customer_state')} placeholder="UF" maxLength={2} />
                    </div>
                  </div>
                </div>
                <OrderSummaryFlow />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => handlePrevStep()}>Voltar</Button>
                  <Button type="button" className="flex-1" onClick={handleNextStep}>Pagamento</Button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h2 className="font-semibold mb-4 text-lg">Pagamento</h2>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v as PaymentMethod); setValue('payment_method', v as PaymentMethod); }} className="space-y-3">
                    <label htmlFor="pix" className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${paymentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="pix" id="pix" />
                        <Zap className="h-6 w-6 text-primary fill-current" />
                        <div>
                          <p className="font-bold">PIX (5% OFF)</p>
                          <p className="text-xs text-muted-foreground">Aprovação imediata</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">{formatCurrency(getTotalWithDiscount(5, currentShipping))}</p>
                    </label>
                    <label htmlFor="card" className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="credit_card" id="card" />
                        <CreditCard className="h-6 w-6" />
                        <div>
                          <p className="font-bold">Cartão de Crédito</p>
                          <p className="text-xs text-muted-foreground">Até 12x sem juros</p>
                        </div>
                      </div>
                      <p className="font-bold">{formatCurrency(totalWithShipping)}</p>
                    </label>
                  </RadioGroup>
                </div>
                <OrderSummaryFlow />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => handlePrevStep()}>Voltar</Button>
                  <Button type="submit" className="flex-1 font-bold" disabled={createOrder.isPending}>
                    {createOrder.isPending ? 'Processando...' : `Pagar ${formatCurrency(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );

  function handlePrevStep() {
    setCurrentStep(prev => prev - 1);
  }
}