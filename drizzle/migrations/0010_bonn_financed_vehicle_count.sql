ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS financed boolean NOT NULL DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_count smallint;