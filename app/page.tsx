'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { Product, Category, DEFAULT_SETTINGS, SiteSettings } from '@/lib/types';

const SLIDES = [
  {
    image: 'https://images.pexels.com/photos/32526686/pexels-photo-32526686.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600',
    title: 'A wardrobe without borders.',
    subtitle: 'Premium essentials, considered globally.',
  },
  {
    image: 'https://images.pexels.com/photos/7959592/pexels-photo-7959592.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600',
    title: 'Tailored for every destination.',
    subtitle: 'Refined silhouettes with an international finish.',
  },
  {
    image: 'https://images.pexels.com/photos/18545044/pexels-photo-18545044.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600',
    title: 'The next generation of style.',
    subtitle: 'Considered pieces for curious days.',
  },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings({ ...DEFAULT_SETTINGS, ...d })).catch(() => {});
    fetch('/api/products?featured=true').then(r => r.json()).then(setProducts).catch(() => {});
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <main>
      {/* Hero slider */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image src={SLIDES[slide].image} alt="" fill className="object-cover" priority={slide === 0} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            key={`text-${slide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-white"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> {settings.tagline}
            </div>
            <h1 className="font-playfair text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {SLIDES[slide].title}
            </h1>
            <p className="mt-5 text-lg text-white/80">{SLIDES[slide].subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-gold text-navy hover:bg-gold/90">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/category/t-shirt">
                <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <button
          onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-gold' : 'w-2 bg-white/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Globe, title: 'Worldwide Shipping', desc: 'Delivered globally' },
            { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Via WhatsApp order' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Quick & reliable' },
            { icon: Sparkles, title: 'Premium Quality', desc: 'Curated fabrics' },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy dark:bg-white/5 dark:text-white">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Collections" title="Shop by Category" subtitle="Explore our curated collections, each crafted with premium fabrics and a global perspective." />
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/category/${cat.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
                <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-playfair text-2xl font-bold">{cat.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gold">
                    Shop now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Selected" title="Featured Pieces" subtitle="A handpicked selection of our finest essentials, chosen for their quality and design." />
          {products.length === 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-navy text-navy dark:border-white dark:text-white">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center text-white sm:px-16"
        >
          <div className="absolute inset-0 opacity-10">
            <Image src="https://images.pexels.com/photos/15576197/pexels-photo-15576197.jpeg?auto=compress&cs=tinysrgb&h=600&w=1200" alt="" fill className="object-cover" />
          </div>
          <div className="relative">
            <h2 className="font-playfair text-3xl font-bold sm:text-4xl">Join the Z &amp; Z circle</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Be the first to discover new arrivals, exclusive offers, and stories from our global collections.
            </p>
            <Link href="/products">
              <Button size="lg" className="mt-8 bg-gold text-navy hover:bg-gold/90">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
