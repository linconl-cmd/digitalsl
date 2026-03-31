export function generateWhatsAppLink(
  number: string,
  messageTemplate: string,
  productName: string,
  price: number
): string {
  const formattedPrice = price.toFixed(2).replace(".", ",");
  const message = messageTemplate
    .replace("{product_name}", productName)
    .replace("{price}", formattedPrice);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generateGenericWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
