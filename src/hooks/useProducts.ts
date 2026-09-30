import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { catalogoEstatico } from "@/lib/catalogoEstatico";

export type Product = Tables<"products">;

export function useProducts(onlyActive = true) {
  return useQuery({
    queryKey: ["products", onlyActive],
    // Semente instantânea do retrato gerado no build — some assim que os
    // dados ao vivo chegam; se o banco estiver fora do ar, continua valendo
    initialData: onlyActive ? catalogoEstatico.products : undefined,
    initialDataUpdatedAt: onlyActive ? new Date(catalogoEstatico.geradoEm).getTime() : undefined,
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
      if (onlyActive) {
        query = query.eq("active", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}
