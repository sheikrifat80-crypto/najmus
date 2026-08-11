'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { buildWhatsAppUrl } from '@/lib/types';
import { MessageCircle } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/category/t-shirt', label: 'T-shirt' },
  { href: '/category/pant', label: 'Pant' },
  { href: '/category/kids', label: 'Kids' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { count, open: openCart } = useCart();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, 'Hello Z & Z International! I have a question.');

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border'
            : 'bg-background/80 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                    active ? 'text-gold' : 'text-foreground'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search" className="hover:text-gold">
              <Search className="h-5 w-5" />
            </Button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
              aria-label="WhatsApp"
            >
              <Button variant="ghost" size="icon" className="hover:text-gold">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={openCart} aria-label="Cart" className="relative hover:text-gold">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">
                  {count}
                </span>
              )}
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo compact />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#25D366] text-white hover:bg-[#1da851]">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; title: string; slug: string; image_url: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) setResults(await res.json());
      } catch {}
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 p-4 pt-24"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-2xl rounded-xl border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && <div className="p-4 text-sm text-muted-foreground">Searching...</div>}
          {!loading && query && results.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No products found.</div>
          )}
          {!loading && results.map((r) => (
            <Link
              key={r.id}
              href={`/product/${r.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
            >
              <img src={r.image_url} alt={r.title} className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1">
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gold">${r.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
          {!query && (
            <div className="p-4 text-sm text-muted-foreground">Start typing to search the catalog.</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
