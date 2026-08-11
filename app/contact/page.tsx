'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeading } from '@/components/section-heading';
import { useSettings } from '@/lib/settings-context';
import { buildWhatsAppUrl } from '@/lib/types';

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const waUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    `Hello Z & Z International!\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    window.open(waUrl, '_blank');
    toast.success('Opening WhatsApp to send your message...');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Get in touch" title="Contact Us" subtitle="Have a question about our products or an order? We'd love to hear from you." />

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy dark:bg-white/5 dark:text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">hello@zzinternational.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy dark:bg-white/5 dark:text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Phone / WhatsApp</h3>
              <p className="text-sm text-muted-foreground">{settings.whatsapp_number || 'Add your number in Admin Settings'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy dark:bg-white/5 dark:text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">Fashion World Wide</p>
            </div>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#25D366] text-white hover:bg-[#1da851]">
              <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
            </Button>
          </a>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={5} />
          </div>
          <Button type="submit" size="lg" className="w-full bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy">
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </motion.form>
      </div>
    </main>
  );
}
