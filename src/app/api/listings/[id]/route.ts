import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { DigitalStorageService } from '@/lib/storage';
import { calculatePriceBreakdown } from '@/lib/payment';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = db.getListingById(id);

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    // Increment view count
    listing.viewsCount += 1;

    // Check caller authentication & purchase status
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    const isOwner = session ? session.userId === listing.sellerId : false;
    const hasPurchased = session ? db.hasPurchased(session.userId, listing.id) : false;
    const isUnlocked = isOwner || hasPurchased;

    // Calculate dynamic price breakdown
    const feeBreakdown = calculatePriceBreakdown(listing.price, db.platformSettings);

    // Reviews for this listing
    const reviews = db.reviews.filter((r) => r.listingId === listing.id);

    // Sample preview content for non-buyers
    const samplePreview = DigitalStorageService.generatePreviewSample(listing);

    return NextResponse.json({
      success: true,
      listing,
      isUnlocked,
      isOwner,
      hasPurchased,
      feeBreakdown,
      reviews,
      samplePreview: isUnlocked ? null : samplePreview,
      downloadToken: isUnlocked && session ? DigitalStorageService.generateDownloadToken(listing.id, session.userId) : null,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
