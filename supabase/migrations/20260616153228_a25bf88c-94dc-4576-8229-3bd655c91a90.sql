-- Add anonymized_at marker
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS anonymized_at timestamptz NULL;

-- Anonymisation function: clears sensitive fields 90 days after the latest
-- selected_dates entry (fallback: 180 days after created_at if dates missing).
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
  RETURN affected;
END;
$$;

-- Hard delete after 10 years (tax retention period)
CREATE OR REPLACE FUNCTION public.delete_ancient_bookings()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  WITH deleted AS (
    DELETE FROM public.bookings
    WHERE created_at < now() - interval '10 years'
    RETURNING 1
  )
  SELECT count(*)::int INTO affected FROM deleted;
  RETURN affected;
END;
$$;

-- Daily cron job at 03:15
SELECT cron.schedule(
  'anonymize-old-bookings',
  '15 3 * * *',
  $$ SELECT public.anonymize_old_bookings(); SELECT public.delete_ancient_bookings(); $$
);
