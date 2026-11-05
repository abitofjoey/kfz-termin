ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount_cents integer;
UPDATE public.bookings SET amount_cents = 999 WHERE amount_cents IS NULL;