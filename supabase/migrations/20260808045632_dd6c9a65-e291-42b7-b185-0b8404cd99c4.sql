CREATE OR REPLACE FUNCTION public.create_initial_order_tracking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.order_tracking (order_id, status, description, location)
  VALUES (NEW.id, 'confirmed', 'Order has been confirmed and is being processed', 'Warehouse');
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.create_initial_order_tracking() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.create_initial_order_tracking();