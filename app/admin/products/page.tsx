'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category, formatPrice } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type EditState = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  gallery_urls: string;
  colors: string;
  sizes: string;
  category_id: string;
  is_featured: boolean;
  is_active: boolean;
};

const EMPTY: EditState = {
  title: '', slug: '', description: '', price: '', stock: '', image_url: '', gallery_urls: '', colors: '', sizes: '', category_id: '', is_featured: false, is_active: true,
};

export default function AdminProductsPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/products').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const token = session?.access_token;

  const save = async () => {
    if (!editing || !token) return;
    const payload = {
      title: editing.title,
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: editing.description,
      price: parseFloat(editing.price) || 0,
      stock: parseInt(editing.stock) || 0,
      image_url: editing.image_url,
      gallery_urls: editing.gallery_urls.split('\n').map((s) => s.trim()).filter(Boolean),
      colors: editing.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: editing.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      category_id: editing.category_id,
      is_featured: editing.is_featured,
      is_active: editing.is_active,
    };
    if (!payload.category_id) {
      toast.error('Please select a category.');
      return;
    }
    const method = editing.id ? 'PUT' : 'POST';
    const body = editing.id ? { id: editing.id, ...payload } : payload;
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error('Failed to save product.');
      return;
    }
    toast.success(editing.id ? 'Product updated.' : 'Product created.');
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!token) return;
    if (!confirm('Delete this product?')) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      toast.error('Failed to delete product.');
      return;
    }
    toast.success('Product deleted.');
    load();
  };

  const toggleFeatured = async (p: Product) => {
    if (!token) return;
    await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: p.id, is_featured: !p.is_featured }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Products</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, and manage your catalog.</p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY, category_id: categories[0]?.id ?? '' })} className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
              <img src={p.image_url} alt={p.title} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.is_featured && <Star className="h-4 w-4 fill-gold text-gold" />}
                </div>
                <div className="text-sm text-muted-foreground">
                  {p.category?.name ?? 'Uncategorized'} · {formatPrice(p.price)} · {p.stock} in stock
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleFeatured(p)} title="Toggle featured">
                  <Star className={`h-4 w-4 ${p.is_featured ? 'fill-gold text-gold' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditing({
                  id: p.id, title: p.title, slug: p.slug, description: p.description, price: String(p.price), stock: String(p.stock),
                  image_url: p.image_url, gallery_urls: (p.gallery_urls ?? []).join('\n'), colors: (p.colors ?? []).join(', '),
                  sizes: (p.sizes ?? []).join(', '), category_id: p.category_id, is_featured: p.is_featured, is_active: p.is_active,
                })}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="py-12 text-center text-muted-foreground">No products yet. Click "Add Product" to create your first.</p>}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-playfair text-xl font-bold">{editing.id ? 'Edit Product' : 'New Product'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-5 w-5" /></Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={editing.category_id} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <Label>Gallery URLs (one per line)</Label>
                  <Textarea rows={3} value={editing.gallery_urls} onChange={(e) => setEditing({ ...editing, gallery_urls: e.target.value })} />
                </div>
                <div>
                  <Label>Colors (comma-separated hex)</Label>
                  <Input value={editing.colors} onChange={(e) => setEditing({ ...editing, colors: e.target.value })} placeholder="#102746, #c59a3d" />
                </div>
                <div>
                  <Label>Sizes (comma-separated)</Label>
                  <Input value={editing.sizes} onChange={(e) => setEditing({ ...editing, sizes: e.target.value })} placeholder="S, M, L, XL" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={save} className="flex-1 bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
                  {editing.id ? 'Save Changes' : 'Create Product'}
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
