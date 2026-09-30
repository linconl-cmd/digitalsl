import dados from "@/data/catalogo-estatico.json";
import type { Tables } from "@/integrations/supabase/types";

// Retrato do catálogo gerado no build (scripts/gerar-catalogo-estatico.mjs).
// Usado como dado inicial dos hooks para renderizar instantaneamente e
// funcionar mesmo se o banco estiver fora do ar quando a página carrega.
export const catalogoEstatico = dados as {
  geradoEm: string;
  products: Tables<"products">[];
  settings: Record<string, string>;
};
