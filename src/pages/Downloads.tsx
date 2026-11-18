import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";
import { useDownloads } from "@/hooks/useDownloads";

const Downloads = () => {
  const { data: settings } = useSettings();
  const { data: downloads } = useDownloads();

  const whatsappNumber = settings?.whatsapp_number || "5573999430073";
  const genericMessage =
    settings?.whatsapp_generic_message ||
    "Olá Digital Solutions, gostaria de mais informações sobre os certificados digitais.";

  const destaque = downloads?.find((d) => d.featured);
  const drivers = downloads?.filter((d) => !d.featured) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header whatsappNumber={whatsappNumber} genericMessage={genericMessage} />

      <main className="container mx-auto px-4 pt-32 pb-24">
        {destaque && (
          <section className="text-center mb-20">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Siga o tutorial para fazer a emissão correta
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {destaque.description}
            </p>
            <img
              src="/tutorial2.gif"
              alt="Tutorial de como emitir o certificado"
              className="mx-auto rounded-xl border border-border max-w-full mb-8"
            />
            <a href={destaque.url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" /> Baixar {destaque.name}
              </Button>
            </a>
          </section>
        )}

        {drivers.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8 text-center">
              Drivers e softwares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {drivers.map((driver) => (
                <Card key={driver.id} className="bg-card border-border">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {driver.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {driver.description}
                    </p>
                    <a
                      href={driver.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <ExternalLink className="h-4 w-4" /> Baixar
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer
        whatsappNumber={whatsappNumber}
        genericMessage={genericMessage}
        phoneDisplay={settings?.footer_phone_display}
        email={settings?.footer_email}
        location={settings?.footer_location}
        cnpj={settings?.footer_cnpj}
      />
    </div>
  );
};

export default Downloads;
