export type Product = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  gallery_urls: string[];
  colors: string[];
  sizes: string[];
  is_featured: boolean;
  is_active: boolean;
  category?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

export type CartItem = {
  id: string;
  product_id: string;
  title: string;
  slug: string;
  price: number;
  image_url: string;
  color: string;
  size: string;
  quantity: number;
};

export type SiteSettings = {
  site_name: string;
  tagline: string;
  whatsapp_number: string;
  hero_title: string;
  hero_subtitle: string;
  currency: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Z & Z International',
  tagline: 'Fashion world wide',
  whatsapp_number: '',
  hero_title: 'A wardrobe without borders.',
  hero_subtitle: 'Premium essentials, considered globally. Designed for every destination.',
  currency: 'USD',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'AED ',
};

export function formatPrice(amount: number, currency = 'USD') {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
