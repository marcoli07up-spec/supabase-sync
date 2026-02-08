-- Add UPDATE policy for anonymous users on orders table
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (true);