import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { useSettings } from "@/hooks/useSettings";

const Index = () => {
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number || "5511999999999";
  const genericMessage = settings?.whatsapp_generic_message || "Olá Digital Solutions, gostaria de mais informações sobre os certificados digitais.";
  const productMessage = settings?.whatsapp_product_message || "Olá Digital Solutions, gostaria de adquirir o certificado: {product_name} - Valor: R$ {price}";
  const heroTitle = settings?.hero_title;
  const heroSubtitle = settings?.hero_subtitle;

  return (
    <div className="min-h-screen bg-background">
      <Header whatsappNumber={whatsappNumber} genericMessage={genericMessage} />
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />
      <ProductsSection whatsappNumber={whatsappNumber} productMessage={productMessage} />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer whatsappNumber={whatsappNumber} genericMessage={genericMessage} />
    </div>
  );
};

export default Index;
