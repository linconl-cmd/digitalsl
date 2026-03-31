import { MessageCircle, Mail, MapPin } from "lucide-react";
import { generateGenericWhatsAppLink } from "@/lib/whatsapp";

interface FooterProps {
  whatsappNumber: string;
  genericMessage: string;
  phoneDisplay?: string;
  email?: string;
  location?: string;
  cnpj?: string;
}

export default function Footer({ whatsappNumber, genericMessage, phoneDisplay, email, location, cnpj }: FooterProps) {
  return (
    <footer id="contato" className="border-t border-border bg-muted/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl font-black gradient-text">DIGITAL</span>
              <span className="text-xl font-light tracking-widest text-muted-foreground">SOLUTIONS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua parceira em certificação digital. Emissão rápida, segura e com suporte personalizado.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Contato</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href={generateGenericWhatsAppLink(whatsappNumber, genericMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4 text-primary" />
                (11) 99999-9999
              </a>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contato@digitalsolutions.com.br
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                São Paulo, SP
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#inicio" className="block hover:text-foreground transition-colors">Início</a>
              <a href="#produtos" className="block hover:text-foreground transition-colors">Produtos</a>
              <a href="#como-funciona" className="block hover:text-foreground transition-colors">Como Funciona</a>
              <a href="/admin" className="block hover:text-foreground transition-colors">Área Administrativa</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Digital Solutions. Todos os direitos reservados.</p>
          <p className="mt-1">CNPJ: 12.345.678/0001-99 | Política de Privacidade | Termos de Uso</p>
        </div>
      </div>
    </footer>
  );
}
