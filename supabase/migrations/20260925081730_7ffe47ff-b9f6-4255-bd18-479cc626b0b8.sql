alter table public.bookings
  add column search_result text check (search_result in ('found')),
  add column appointment_at timestamptz,
  add column found_at timestamptz,
  add column result_notified_at timestamptz;