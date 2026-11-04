ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT 'koeln';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS locations text[] NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booked_location text NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference text NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancel_url text NULL;
CREATE INDEX IF NOT EXISTS bookings_city_pending_idx ON public.bookings (city, paid, assigned_to_script);
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = 'public.script_heartbeat'::regclass AND i.indisunique AND a.attname = 'city' AND array_length(i.indkey::int[],1) = 1
  ) THEN
    ALTER TABLE public.script_heartbeat ADD CONSTRAINT script_heartbeat_city_key UNIQUE (city);
  END IF;
END $$;