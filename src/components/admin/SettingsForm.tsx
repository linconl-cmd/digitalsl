import { useState, useEffect } from "react";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const SETTING_LABELS: Record<string, { label: string; description: string; multiline?: boolean }> = {
  whatsapp_number: {
    label: "Número do WhatsApp",
    description: "Formato: 5511999999999 (código do país + DDD + número, sem espaços)",
  },
  whatsapp_product_message: {
    label: "Mensagem de Compra (WhatsApp)",
    description: "Use {product_name} para o nome do produto e {price} para o preço.",
    multiline: true,
  },
  whatsapp_generic_message: {
    label: "Mensagem Genérica (WhatsApp)",
    description: "Mensagem padrão do botão 'Fale Conosco'.",
    multiline: true,
  },
  hero_title: {
    label: "Título Principal (Hero)",
    description: "Título exibido na seção principal do site.",
  },
  hero_subtitle: {
    label: "Subtítulo (Hero)",
    description: "Texto abaixo do título principal.",
    multiline: true,
  },
  footer_phone_display: {
    label: "Telefone exibido no Rodapé",
    description: "Número formatado que aparece no rodapé, ex: (11) 99999-9999",
  },
  footer_email: {
    label: "E-mail de Contato (Rodapé)",
    description: "E-mail exibido na seção de contato do rodapé.",
  },
  footer_location: {
    label: "Localização (Rodapé)",
    description: "Cidade/estado exibido no rodapé.",
  },
  footer_cnpj: {
    label: "CNPJ (Rodapé)",
    description: "CNPJ exibido no rodapé do site.",
  },
  gtm_container_id: {
    label: "Google Tag Manager — ID do Container",
    description: "Formato: GTM-XXXXXXX. Centraliza o gerenciamento de todas as tags (recomendado).",
  },
  ga4_measurement_id: {
    label: "Google Analytics 4 — Measurement ID",
    description: "Formato: G-XXXXXXXXXX. Necessário para métricas de tráfego e comportamento.",
  },
  google_ads_conversion_id: {
    label: "Google Ads — ID de Conversão",
    description: "Formato: AW-XXXXXXXXX. Usado para remarketing e rastreamento de campanhas pagas.",
  },
  google_ads_conversion_label: {
    label: "Google Ads — Label de Conversão (compra)",
    description: "Label que dispara quando o cliente clica em 'Comprar via WhatsApp'. Ex: AbC-D_efGhIj1k2L.",
  },
  search_console_verification: {
    label: "Google Search Console — Código de Verificação",
    description: "Cole apenas o valor do atributo content da meta tag fornecida pelo Search Console.",
  },
  google_site_verification_meta: {
    label: "Verificação Adicional (Google)",
    description: "Opcional: outro código de verificação google-site-verification (ex: Merchant Center).",
  },
};

const SETTING_ORDER = [
  "whatsapp_number",
  "whatsapp_product_message",
  "whatsapp_generic_message",
  "hero_title",
  "hero_subtitle",
  "footer_phone_display",
  "footer_email",
  "footer_location",
  "footer_cnpj",
  "gtm_container_id",
  "ga4_measurement_id",
  "google_ads_conversion_id",
  "google_ads_conversion_label",
  "search_console_verification",
  "google_site_verification_meta",
];

export default function SettingsForm({ onClose }: { onClose: () => void }) {
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = SETTING_ORDER.map((key) => {
        if (form[key] !== settings?.[key]) {
          return updateSetting.mutateAsync({ key, value: form[key] });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      toast.success("Configurações salvas com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao salvar configurações");
    }
    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Button variant="ghost" onClick={onClose} className="mb-6 gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-foreground mb-6">Configurações do Site</h1>
        <div className="space-y-5">
          {SETTING_ORDER.map((key, idx) => {
            const meta = SETTING_LABELS[key];
            if (!meta) return null;
            const isFirstIntegration = key === "gtm_container_id";
            return (
              <div key={key}>
                {isFirstIntegration && (
                  <div className="mt-8 mb-4 border-t border-border pt-6">
                    <h2 className="text-lg font-semibold text-foreground">Integrações Google</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure as IDs para habilitar Analytics, remarketing e rastreamento de conversões de tráfego pago.
                    </p>
                  </div>
                )}
                <Label>{meta.label}</Label>
                <p className="text-xs text-muted-foreground mb-1">{meta.description}</p>
                {meta.multiline ? (
                  <Textarea
                    value={form[key] || ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={form[key] || ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1"
                  />
                )}
              </div>
            );
          })}
          <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Salvar Configurações</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
