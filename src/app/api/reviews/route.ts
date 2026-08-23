import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { calculateCredibilityScore } from '@/lib/credibility';
import { Review } from '@/types/marketplace';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please log in to submit a review.' }, { status: 401 });
    }

    const { purchaseId, rating, qualityRating, accuracyRating, valueRating, comment } = await req.json();

    if (!purchaseId || !rating) {
      return NextResponse.json({ error: 'Purchase ID and rating are required.' }, { status: 400 });
    }

    const purchase = db.purchases.find((p) => p.id === purchaseId);
    if (!purchase) {
      return NextResponse.json({ error: 'Purchase record not found.' }, { status: 404 });
    }

    if (purchase.buyerId !== session.userId) {
      return NextResponse.json({ error: 'You can only review resources you have purchased.' }, { status: 403 });
    }

    const existingReview = db.reviews.find((r) => r.purchaseId === purchaseId);
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this purchase.' }, { status: 400 });
    }

    const buyerProfile = db.getStudentProfile(session.userId);
    const buyerCollege = buyerProfile?.collegeId ? db.getCollegeById(buyerProfile.collegeId)?.name || 'Chennai College' : 'Chennai College';

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      purchaseId,
      listingId: purchase.listingId,
      buyerId: session.userId,
      buyerName: session.fullName,
      buyerCollege,
      sellerId: purchase.sellerId,
      rating: Number(rating),
      qualityRating: qualityRating ? Number(qualityRating) : Number(rating),
      accuracyRating: accuracyRating ? Number(accuracyRating) : Number(rating),
      valueRating: valueRating ? Number(valueRating) : Number(rating),
      comment: comment?.trim() || 'Verified purchase review.',
      createdAt: new Date().toISOString(),
    };

    db.reviews.unshift(newReview);
    purchase.hasReviewed = true;

    // Recalculate listing average rating
    const listingReviews = db.reviews.filter((r) => r.listingId === purchase.listingId);
    const listing = db.getListingById(purchase.listingId);
    if (listing) {
      const avg = listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length;
      listing.averageRating = Number(avg.toFixed(2));
      listing.totalReviews = listingReviews.length;
    }

    // Recalculate seller metrics & credibility
    const sellerReviews = db.reviews.filter((r) => r.sellerId === purchase.sellerId);
    const sellerProfile = db.getStudentProfile(purchase.sellerId);
    if (sellerProfile) {
      const sellerAvg = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
      sellerProfile.rating = Number(sellerAvg.toFixed(2));
      sellerProfile.reviewCount = sellerReviews.length;
      sellerProfile.credibilityScore = calculateCredibilityScore({
        averageRating: sellerProfile.rating,
        totalSales: sellerProfile.resourcesSoldCount,
        totalReviews: sellerProfile.reviewCount,
        isVerified: sellerProfile.verifiedBadge,
      });

      if (listing) {
        listing.sellerRating = sellerProfile.rating;
        listing.sellerCredibilityScore = sellerProfile.credibilityScore;
      }
    }

    // Send notification to seller
    db.notifications.unshift({
      id: `notif_${Date.now()}_review`,
      userId: purchase.sellerId,
      title: `⭐ New ${rating}-Star Review!`,
      message: `${session.fullName} left a ${rating}★ review on "${purchase.listingTitle}".`,
      type: 'review',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
