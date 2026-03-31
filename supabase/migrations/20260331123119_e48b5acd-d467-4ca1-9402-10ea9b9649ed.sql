INSERT INTO public.site_settings (key, value) VALUES
  ('footer_phone_display', '(11) 99999-9999'),
  ('footer_email', 'contato@digitalsolutions.com.br'),
  ('footer_location', 'São Paulo, SP'),
  ('footer_cnpj', '12.345.678/0001-99')
ON CONFLICT (key) DO NOTHING;