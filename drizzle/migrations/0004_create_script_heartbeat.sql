CREATE TABLE public.script_heartbeat (
  city text PRIMARY KEY,
  last_poll_at timestamptz NOT NULL,
  alert_sent_at timestamptz
);
GRANT ALL ON public.script_heartbeat TO service_role;
REVOKE ALL ON public.script_heartbeat FROM anon, authenticated;
ALTER TABLE public.script_heartbeat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to script_heartbeat" ON public.script_heartbeat FOR ALL TO service_role USING (true) WITH CHECK (true);