import { ShoppingCart, CalendarCheck, ShieldCheck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Escolha seu Certificado",
    description: "Selecione o tipo de certificado que melhor atende sua necessidade.",
  },
  {
    icon: CalendarCheck,
    title: "Agende o Atendimento",
    description: "Entramos em contato via WhatsApp para agendar a validação presencial ou por videoconferência.",
  },
  {
    icon: ShieldCheck,
    title: "Validação de Identidade",
    description: "Realize a validação com nossos agentes certificados de forma rápida e segura.",
  },
  {
    icon: CheckCircle2,
    title: "Certificado Emitido!",
    description: "Seu certificado digital estará pronto para uso imediato após a validação.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Passo a Passo</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground">
            Como <span className="gradient-text">funciona?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="mb-2 text-xs font-bold text-primary">PASSO {i + 1}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
