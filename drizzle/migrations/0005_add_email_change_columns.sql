ALTER TABLE public.bookings
  ADD COLUMN email_change_token uuid UNIQUE,
  ADD COLUMN email_changed_at timestamptz;