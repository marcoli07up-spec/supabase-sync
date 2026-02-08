-- Fix search_path for the tracking code function
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
$$ LANGUAGE plpgsql SET search_path = public;