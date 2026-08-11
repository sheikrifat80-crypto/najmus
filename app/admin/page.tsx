'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, FolderTree, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    fetch('/api/admin/products').then((r) => r.json()).then(setProducts).catch(() => {});
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 5);

  const stats = [
    { label: 'Products', value: products.length, icon: Package, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Categories', value: categories.length, icon: FolderTree, color: 'bg-gold/10 text-gold' },
    { label: 'Inventory Value', value: formatPrice(totalValue, settings.currency), icon: DollarSign, color: 'bg-green-500/10 text-green-500' },
    { label: 'Low Stock', value: lowStock.length, icon: TrendingUp, color: 'bg-red-500/10 text-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back. Here's your store overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Link href="/admin/products" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
              <span>Manage Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/categories" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
              <span>Manage Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
              <span>Update Settings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Low Stock Alert</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products are well stocked.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{p.title}</span>
                  <span className="text-sm font-bold text-red-500">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
