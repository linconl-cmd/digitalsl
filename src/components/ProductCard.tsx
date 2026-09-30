import { useState } from "react";
import { MessageCircle, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { iconMap } from "@/lib/icons";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { trackAdsConversion } from "@/components/AnalyticsTags";
import { useSettings } from "@/hooks/useSettings";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  productMessage: string;
}

export default function ProductCard({ product, whatsappNumber, productMessage }: ProductCardProps) {
  const { data: settings } = useSettings();
  const Icon = iconMap[product.icon] || iconMap.shield;
  const benefits = product.description.split("|");
  const [period, setPeriod] = useState<"12" | "24">("12");

  const currentPrice = product.has_periods
    ? (period === "12" ? (product.price_12m ?? product.price) : (product.price_24m ?? product.price))
    : product.price;

  const currentOriginalPrice = product.has_periods
    ? (period === "12" ? product.original_price_12m : product.original_price_24m)
    : product.original_price;

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] flex flex-col h-full">
      <div className="mb-4 inline-flex self-start rounded-xl p-3" style={{ background: "var(--gradient-primary)" }}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3 leading-snug">{product.name}</h3>

      {product.has_periods && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPeriod("12")}
            className={`flex-1 rounded-lg py-2 px-3 text-sm font-semibold transition-all border ${
              period === "12"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            12 meses
          </button>
          <button
            onClick={() => setPeriod("24")}
            className={`flex-1 rounded-lg py-2 px-3 text-sm font-semibold transition-all border ${
              period === "24"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            24 meses
          </button>
        </div>
      )}

      <ul className="space-y-2 mb-6 flex-1">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
            {b.trim()}
          </li>
        ))}
      </ul>

      <div className="mb-5 mt-auto">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">A partir de</span>
        {currentOriginalPrice && currentOriginalPrice > currentPrice ? (
          <p className="text-sm text-muted-foreground line-through leading-tight mt-1">
            R$ {currentOriginalPrice.toFixed(2).replace(".", ",")}
          </p>
        ) : null}
        <p className="text-3xl font-black gradient-text leading-none mt-1">
          R$ {currentPrice.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Pagamento online (Pix) ainda não está no ar — botão fica
                desabilitado até o checkout ser publicado */}
            <span className="flex-1">
              <Button disabled className="w-full gap-2 font-semibold">
                <ShoppingCart className="h-4 w-4" />
                Comprar — em breve
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pagamento online chegando em breve. Por enquanto, compre pelo WhatsApp.</p>
          </TooltipContent>
        </Tooltip>

        <a
          href={generateWhatsAppLink(whatsappNumber, productMessage, product.name, currentPrice)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dúvidas ou comprar pelo WhatsApp"
          onClick={() => {
            const adsId = settings?.google_ads_conversion_id?.trim();
            const label = settings?.google_ads_conversion_label?.trim();
            if (adsId && label) {
              trackAdsConversion(adsId, label, {
                value: currentPrice,
                currency: "BRL",
                transaction_id: `${product.id}-${Date.now()}`,
              });
            }
            // GA4 generic event
            // @ts-expect-error gtag injected at runtime
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
              // @ts-expect-error gtag injected at runtime
              window.gtag("event", "whatsapp_purchase_click", {
                product_name: product.name,
                value: currentPrice,
                currency: "BRL",
              });
            }
          }}
        >
          <Button
            variant="outline"
            className="gap-2 border-[hsl(142,70%,45%)] text-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,45%)] hover:text-primary-foreground font-semibold"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Dúvidas?</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
