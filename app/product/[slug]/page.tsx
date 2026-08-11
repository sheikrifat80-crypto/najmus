'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronRight, Minus, Plus, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Product, buildWhatsAppUrl, formatPrice } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { productWhatsAppMessage } from '@/lib/whatsapp';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  const { addItem } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    fetch(`/api/products/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setProduct(data);
        setColor(data.colors?.[0] ?? '');
        setSize(data.sizes?.[0] ?? '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.image_url, ...(product.gallery_urls ?? [])];
  }, [product]);

  const waUrl = product
    ? buildWhatsAppUrl(settings.whatsapp_number, productWhatsAppMessage(product, color, size, qty))
    : '#';

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: `${product.id}-${color}-${size}`,
      product_id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
      color,
      size,
      quantity: qty,
    });
    toast.success(`${product.title} added to cart`);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-32 text-center">
        <h1 className="font-playfair text-3xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This item may no longer be available.</p>
        <Link href="/products"><Button className="mt-6">Back to Products</Button></Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-gold">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.3, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
          >
            <Image src={gallery[activeImage]} alt={product.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition ${i === activeImage ? 'border-gold' : 'border-transparent hover:border-border'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.is_featured && (
            <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              <Check className="h-3 w-3" /> Featured
            </span>
          )}
          <h1 className="font-playfair text-3xl font-bold sm:text-4xl">{product.title}</h1>
          <p className="mt-3 text-2xl font-semibold text-gold">{formatPrice(product.price, settings.currency)}</p>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wider">Color</div>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-9 w-9 rounded-full border-2 transition ${color === c ? 'border-gold ring-2 ring-gold/30' : 'border-border'}`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wider">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition ${size === s ? 'border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy' : 'border-border hover:border-navy dark:hover:border-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8">
            <div className="mb-3 text-sm font-semibold uppercase tracking-wider">Quantity</div>
            <div className="inline-flex items-center rounded-lg border">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {product.stock > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">{product.stock} in stock</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" className="w-full bg-[#25D366] text-white hover:bg-[#1da851]">
                <MessageCircle className="mr-2 h-5 w-5" /> Order via WhatsApp
              </Button>
            </a>
            <Button size="lg" variant="outline" className="flex-1 border-navy text-navy dark:border-white dark:text-white" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Secure WhatsApp ordering. Add your phone number in the admin settings to activate the order button.
          </p>
        </div>
      </div>
    </main>
  );
}
