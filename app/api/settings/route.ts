import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_SETTINGS } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'tagline', 'whatsapp_number', 'hero_title', 'hero_subtitle', 'currency']);

  if (error) return NextResponse.json(DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) {
    (settings as Record<string, string>)[row.key] = row.value;
  }
  return NextResponse.json(settings);
}
