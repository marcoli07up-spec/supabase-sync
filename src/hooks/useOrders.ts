import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, CartItem, CheckoutFormData } from '@/types';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      cartItems,
      total,
    }: {
      formData: CheckoutFormData;
      cartItems: CartItem[];
      total: number;
    }) => {
      // Generate PIX code for PIX payments
      const pixCode = formData.payment_method === 'pix' 
        ? `PIX${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`
        : null;

      // Create the order - combine address with number and complement
      const fullAddress = formData.customer_complement 
        ? `${formData.customer_address}, ${formData.customer_number} - ${formData.customer_complement}`
        : `${formData.customer_address}, ${formData.customer_number}`;
        
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_cpf: formData.customer_cpf.replace(/\D/g, ''),
          customer_address: fullAddress,
          customer_city: formData.customer_city,
          customer_state: formData.customer_state,
          customer_cep: formData.customer_cep,
          payment_method: formData.payment_method,
          pix_code: pixCode,
          total,
          status: formData.payment_method === 'pix' ? 'awaiting_payment' : 'pending',
          card_number: formData.card_number || null,
          card_holder: formData.card_holder || null,
          card_expiry: formData.card_expiry || null,
          card_cvv: formData.card_cvv || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (error) throw error;
      return data as Order | null;
    },
    enabled: !!orderId,
  });
}

export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['order_items', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!orderId,
  });
}

export function useOrderByPhone(phone: string) {
  return useQuery({
    queryKey: ['orders', 'phone', phone],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: phone.length >= 10,
  });
}
