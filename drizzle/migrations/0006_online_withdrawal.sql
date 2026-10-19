ALTER TABLE public.bookings ADD COLUMN withdraw_token uuid UNIQUE DEFAULT gen_random_uuid();
ALTER TABLE public.bookings ADD COLUMN withdrawn_at timestamptz;

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_search_result_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_search_result_check
  CHECK (search_result IS NULL OR search_result IN ('found', 'not_found', 'withdrawn'));

CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  contract_reference text,
  booking_id uuid,
  source text NOT NULL CHECK (source IN ('link', 'formular')),
  outcome text CHECK (outcome IS NULL OR outcome IN ('erstattet', 'manuell', 'bereits_erstattet', 'termin_gefunden')),
  processed_at timestamptz,
  anonymized_at timestamptz
);
CREATE INDEX withdrawals_email_created_idx ON public.withdrawals (lower(email), created_at);
CREATE INDEX withdrawals_booking_idx ON public.withdrawals (booking_id);

GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to withdrawals" ON public.withdrawals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.anonymize_old_bookings()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  WITH updated AS (
    UPDATE public.bookings
    SET
      phone = '',
      fin_1 = 'XXXX',
      fin_2 = NULL,
      fin_3 = NULL,
      selected_dates = '{}',
      notes = NULL,
      anonymized_at = now()
    WHERE anonymized_at IS NULL
      AND (
        (
          selected_dates IS NOT NULL
          AND array_length(selected_dates, 1) > 0
          AND (
            SELECT max(d::date) FROM unnest(selected_dates) d
          ) < (current_date - interval '90 days')
        )
        OR (
          (selected_dates IS NULL OR array_length(selected_dates, 1) IS NULL)
          AND created_at < now() - interval '180 days'
        )
      )
    RETURNING 1
  )
  SELECT count(*)::int INTO affected FROM updated;

  UPDATE public.withdrawals w
  SET name = '', email = '', contract_reference = NULL, anonymized_at = now()
  WHERE w.anonymized_at IS NULL
    AND (
      (w.booking_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.bookings b WHERE b.id = w.booking_id AND b.anonymized_at IS NOT NULL
      ))
      OR (w.booking_id IS NULL AND w.created_at < now() - interval '180 days')
      OR (w.booking_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.bookings b WHERE b.id = w.booking_id
      ))
    );

  RETURN affected;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.anonymize_old_bookings() FROM PUBLIC, anon, authenticated;