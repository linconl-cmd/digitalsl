INSERT INTO public.site_settings (key, value) VALUES
  ('gtm_container_id', ''),
  ('ga4_measurement_id', ''),
  ('google_ads_conversion_id', ''),
  ('google_ads_conversion_label', ''),
  ('search_console_verification', ''),
  ('google_site_verification_meta', '')
ON CONFLICT (key) DO NOTHING;