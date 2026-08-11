'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';

type SettingsForm = {
  site_name: string;
  tagline: string;
  whatsapp_number: string;
  hero_title: string;
  hero_subtitle: string;
  currency: string;
};

export default function AdminSettingsPage() {
  const { session } = useAuth();
  const { refresh } = useSettings();
  const [form, setForm] = useState<SettingsForm>({
    site_name: '', tagline: '', whatsapp_number: '', hero_title: '', hero_subtitle: '', currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setForm({
        site_name: data.site_name ?? '',
        tagline: data.tagline ?? '',
        whatsapp_number: data.whatsapp_number ?? '',
        hero_title: data.hero_title ?? '',
        hero_subtitle: data.hero_subtitle ?? '',
        currency: data.currency ?? 'USD',
      }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!session?.access_token) return;
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { toast.error('Failed to save settings.'); return; }
    toast.success('Settings saved.');
    refresh();
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Loading settings...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage global site variables and contact details.</p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <Label>Site Name</Label>
          <Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
        </div>
        <div>
          <Label>Tagline</Label>
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div>
          <Label>WhatsApp Number (with country code, digits only)</Label>
          <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="e.g. 14155552671" />
          <p className="mt-1 text-xs text-muted-foreground">This powers the Order via WhatsApp buttons and floating chat widget.</p>
        </div>
        <div>
          <Label>Hero Title</Label>
          <Input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
        </div>
        <div>
          <Label>Hero Subtitle</Label>
          <Textarea rows={2} value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
        </div>
        <div>
          <Label>Currency</Label>
          <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['USD', 'EUR', 'GBP', 'INR', 'AED'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={save} disabled={saving} className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
