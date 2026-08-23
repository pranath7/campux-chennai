import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { Listing, ResourceCategory } from '@/types/marketplace';
import { DigitalStorageService } from '@/lib/storage';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const collegeId = searchParams.get('collegeId') || '';
    const category = searchParams.get('category') as ResourceCategory | null;
    const courseId = searchParams.get('courseId') || '';
    const canonicalKey = searchParams.get('canonicalKey') || '';
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');
    const minRating = Number(searchParams.get('minRating')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 0;
    const sellerId = searchParams.get('sellerId') || '';
    const sort = searchParams.get('sort') || 'recommended';

    let results = [...db.listings].filter((item) => item.status === 'active');

    // 1. Search Query Filter (Title, Subject, Course, Tags, College Name, Seller)
    if (search) {
      results = results.filter((item) => {
        const textToMatch = `${item.title} ${item.subjectName} ${item.courseName} ${item.sellerName} ${item.tags.join(' ')} ${item.collegeId} ${item.description}`.toLowerCase();
        return textToMatch.includes(search);
      });
    }

    // 2. Specific College Filter
    if (collegeId && collegeId !== 'all') {
      results = results.filter((item) => item.collegeId === collegeId);
    }

    // 3. Category Filter
    if (category && category !== 'ALL' as unknown) {
      results = results.filter((item) => item.category === category);
    }

    // 4. Course Filter
    if (courseId) {
      results = results.filter((item) => item.courseId === courseId);
    }

    // 5. Canonical Key Filter
    if (canonicalKey) {
      results = results.filter((item) => item.canonicalKey === canonicalKey);
    }

    // 6. Year Filter
    if (year) {
      results = results.filter((item) => item.year === Number(year));
    }

    // 7. Semester Filter
    if (semester) {
      results = results.filter((item) => item.semester === Number(semester));
    }

    // 8. Min Rating Filter
    if (minRating > 0) {
      results = results.filter((item) => (item.averageRating || 0) >= minRating);
    }

    // 9. Max Price Filter
    if (maxPrice > 0) {
      results = results.filter((item) => item.price <= maxPrice);
    }

    // 10. Seller Filter
    if (sellerId) {
      results = results.filter((item) => item.sellerId === sellerId);
    }

    // Sorting
    switch (sort) {
      case 'popular':
        results.sort((a, b) => b.purchasesCount - a.purchasesCount);
        break;
      case 'rating':
        results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        // Weight by rating, purchases, and seller credibility
        results.sort((a, b) => {
          const scoreA = (a.averageRating || 4.5) * 10 + a.purchasesCount * 0.5 + (a.sellerCredibilityScore || 80) * 0.2;
          const scoreB = (b.averageRating || 4.5) * 10 + b.purchasesCount * 0.5 + (b.sellerCredibilityScore || 80) * 0.2;
          return scoreB - scoreA;
        });
        break;
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      listings: results,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please login to list resources.' }, { status: 401 });
    }

    const profile = db.getStudentProfile(session.userId);
    if (!profile || !profile.verifiedBadge) {
      return NextResponse.json(
        { error: 'Only verified students can create marketplace listings. Please verify your student profile first.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      collegeId,
      courseId,
      courseName,
      subjectId,
      subjectName,
      canonicalKey,
      year,
      semester,
      price,
      pageCount,
      tags,
      previewImageUrl,
    } = body;

    if (!title || !category || !price) {
      return NextResponse.json({ error: 'Title, category, and price are required.' }, { status: 400 });
    }

    const college = db.getCollegeById(collegeId || profile.collegeId);
    const seller = db.getUserById(session.userId);

    const newListingId = `list_${Date.now()}`;
    const storageKey = `vault/${newListingId}.pdf`;

    // Store private simulated file in vault
    DigitalStorageService.storeFile(storageKey, {
      key: storageKey,
      originalFilename: `${title.replace(/\s+/g, '_')}.pdf`,
      mimeType: 'application/pdf',
      sizeBytes: (Number(pageCount) || 15) * 150000,
      samplePreviewText: DigitalStorageService.generatePreviewSample({
        title,
        subjectName,
        courseName,
        collegeId: college?.name,
        category,
        pageCount: Number(pageCount) || 15,
      }),
    });

    const newListing: Listing = {
      id: newListingId,
      sellerId: session.userId,
      sellerName: session.fullName,
      sellerCollegeId: college?.name || 'Chennai College',
      sellerAvatarUrl: seller?.avatarUrl,
      sellerCredibilityScore: profile.credibilityScore,
      sellerRating: profile.rating,
      sellerVerified: profile.verifiedBadge,
      title: title.trim(),
      description: description?.trim() || '',
      category,
      collegeId: college?.id || profile.collegeId,
      courseId: courseId || profile.courseId,
      courseName: courseName || 'Undergraduate Course',
      subjectId: subjectId || 'sub_general',
      subjectName: subjectName || 'Core Subject',
      canonicalKey: canonicalKey || subjectName?.toLowerCase().replace(/\s+/g, '_') || 'academic_notes',
      year: Number(year) || profile.year || 1,
      semester: Number(semester) || profile.semester || 1,
      price: Number(price),
      pageCount: Number(pageCount) || 20,
      fileFormat: 'PDF',
      fileSizeFormatted: `${((Number(pageCount) || 20) * 0.15).toFixed(1)} MB`,
      storageKey,
      previewImageUrls: previewImageUrl ? [previewImageUrl] : ['https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'],
      tags: Array.isArray(tags) ? tags : ['Notes', category, subjectName],
      status: 'active',
      viewsCount: 1,
      purchasesCount: 0,
      averageRating: 5.0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.listings.unshift(newListing);
    profile.resourcesListedCount += 1;

    // Mirror to Supabase listings table
    try {
      await supabaseAdmin.from('listings').insert({
        id: newListing.id,
        seller_id: newListing.sellerId,
        seller_name: newListing.sellerName,
        seller_college_id: newListing.sellerCollegeId,
        seller_avatar_url: newListing.sellerAvatarUrl || null,
        seller_credibility_score: newListing.sellerCredibilityScore,
        seller_rating: newListing.sellerRating,
        seller_verified: newListing.sellerVerified,
        title: newListing.title,
        description: newListing.description,
        category: newListing.category,
        college_id: newListing.collegeId,
        course_id: newListing.courseId,
        course_name: newListing.courseName,
        subject_id: newListing.subjectId,
        subject_name: newListing.subjectName,
        canonical_key: newListing.canonicalKey,
        year: newListing.year,
        semester: newListing.semester,
        price: newListing.price,
        page_count: newListing.pageCount,
        file_format: newListing.fileFormat,
        file_size_formatted: newListing.fileSizeFormatted,
        storage_key: newListing.storageKey,
        preview_image_urls: JSON.stringify(newListing.previewImageUrls || []),
        tags: JSON.stringify(newListing.tags || []),
        status: newListing.status,
        views_count: 1,
        purchases_count: 0,
        average_rating: 5.0,
        total_reviews: 0,
      });
    } catch (sbErr) {
      console.error('Supabase listing insert error:', sbErr);
    }

    return NextResponse.json({
      success: true,
      listing: newListing,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
