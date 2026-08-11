'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

type EditState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
};

const EMPTY: EditState = { name: '', slug: '', description: '', image_url: '', sort_order: '0', is_active: true };

export default function AdminCategoriesPage() {
  const { session } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const token = session?.access_token;

  const save = async () => {
    if (!editing || !token) return;
    const payload = {
      name: editing.name,
      slug: editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: editing.description,
      image_url: editing.image_url,
      sort_order: parseInt(editing.sort_order) || 0,
      is_active: editing.is_active,
    };
    const method = editing.id ? 'PUT' : 'POST';
    const body = editing.id ? { id: editing.id, ...payload } : payload;
    const res = await fetch('/api/admin/categories', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) { toast.error('Failed to save category.'); return; }
    toast.success(editing.id ? 'Category updated.' : 'Category created.');
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!token) return;
    if (!confirm('Delete this category? Products in this category will remain but lose their category link.')) return;
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { toast.error('Failed to delete category.'); return; }
    toast.success('Category deleted.');
    load();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Categories</h1>
          <p className="mt-1 text-muted-foreground">Organize your products into collections.</p>
        </div>
        <Button onClick={() => setEditing(EMPTY)} className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4 shadow-sm">
              {c.image_url && <img src={c.image_url} alt={c.name} className="mb-3 h-24 w-full rounded-lg object-cover" />}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.slug} · Order {c.sort_order}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing({
                    id: c.id, name: c.name, slug: c.slug, description: c.description, image_url: c.image_url, sort_order: String(c.sort_order), is_active: c.is_active,
                  })}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
            </div>
          ))}
          {categories.length === 0 && <p className="py-12 text-center text-muted-foreground">No categories yet.</p>}
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
              className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-playfair text-xl font-bold">{editing.id ? 'Edit Category' : 'New Category'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-5 w-5" /></Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated" />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={save} className="flex-1 bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
                  {editing.id ? 'Save Changes' : 'Create Category'}
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
