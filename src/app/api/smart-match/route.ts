import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findSmartMatches } from '@/lib/smartMatch';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId') || '';
    const canonicalKey = searchParams.get('canonicalKey') || '';
    const collegeId = searchParams.get('collegeId') || '';
    const courseName = searchParams.get('courseName') || '';

    let targetListing = listingId ? db.getListingById(listingId) : null;

    if (!targetListing && (canonicalKey || collegeId || courseName)) {
      targetListing = {
        id: 'virtual_query',
        canonicalKey,
        collegeId,
        courseName,
        subjectName: canonicalKey.replace(/_/g, ' ').toUpperCase(),
      } as unknown as typeof db.listings[0];
    }

    if (!targetListing) {
      // Default return cross-college top-rated resources
      return NextResponse.json({
        success: true,
        matches: db.listings.slice(0, 6).map((l) => ({
          listing: l,
          matchType: 'related_subject',
          matchScore: 85,
          collegeDifferenceNote: `High-demand resource across Chennai colleges`,
        })),
      });
    }

    const matches = findSmartMatches(targetListing, db.listings);

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
