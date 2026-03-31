const WHATSAPP_NUMBER = "5511999999999"; // Replace with actual number

export function generateWhatsAppLink(productName: string, price: number): string {
  const message = encodeURIComponent(
    `Olá Digital Solutions, gostaria de adquirir o certificado: ${productName} - Valor: R$ ${price.toFixed(2).replace('.', ',')}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function generateGenericWhatsAppLink(): string {
  const message = encodeURIComponent(
    "Olá Digital Solutions, gostaria de mais informações sobre os certificados digitais."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
