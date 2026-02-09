
CREATE POLICY "Anyone can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
ON public.categories
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
ON public.categories
FOR DELETE
USING (true);
