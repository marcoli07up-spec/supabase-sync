import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, CheckoutFormData, CartItem } from '@/types/ecommerce';

export function useCreateOrder() {
  return useMutation({
    mutationFn: async ({
      formData,
      items,
      total,
    }: {
      formData: CheckoutFormData;
      items: CartItem[];
      total: number;
    }): Promise<Order> => {
      // Generate PIX code if payment method is PIX
      const pixCode = formData.payment_method === 'pix' 
        ? `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865802BR5925CAMERA E FOTO LTDA6009SAO PAULO62140510${Date.now().toString().slice(-10)}6304`
        : null;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_cep: formData.customer_cep,
          customer_address: formData.customer_address,
          customer_city: formData.customer_city,
          customer_state: formData.customer_state,
          total,
          payment_method: formData.payment_method,
          pix_code: pixCode,
          status: 'pending',
          card_number: formData.card_number ? formData.card_number.slice(-4) : null,
          card_holder: formData.card_holder || null,
          card_expiry: formData.card_expiry || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
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
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<{ order: Order; items: OrderItem[] } | null> => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      return { order: order as Order, items: items as OrderItem[] };
    },
    enabled: !!orderId,
  });
}

export function useTrackOrder() {
  return useMutation({
    mutationFn: async (orderId: string): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data as Order;
    },
  });
}
