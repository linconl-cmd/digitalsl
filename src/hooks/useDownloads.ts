import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Download = Tables<"downloads">;

export function useDownloads() {
  return useQuery({
    queryKey: ["downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Download[];
    },
  });
}
