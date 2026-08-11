import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json([]);

  const { data, error } = await supabase
    .from('products')
    .select('id, title, slug, image_url, price')
    .eq('is_active', true)
    .ilike('title', `%${q}%`)
    .limit(8);

  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
