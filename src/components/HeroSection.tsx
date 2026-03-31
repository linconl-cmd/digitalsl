import { ShieldCheck, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 mb-8 animate-fade-in">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Autoridade Certificadora Credenciada</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {title ? (
            <span dangerouslySetInnerHTML={{ __html: title.replace(/(Certificado Digital)/i, '<span class="gradient-text">$1</span>') }} />
          ) : (
            <>Emita seu <span className="gradient-text">Certificado Digital</span><br />de forma Rápida e Segura</>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {subtitle || "A Digital Solutions simplifica a emissão do seu certificado digital. Atendimento personalizado, preços competitivos e suporte completo do início ao fim."}
        </p>

        <a
          href="#produtos"
          className="inline-flex items-center gap-2 rounded-lg px-8 py-4 font-semibold text-primary-foreground transition-transform hover:scale-105 animate-fade-in"
          style={{ background: "var(--gradient-primary)", animationDelay: "0.3s" }}
        >
          Ver Certificados
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
