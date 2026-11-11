CREATE TABLE public.portal_checks (
  city text PRIMARY KEY,
  ok boolean NOT NULL,
  signature text NOT NULL,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  script_version text,
  changed_at timestamptz NOT NULL DEFAULT now(),
  last_check_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.portal_checks TO service_role;
ALTER TABLE public.portal_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to portal_checks" ON public.portal_checks FOR ALL TO service_role USING (true) WITH CHECK (true);