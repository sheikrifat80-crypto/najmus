import { Product } from './types';

export function productWhatsAppMessage(product: Product, color?: string, size?: string, quantity = 1) {
  const lines = [
    `Hello ${'Z & Z International'}! I'd like to order:`,
    '',
    `• ${product.title}`,
    `• Price: $${product.price.toFixed(2)}`,
  ];
  if (color) lines.push(`• Color: ${color}`);
  if (size) lines.push(`• Size: ${size}`);
  lines.push(`• Quantity: ${quantity}`);
  lines.push('');
  lines.push('Please confirm availability and delivery. Thank you!');
  return lines.join('\n');
}
