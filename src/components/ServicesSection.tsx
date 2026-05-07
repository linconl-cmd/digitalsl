import { Monitor, Wifi, Headset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Monitor,
    title: "Instalação Remota de Certificados",
    description:
      "Instalamos seu certificado digital de forma remota, com segurança e praticidade. Sem necessidade de deslocamento.",
  },
  {
    icon: Headset,
    title: "Suporte a Software",
    description:
      "Assistência técnica especializada para resolver problemas em softwares de certificação, ERP e sistemas fiscais.",
  },
  {
    icon: Wifi,
    title: "Acesso Remoto Seguro",
    description:
      "Conectamos ao seu computador de forma segura para diagnósticos, configurações e resolução de problemas em tempo real.",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="py-24 relative" aria-labelledby="servicos-heading">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Nossos Serviços
          </span>
          <h2
            id="servicos-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-5 text-foreground tracking-tight"
          >
            Suporte <span className="gradient-text">especializado</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-[15px] leading-relaxed">
            Oferecemos suporte remoto completo para instalação de certificados e manutenção de software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Card
              key={i}
              className="bg-card border-border hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-foreground mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
