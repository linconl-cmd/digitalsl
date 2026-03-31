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
          {SETTING_ORDER.map((key) => {
            const meta = SETTING_LABELS[key];
            if (!meta) return null;
            return (
              <div key={key}>
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
