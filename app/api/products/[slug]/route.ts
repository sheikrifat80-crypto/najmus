import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('products')
    .select('id, category_id, title, slug, description, price, stock, image_url, gallery_urls, colors, sizes, is_featured, is_active, category:categories(id, name, slug)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(data);
}
