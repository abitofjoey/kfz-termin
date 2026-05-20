
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

CREATE POLICY "Anyone can create a booking with valid data"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(email) > 3
    AND char_length(first_name) > 0
    AND char_length(last_name) > 0
    AND paid = false
    AND status = 'open'
  );
