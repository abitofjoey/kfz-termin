CREATE OR REPLACE FUNCTION public.tmp_store_script_key(k text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'script_api_key') THEN
    RETURN false;
  END IF;
  PERFORM vault.create_secret(k, 'script_api_key', 'x-script-key für /api/internal/refunds/due');
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.tmp_store_script_key(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tmp_store_script_key(text) TO service_role;