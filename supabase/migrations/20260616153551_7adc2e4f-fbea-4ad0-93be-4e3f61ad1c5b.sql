REVOKE EXECUTE ON FUNCTION public.anonymize_old_bookings() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_ancient_bookings() FROM PUBLIC, anon, authenticated;