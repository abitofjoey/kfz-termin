-- Ensure no client role has table privileges on bookings
REVOKE ALL ON public.bookings FROM anon;
REVOKE ALL ON public.bookings FROM authenticated;
GRANT ALL ON public.bookings TO service_role;

-- Explicit service_role policy (clarity only; service_role bypasses RLS anyway)
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
CREATE POLICY "Service role full access to bookings"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);