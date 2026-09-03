ALTER TABLE public.bookings
  ADD COLUMN assigned_to_script boolean NOT NULL DEFAULT false,
  ADD COLUMN assigned_to_script_at timestamp with time zone;