
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  service_type text NOT NULL,
  salutation text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  fin_1 text NOT NULL,
  selected_dates text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'open',
  paid boolean NOT NULL DEFAULT false,
  notes text,
  stripe_session_id text
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) may create a booking (form submission). No SELECT/UPDATE/DELETE for anon.
CREATE POLICY "Anyone can create a booking"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX bookings_email_idx ON public.bookings (email);
CREATE INDEX bookings_stripe_session_idx ON public.bookings (stripe_session_id);
