import { describe, it, expect } from "vitest";
import { generateGenericWhatsAppLink, generateWhatsAppLink } from "./whatsapp";

describe("whatsapp", () => {
  it("monta o link genérico com a mensagem codificada", () => {
    expect(generateGenericWhatsAppLink("5511999999999", "Olá, tudo bem?")).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20tudo%20bem%3F"
    );
  });

  it("substitui produto e preço (com vírgula) no modelo da mensagem", () => {
    const link = generateWhatsAppLink("5511999999999", "Quero {product_name} por {price}", "e-CPF A1", 150);
    expect(decodeURIComponent(link.split("text=")[1])).toBe("Quero e-CPF A1 por 150,00");
  });
});
