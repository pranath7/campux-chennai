import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const verifiedPurchases = db.purchases.filter((p) => p.paymentStatus === 'verified' || p.paymentStatus === 'successful');
    const grossTransactionValue = verifiedPurchases.reduce((sum, p) => sum + p.totalAmountPaid, 0);
    const platformRevenue = verifiedPurchases.reduce((sum, p) => sum + p.platformRevenue, 0);

    const pendingPayments = db.paymentSubmissions.filter((s) => s.status === 'submitted' || s.status === 'pending');
    const pendingVerifications = db.verifications.filter((v) => v.status === 'pending');
    const openReports = db.reports.filter((r) => r.status === 'open' || r.status === 'under_review');

    return NextResponse.json({
      success: true,
      role: 'admin',
      metrics: {
        users: {
          total: db.users.filter((u) => u.role === 'student').length,
          verified: db.studentProfiles.filter((p) => p.verifiedBadge).length,
        },
        marketplace: {
          totalListings: db.listings.length,
          activeListings: db.listings.filter((l) => l.status === 'active').length,
          totalPurchases: verifiedPurchases.length,
          grossTransactionValue,
          platformRevenue,
        },
        trust: {
          pendingPaymentsCount: pendingPayments.length,
          pendingVerificationsCount: pendingVerifications.length,
          openReportsCount: openReports.length,
        },
      },
      paymentSubmissions: db.paymentSubmissions,
      pendingPayments,
      verifications: db.verifications,
      reports: db.reports,
      transactions: db.purchases.slice(0, 30),
      platformSettings: db.platformSettings,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
