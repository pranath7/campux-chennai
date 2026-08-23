import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin session terminated.',
  });

  response.cookies.delete(AuthService.getCookieName());
  return response;
}
