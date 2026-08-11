import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
