import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, featureInterest } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Mirror to Supabase or log securely
    try {
      await supabaseAdmin.from('audit_logs').insert({
        admin_user_id: 'waitlist_lead',
        admin_name: 'Waitlist Lead',
        action: 'JOIN_WAITLIST',
        entity: 'WAITLIST',
        entity_id: cleanEmail,
        details: `Subscribed for early beta access. Feature interest: ${featureInterest || 'All AI Features'}`,
      });
    } catch (e) {
      console.error('Waitlist Supabase log error:', e);
    }

    return NextResponse.json({
      success: true,
      message: '🎉 You are on the VIP early access list! 3 Months Free AI pass reserved.',
      email: cleanEmail,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
