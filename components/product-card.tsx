'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/types';
import { Product } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { settings } = useSettings();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.is_featured && (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-navy/90 p-4 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
            View Details
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">{product.title}</h3>
          <p className="text-sm font-semibold text-gold">{formatPrice(product.price, settings.currency)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
