-- ORDERS: require authenticated ownership
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order by order_number" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT TO authenticated
USING (user_id = auth.uid());

REVOKE ALL ON public.orders FROM anon;

-- ORDER ITEMS
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

CREATE POLICY "Users can create items for their own orders"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
));

CREATE POLICY "Users can view items for their own orders"
ON public.order_items FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
));

REVOKE ALL ON public.order_items FROM anon;

-- ORDER TRACKING
DROP POLICY IF EXISTS "Anyone can view tracking" ON public.order_tracking;
DROP POLICY IF EXISTS "System can create tracking" ON public.order_tracking;

CREATE POLICY "Users can view tracking for their own orders"
ON public.order_tracking FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_tracking.order_id AND o.user_id = auth.uid()
));

REVOKE ALL ON public.order_tracking FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.order_tracking FROM authenticated;
GRANT ALL ON public.order_tracking TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;

-- Trigger-only SECURITY DEFINER functions should not be directly callable
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_order_status_from_tracking() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;