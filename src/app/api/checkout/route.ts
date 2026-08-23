import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { calculatePriceBreakdown } from '@/lib/payment';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please log in to purchase resources.' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, utrId, screenshotUrl } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required.' }, { status: 400 });
    }

    if (!utrId || utrId.trim().length < 6) {
      return NextResponse.json(
        { error: 'A valid UPI UTR / Transaction Reference ID (at least 6-12 digits) is required.' },
        { status: 400 }
      );
    }

    if (!screenshotUrl) {
      return NextResponse.json(
        { error: 'Payment screenshot upload is required to confirm payment.' },
        { status: 400 }
      );
    }

    const listing = db.getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found or no longer available.' }, { status: 404 });
    }

    if (listing.sellerId === session.userId) {
      return NextResponse.json({ error: 'You cannot purchase your own resource listing.' }, { status: 400 });
    }

    // Check if already verified
    const alreadyVerified = db.hasPurchased(session.userId, listing.id);
    if (alreadyVerified) {
      return NextResponse.json({
        success: true,
        alreadyOwned: true,
        message: 'You already own this resource.',
        listingId: listing.id,
      });
    }

    const buyerUser = db.getUserById(session.userId);
    const buyerProfile = db.getStudentProfile(session.userId);
    const breakdown = calculatePriceBreakdown(listing.price, db.platformSettings);

    const { purchase, submission } = db.submitManualPayment({
      buyerId: session.userId,
      buyerName: session.fullName,
      buyerMobile: buyerUser?.mobile || '9876543210',
      buyerCollegeId: buyerProfile?.collegeId || listing.collegeId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingSubject: listing.subjectName,
      listingCategory: listing.category,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      basePrice: breakdown.basePrice,
      buyerFee: breakdown.buyerFee,
      sellerFee: breakdown.sellerFee,
      totalAmountPaid: breakdown.totalBuyerPayment,
      sellerNetAmount: breakdown.sellerNetAmount,
      platformRevenue: breakdown.platformRevenue,
      utrId: utrId.trim(),
      screenshotUrl,
    });

    // Mirror to Supabase PostgreSQL database
    try {
      await supabaseAdmin.from('purchases').insert({
        id: purchase.id,
        transaction_id: purchase.transactionId,
        buyer_id: purchase.buyerId,
        buyer_name: purchase.buyerName,
        buyer_email: purchase.buyerEmail || null,
        buyer_mobile: purchase.buyerMobile,
        buyer_college_id: purchase.buyerCollegeId,
        seller_id: purchase.sellerId,
        seller_name: purchase.sellerName,
        listing_id: purchase.listingId,
        listing_title: purchase.listingTitle,
        listing_subject: purchase.listingSubject,
        listing_category: purchase.listingCategory,
        base_price: purchase.basePrice,
        buyer_fee: purchase.buyerFee,
        seller_fee: purchase.sellerFee,
        total_amount_paid: purchase.totalAmountPaid,
        seller_net_amount: purchase.sellerNetAmount,
        platform_revenue: purchase.platformRevenue,
        payment_method: 'UPI',
        payment_status: 'submitted',
        utr_id: purchase.utrId,
        screenshot_url: purchase.screenshotUrl,
      });
    } catch (sbErr) {
      console.error('Supabase purchase insert error:', sbErr);
    }

    return NextResponse.json({
      success: true,
      status: 'submitted',
      purchaseId: purchase.id,
      submissionId: submission.id,
      isDuplicateFlagged: submission.isDuplicateFlagged,
      message: 'Payment submitted successfully. Awaiting administrative verification.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
