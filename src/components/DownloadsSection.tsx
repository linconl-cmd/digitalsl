import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const drivers = [
  {
    name: "SafeSign",
    description: "Driver para leitoras de cartão e tokens criptográficos SafeSign.",
    url: "#",
  },
  {
    name: "Certisign",
    description: "Gerenciador de certificados Certisign para Windows e macOS.",
    url: "#",
  },
  {
    name: "Safenet",
    description: "Driver SafeNet Authentication Client para tokens USB.",
    url: "#",
  },
  {
    name: "GD Burti / Star Sign",
    description: "Drivers para leitoras GD Burti e Star Sign.",
    url: "#",
  },
];

export default function DownloadsSection() {
  return (
    <section id="downloads" className="py-24 relative" aria-labelledby="downloads-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Downloads
          </span>
          <h2
            id="downloads-heading"
            className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground"
          >
            Drivers e <span className="gradient-text">softwares</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Baixe os drivers necessários para o funcionamento do seu certificado digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((driver, i) => (
            <Card key={i} className="bg-card border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                    style={{ background: "var(--gradient-accent)" }}
                  >
                    <Download className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{driver.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{driver.description}</p>
                <a href={driver.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" /> Baixar
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
