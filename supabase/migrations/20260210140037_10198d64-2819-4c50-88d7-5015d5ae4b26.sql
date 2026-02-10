
-- Add PodPay transaction fields to orders
ALTER TABLE public.orders 
ADD COLUMN podpay_transaction_id text,
ADD COLUMN pix_qr_code text,
ADD COLUMN pix_qr_code_image text;
