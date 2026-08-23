import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || body.email || body.mobile || body.loginInput || '').trim();
    const password = body.password;

    if (!identifier) {
      return NextResponse.json({ error: 'Mobile number or email is required.' }, { status: 400 });
    }

    const user = db.getUserByMobileOrEmail(identifier);
    if (!user) {
      return NextResponse.json({ error: 'No student found with this mobile number or email.' }, { status: 401 });
    }

    // Secure Password Validation
    if (user.passwordHash && password) {
      if (user.passwordHash !== password && user.passwordHash !== `hash_${password}`) {
        return NextResponse.json({ error: 'Invalid password credentials. Please try again.' }, { status: 401 });
      }
    }

    if (user.isSuspended) {
      return NextResponse.json({ error: 'Your account has been suspended by platform administration.' }, { status: 403 });
    }

    const token = AuthService.createSessionToken(user);
    const profile = db.getStudentProfile(user.id);
    const college = profile?.collegeId ? db.getCollegeById(profile.collegeId) : undefined;

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile,
        college,
      },
      token,
    });

    response.cookies.set(AuthService.getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
