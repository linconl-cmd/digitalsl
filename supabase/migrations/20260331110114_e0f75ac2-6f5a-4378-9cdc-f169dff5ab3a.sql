
-- Create products table for the digital certificates store
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  icon TEXT NOT NULL DEFAULT 'shield',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial products
INSERT INTO public.products (name, description, price, icon, active) VALUES
('e-CPF A1', 'Validade de 1 ano|Armazenado no computador|Ideal para pessoa física|Assinatura digital de documentos', 150.00, 'user', true),
('e-CPF A3', 'Validade de 1 a 3 anos|Token ou cartão inteligente|Maior segurança|Mobilidade para uso em qualquer PC', 250.00, 'user-check', true),
('e-CNPJ A1', 'Validade de 1 ano|Armazenado no computador|Ideal para empresas|Acesso a sistemas da Receita Federal', 200.00, 'building', true),
('e-CNPJ A3', 'Validade de 1 a 3 anos|Token ou cartão inteligente|Máxima segurança empresarial|Emissão de NF-e e NFS-e', 350.00, 'building-2', true),
('NF-e A1', 'Validade de 1 ano|Emissão de Nota Fiscal Eletrônica|Instalação no servidor|Ideal para grande volume', 200.00, 'file-text', true),
('NF-e A3', 'Validade de 1 a 3 anos|Token USB ou Cartão|Emissão de NF-e segura|Compatível com todos os sistemas', 300.00, 'file-check', true);
