CREATE OR REPLACE FUNCTION public.delete_abandoned_bookings()
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
    WHERE paid = false
      AND created_at < now() - interval '30 days'
    RETURNING 1
  )
  SELECT count(*)::int INTO affected FROM deleted;
  RETURN affected;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.delete_abandoned_bookings() FROM PUBLIC, anon, authenticated;

CREATE TABLE public.script_version_lag (
  city text PRIMARY KEY,
  script_version text NOT NULL,
  current_version text NOT NULL,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  alert_sent_at timestamptz NULL
);
GRANT ALL ON public.script_version_lag TO service_role;
ALTER TABLE public.script_version_lag ENABLE ROW LEVEL SECURITY;