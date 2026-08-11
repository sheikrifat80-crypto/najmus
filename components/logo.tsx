'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSettings } from '@/lib/settings-context';

export function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { settings } = useSettings();
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold/60">
        <Image src="/unnamed.jpg" alt="Z & Z International logo" fill className="object-cover" priority />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-playfair text-lg font-bold tracking-wide text-navy dark:text-white">
            Z &amp; Z
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold">
            International
          </div>
        </div>
      )}
    </Link>
  );
}
