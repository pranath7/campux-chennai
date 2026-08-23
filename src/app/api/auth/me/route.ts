import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = db.getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const profile = db.getStudentProfile(user.id);
    const college = profile?.collegeId ? db.getCollegeById(profile.collegeId) : undefined;

    return NextResponse.json({
      authenticated: true,
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
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
