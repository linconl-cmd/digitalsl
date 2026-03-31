import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      const settings: SiteSettings = {};
      data?.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
      return settings;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
}
