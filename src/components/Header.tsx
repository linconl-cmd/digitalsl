import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGenericWhatsAppLink } from "@/lib/whatsapp";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <a href="#inicio" className="flex items-baseline gap-1">
          <span className="text-xl font-black tracking-tight gradient-text">DIGITAL</span>
          <span className="text-xl font-light tracking-widest text-muted-foreground">SOLUTIONS</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href={generateGenericWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground gap-2">
              <MessageCircle className="h-4 w-4" />
              Fale Conosco
            </Button>
          </a>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-4 pb-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={generateGenericWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button className="w-full mt-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground gap-2">
              <MessageCircle className="h-4 w-4" />
              Fale Conosco
            </Button>
          </a>
        </div>
      )}
    </header>
  );
}
