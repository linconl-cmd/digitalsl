import { BarChart3, FileText, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGenericWhatsAppLink } from "@/lib/whatsapp";

const features = [
  {
    icon: FileText,
    title: "Fiscal & Contábil",
    description: "Emissão de NF-e, NFS-e, CT-e e integração com obrigações fiscais.",
  },
  {
    icon: BarChart3,
    title: "Gestão Financeira",
    description: "Controle de contas a pagar/receber, fluxo de caixa e conciliação bancária.",
  },
  {
    icon: Zap,
    title: "Automação de Processos",
    description: "Automatize rotinas repetitivas e aumente a produtividade da sua equipe.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança & Conformidade",
    description: "Dados protegidos e em conformidade com a legislação brasileira.",
  },
];

interface SoftwareSectionProps {
  whatsappNumber: string;
}

export default function SoftwareSection({ whatsappNumber }: SoftwareSectionProps) {
  const softwareMessage =
    "Olá Digital Solutions, gostaria de saber mais sobre o software de gestão Zucchetti.";
  const link = generateGenericWhatsAppLink(whatsappNumber, softwareMessage);

  return (
    <section id="software" className="py-24 relative" aria-labelledby="software-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Software de Gestão
          </span>
          <h2
            id="software-heading"
            className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground"
          >
            Soluções <span className="gradient-text">Zucchetti</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Somos revendedores autorizados do software de gestão empresarial Zucchetti — uma
            plataforma completa para empresas de todos os portes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "var(--gradient-primary)" }}
              >
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground">
              <MessageCircle className="h-5 w-5" /> Solicitar Demonstração
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
