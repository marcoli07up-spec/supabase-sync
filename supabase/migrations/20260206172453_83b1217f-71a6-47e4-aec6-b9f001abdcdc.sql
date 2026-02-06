-- Add CPF field to orders table
ALTER TABLE public.orders 
ADD COLUMN customer_cpf TEXT;

-- Create index for CPF lookup on tracking
CREATE INDEX idx_orders_customer_cpf ON public.orders(customer_cpf);