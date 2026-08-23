import { NextRequest, NextResponse } from 'next/server';
import { seedSupabase } from '@/lib/supabase/seed';

export async function GET(req: NextRequest) {
  try {
    await seedSupabase();
    return NextResponse.json({ success: true, message: 'Supabase database initialized with Chennai colleges and syllabus!' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error seeding Supabase';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
