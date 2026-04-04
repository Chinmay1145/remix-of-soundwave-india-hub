-- Fix 1: order_items_public - Remove public SELECT and add owner-scoped policy
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;

CREATE POLICY "Users can view their order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

-- Fix 2: review_auth_bypass - Remove the 'OR true' bypass
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.product_reviews;

CREATE POLICY "Authenticated users can create reviews" 
ON public.product_reviews 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);