'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { buildWhatsAppUrl, formatPrice } from '@/lib/types';

export function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, subtotal, clear } = useCart();
  const { settings } = useSettings();

  const orderMessage = items.map((i) => `• ${i.title} (${i.color}, ${i.size}) x${i.quantity} — ${formatPrice(i.price * i.quantity, settings.currency)}`).join('\n');
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, `Hello Z & Z International! I'd like to order:\n\n${orderMessage}\n\nPlease confirm. Thank you!`);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-black/60" onClick={close} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-playfair text-lg font-semibold">Your Cart</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={close}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Discover premium essentials curated for you.</p>
                  <Link href="/products" onClick={close}>
                    <Button className="mt-6 bg-navy text-white hover:bg-navy/90">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-lg border p-3">
                      <img src={item.image_url} alt={item.title} className="h-20 w-20 rounded-md object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <Link href={`/product/${item.slug}`} onClick={close} className="font-medium hover:text-gold">
                            {item.title}
                          </Link>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">{item.color} · {item.size}</div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm font-semibold text-gold">{formatPrice(item.price * item.quantity, settings.currency)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm text-muted-foreground" onClick={clear}>
                    Clear cart
                  </Button>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">{formatPrice(subtotal, settings.currency)}</span>
                </div>
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#25D366] text-white hover:bg-[#1da851]">
                    Order via WhatsApp
                  </Button>
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
