import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { count } = await supabaseAdmin
    .from('admin_users')
    .select('user_id', { count: 'exact', head: true });

  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ message: 'Already an admin', isFirstAdmin: false });
  }

  const isFirstAdmin = (count ?? 0) === 0;

  if (isFirstAdmin) {
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({ user_id: user.id });

    if (insertError) {
      return NextResponse.json({ error: 'Failed to grant admin access' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Admin access granted', isFirstAdmin: true });
  }

  return NextResponse.json({ error: 'Admin access must be granted by an existing admin' }, { status: 403 });
}
