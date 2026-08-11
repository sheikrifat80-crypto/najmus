import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useSettings } from '@/lib/settings-context';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Fashion world wide. Premium essentials considered for every destination.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold hover:text-navy">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Shop</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/products" className="hover:text-gold">All Products</Link></li>
              <li><Link href="/category/t-shirt" className="hover:text-gold">T-shirt</Link></li>
              <li><Link href="/category/pant" className="hover:text-gold">Pant</Link></li>
              <li><Link href="/category/kids" className="hover:text-gold">Kids</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Company</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-gold">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@zzinternational.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +1 (000) 000-0000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Fashion World Wide</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Z &amp; Z International. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
