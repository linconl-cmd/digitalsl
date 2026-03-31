import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana Souza",
    role: "Contadora",
    text: "Excelente atendimento! Meu e-CPF foi emitido em menos de 24 horas. Super recomendo a Digital Solutions.",
  },
  {
    name: "Carlos Mendes",
    role: "Empresário",
    text: "Precisava de um e-CNPJ urgente e a equipe foi extremamente ágil. Preço justo e suporte impecável.",
  },
  {
    name: "Fernanda Lima",
    role: "Advogada",
    text: "Já é o terceiro certificado que emito com eles. Confiança e praticidade em cada renovação.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Depoimentos</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground">
            O que nossos <span className="gradient-text">clientes dizem</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
