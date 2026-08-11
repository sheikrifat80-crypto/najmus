import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let query = supabase
    .from('products')
    .select('id, category_id, title, slug, description, price, stock, image_url, gallery_urls, colors, sizes, is_featured, is_active, category:categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (featured === 'true') query = query.eq('is_featured', true);

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    } else {
      return NextResponse.json([]);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
