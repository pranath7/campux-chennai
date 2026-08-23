import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { DigitalStorageService } from '@/lib/storage';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tokenParam = searchParams.get('token');

    const listing = db.getListingById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    // 1. Check Session Cookie
    const sessionToken = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(sessionToken);

    let isAuthorized = false;
    let buyerName = 'Verified Student';

    if (session) {
      const isOwner = session.userId === listing.sellerId;
      const hasPurchased = db.hasPurchased(session.userId, listing.id);
      if (isOwner || hasPurchased) {
        isAuthorized = true;
        buyerName = session.fullName;
      }
    }

    // 2. Fallback check signed download token
    if (!isAuthorized && tokenParam) {
      const tokenVerification = DigitalStorageService.verifyDownloadToken(tokenParam);
      if (tokenVerification.valid && tokenVerification.listingId === id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Access denied. You must purchase this resource to unlock the complete digital file.' },
        { status: 403 }
      );
    }

    // Generate authenticated, watermarked digital resource deliverable
    const unlockedContent = `================================================================================
CAMPUX CHENNAI — SECURE DIGITAL ACADEMIC REPOSITORY
AUTHENTICATED RESOURCE DELIVERY
================================================================================

TITLE: ${listing.title}
SUBJECT: ${listing.subjectName} (${listing.courseName})
COLLEGE: ${listing.sellerCollegeId}
CATEGORY: ${listing.category}
CREATOR / SELLER: ${listing.sellerName} (Credibility: ${listing.sellerCredibilityScore}/100)
LICENSED TO: ${buyerName}
DOWNLOAD TIMESTAMP: ${new Date().toUTCString()}
SECURITY WATERMARK: VERIFIED_ENROLLMENT_TOKEN_${id}_${Date.now()}

--------------------------------------------------------------------------------
ACADEMIC INTEGRITY & USAGE POLICY:
This document is licensed for your personal individual academic study and revision.
Unauthorized re-distribution, reselling, or uploading to third-party file lockers
is strictly prohibited under platform Trust & Safety policies.
--------------------------------------------------------------------------------

TABLE OF CONTENTS & CURRICULUM SYLLABUS:
1. Executive Concept Summary & Formula Key
2. Step-by-step Standard Model Solutions & Journal Ledgers
3. University Previous-Year Exam Trends & Examiner Mark Breakdowns
4. Practice Drills, Solved Case Studies & High-Yield Revisions

================================================================================
SECTION 1: CORE THEORETICAL FOUNDATION & WORKING METHODOLOGY
================================================================================

[Full high-resolution unlocked resource content compiled by ${listing.sellerName}]

• Key Concept Breakdown:
  - Standard definitions aligned with Madras University / Chennai Collegiate curriculum.
  - Critical exam pitfalls and presentation format tips to secure maximum marks.

• Worked Example #1:
  - Complete journal entries / algorithm trace / proof steps.
  - Working notes and ledger reconciliation tables.

• Worked Example #2:
  - Advanced scenario analysis and final balance verification.

================================================================================
END OF DOCUMENT — VERIFIED & DIGITALLY UNLOCKED VIA CAMPUX
================================================================================`;

    return new NextResponse(unlockedContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${listing.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Unlocked.txt"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
