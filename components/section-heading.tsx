'use client';

import { motion } from 'framer-motion';

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</div>
      )}
      <h2 className="font-playfair text-3xl font-bold tracking-tight text-navy dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>}
      <div className="mx-auto mt-6 h-px w-16 bg-gold" />
    </motion.div>
  );
}
