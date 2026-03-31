import { useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  productMessage: string;
}

export default function ProductCard({ product, whatsappNumber, productMessage }: ProductCardProps) {
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
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] flex flex-col h-full">
      <div className="mb-4 inline-flex self-start rounded-xl p-3" style={{ background: "var(--gradient-primary)" }}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3">{product.name}</h3>

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
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
            {b.trim()}
          </li>
        ))}
      </ul>

      <div className="mb-4 mt-auto">
        <span className="text-sm text-muted-foreground">A partir de</span>
        {currentOriginalPrice && currentOriginalPrice > currentPrice ? (
          <p className="text-lg text-muted-foreground line-through">
            R$ {currentOriginalPrice.toFixed(2).replace(".", ",")}
          </p>
        ) : null}
        <p className="text-3xl font-black gradient-text">
          R$ {currentPrice.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <a href={generateWhatsAppLink(whatsappNumber, productMessage, product.name, currentPrice)} target="_blank" rel="noopener noreferrer">
        <Button className="w-full gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground font-semibold">
          <MessageCircle className="h-4 w-4" />
          Comprar via WhatsApp
        </Button>
      </a>
    </div>
  );
}
