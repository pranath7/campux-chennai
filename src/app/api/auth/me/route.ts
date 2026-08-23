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
    const purchases = db.getPurchasesByBuyerId ? db.getPurchasesByBuyerId(user.id) : db.purchases.filter(p => p.buyerId === user.id);
    const mySales = db.listings.filter(l => l.sellerId === user.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        studentCode: user.studentCode || profile?.studentCode,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile,
        college,
        stats: {
          purchasesCount: purchases.length,
          salesCount: mySales.length,
        },
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
