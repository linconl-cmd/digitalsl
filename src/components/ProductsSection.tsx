import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

export default function ProductsSection() {
  const { data: products, isLoading } = useProducts(true);

  return (
    <section id="produtos" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Nossos Certificados</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 mb-4 text-foreground">
            Escolha o <span className="gradient-text">certificado ideal</span> para você
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Certificados digitais com validade jurídica para pessoa física e empresas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
