ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS birth_date date NULL;

CREATE OR REPLACE FUNCTION public.anonymize_old_bookings()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      birth_date = NULL,
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
$function$;

REVOKE EXECUTE ON FUNCTION public.anonymize_old_bookings() FROM PUBLIC, anon, authenticated;