import { Handshake, TrendingUp, Users, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGenericWhatsAppLink } from "@/lib/whatsapp";

const benefits = [
  {
    icon: TrendingUp,
    title: "Comissões Atrativas",
    description: "Ganhe comissões competitivas a cada certificado emitido por indicação.",
  },
  {
    icon: Users,
    title: "Suporte Dedicado",
    description: "Canal exclusivo de atendimento para parceiros e seus clientes.",
  },
  {
    icon: BadgeCheck,
    title: "Credibilidade",
    description: "Ofereça certificação digital como serviço agregado ao seu escritório.",
  },
];

interface PartnersSectionProps {
  whatsappNumber: string;
  genericMessage: string;
}

export default function PartnersSection({ whatsappNumber, genericMessage }: PartnersSectionProps) {
  const partnerMessage = "Olá Digital Solutions, sou contador(a) e gostaria de saber mais sobre o programa de parceiros.";
  const link = generateGenericWhatsAppLink(whatsappNumber, partnerMessage);

  return (
    <section id="parceiros" className="py-24 relative" aria-labelledby="parceiros-heading">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Programa de Parceiros
          </span>
          <h2
            id="parceiros-heading"
            className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground"
          >
            Contadores, sejam nossos{" "}
            <span className="gradient-text">parceiros</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escritórios de contabilidade podem oferecer certificação digital aos seus clientes
            e gerar receita extra com nosso programa de parceiros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((b, i) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "var(--gradient-warm)" }}
              >
                <b.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              <Handshake className="h-5 w-5" /> Quero ser Parceiro
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
