ALTER TABLE public.products
  ADD COLUMN has_periods boolean NOT NULL DEFAULT false,
  ADD COLUMN price_12m numeric DEFAULT NULL,
  ADD COLUMN original_price_12m numeric DEFAULT NULL,
  ADD COLUMN price_24m numeric DEFAULT NULL,
  ADD COLUMN original_price_24m numeric DEFAULT NULL;