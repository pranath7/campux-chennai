import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const userPurchases = db.purchases.filter((p) => p.buyerId === session.userId);

    // Enrich with current listing details
    const enriched = userPurchases.map((purchase) => {
      const listing = db.getListingById(purchase.listingId);
      const review = db.reviews.find((r) => r.purchaseId === purchase.id);
      return {
        ...purchase,
        listing,
        review,
      };
    });

    return NextResponse.json({
      success: true,
      purchases: enriched,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
