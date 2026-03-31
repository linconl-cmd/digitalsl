
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can update settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete settings" ON public.site_settings
  FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp_number', '5511999999999'),
  ('whatsapp_product_message', 'Olá Digital Solutions, gostaria de adquirir o certificado: {product_name} - Valor: R$ {price}'),
  ('whatsapp_generic_message', 'Olá Digital Solutions, gostaria de mais informações sobre os certificados digitais.'),
  ('hero_title', 'Emita seu Certificado Digital de forma Rápida e Segura'),
  ('hero_subtitle', 'Somos especialistas em certificação digital. Atendimento rápido, preços competitivos e suporte completo para você ou sua empresa.');
