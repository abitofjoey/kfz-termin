ALTER TABLE public.bookings
  ADD COLUMN rebook_token uuid UNIQUE,
  ADD COLUMN rebook_offered_at timestamptz,
  ADD COLUMN rebook_used_at timestamptz,
  ADD COLUMN refund_claimed_at timestamptz,
  ADD COLUMN refunded_at timestamptz,
  ADD COLUMN stripe_refund_id text,
  ADD COLUMN refund_error text;