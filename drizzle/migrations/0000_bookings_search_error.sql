alter table public.bookings
  add column search_error text,
  add column search_error_at timestamptz;