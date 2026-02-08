-- Add INSERT policy for anonymous users on products table
CREATE POLICY "Anyone can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Add UPDATE policy for anonymous users on products table
CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Add DELETE policy for anonymous users on products table
CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Allow SELECT of all products for admin purposes
CREATE POLICY "Anyone can view all products in admin" 
ON public.products 
FOR SELECT 
USING (true);