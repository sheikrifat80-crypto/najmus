'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

export default function AdminLoginPage() {
  const { signIn, signUp, session } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const bootstrapAdmin = async (token: string) => {
    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.isFirstAdmin) {
        toast.success('Admin access granted. Welcome!');
      } else if (res.ok && !data.isFirstAdmin) {
        // already an admin, fine
      } else if (res.status === 403) {
        toast.error('This account is not an admin. Ask an existing admin to add you.');
        return false;
      }
    } catch {
      // non-fatal
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) {
      setLoading(false);
      toast.error(error);
      return;
    }

    // After sign-in/sign-up, get the fresh session token and bootstrap admin
    const { supabase } = await import('@/lib/supabase');
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (token) {
      const ok = await bootstrapAdmin(token);
      if (!ok) {
        setLoading(false);
        return;
      }
    }

    toast.success(mode === 'signup' ? 'Account created. Redirecting...' : 'Signed in.');
    router.push('/admin');
    router.refresh();
  };

  // If already logged in as admin, redirect
  if (session && !loading) {
    // The layout will handle the redirect, but we can nudge it
    router.replace('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-background p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-playfair text-2xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className="pl-10" required />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full bg-navy text-white hover:bg-navy/90" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-medium text-gold hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          The first account created automatically becomes the admin.
        </p>
      </motion.div>
    </main>
  );
}
