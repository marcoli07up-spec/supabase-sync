-- Add tracking_code column to orders table
ALTER TABLE public.orders 
ADD COLUMN tracking_code TEXT;

-- Create function to generate Jadlog tracking code
CREATE OR REPLACE FUNCTION public.generate_jadlog_tracking_code()
RETURNS TRIGGER AS $$
DECLARE
  tracking_suffix TEXT;
BEGIN
  -- Generate tracking code in Jadlog format: JL + 8 chars from UUID + BR
  tracking_suffix := UPPER(REPLACE(LEFT(NEW.id::text, 8), '-', ''));
  NEW.tracking_code := 'JL' || tracking_suffix || 'BR';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking code on order insert
CREATE TRIGGER generate_tracking_code_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_jadlog_tracking_code();

-- Update existing orders to have tracking codes
UPDATE public.orders
SET tracking_code = 'JL' || UPPER(REPLACE(LEFT(id::text, 8), '-', '')) || 'BR'
WHERE tracking_code IS NULL;