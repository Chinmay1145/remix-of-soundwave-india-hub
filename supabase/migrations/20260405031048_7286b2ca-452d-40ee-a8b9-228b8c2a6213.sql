-- Allow users to update their own orders' status
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create a trigger to auto-update order status when tracking is inserted
CREATE OR REPLACE FUNCTION public.update_order_status_from_tracking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.orders 
  SET order_status = NEW.status, updated_at = now()
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_tracking_inserted
  AFTER INSERT ON public.order_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_status_from_tracking();