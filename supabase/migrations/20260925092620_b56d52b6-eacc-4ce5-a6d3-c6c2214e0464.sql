ALTER TABLE public.bookings DROP CONSTRAINT bookings_search_result_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_search_result_check
  CHECK (search_result IN ('found', 'not_found'));