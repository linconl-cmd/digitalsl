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

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
      <div className="mb-4 inline-flex rounded-xl p-3" style={{ background: "var(--gradient-primary)" }}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3">{product.name}</h3>

      <ul className="space-y-2 mb-6">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
            {b.trim()}
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <span className="text-sm text-muted-foreground">A partir de</span>
        <p className="text-3xl font-black gradient-text">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <a href={generateWhatsAppLink(whatsappNumber, productMessage, product.name, product.price)} target="_blank" rel="noopener noreferrer">
        <Button className="w-full gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground font-semibold">
          <MessageCircle className="h-4 w-4" />
          Comprar via WhatsApp
        </Button>
      </a>
    </div>
  );
}
