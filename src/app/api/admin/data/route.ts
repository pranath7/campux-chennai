import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin authentication required.' }, { status: 401 });
    }

    // 1. Calculations & Metrics
    const students = db.users.filter((u) => u.role === 'student');
    const activeStudents = students.filter((u) => !u.isSuspended && !u.isBanned);
    const colleges = db.colleges;
    const notes = db.listings;
    const pendingListings = notes.filter((n) => n.status === 'pending' || n.status === 'under_review');
    
    // Purchases & Revenue
    const verifiedPurchases = db.purchases.filter((p) => p.paymentStatus === 'verified' || p.paymentStatus === 'successful');
    const totalTransactionValue = verifiedPurchases.reduce((sum, p) => sum + (p.totalAmountPaid || p.basePrice), 0);
    const platformRevenue = verifiedPurchases.reduce((sum, p) => sum + (p.platformRevenue || 0), 0);
    const buyerFees = verifiedPurchases.reduce((sum, p) => sum + (p.buyerFee || 0), 0);
    const sellerFees = verifiedPurchases.reduce((sum, p) => sum + (p.sellerFee || 0), 0);

    // Payments Awaiting Verification
    const pendingPayments = db.paymentSubmissions.filter((p) => p.status === 'submitted' || p.status === 'pending');
    
    // Reports & Safety
    const openReports = db.reports.filter((r) => r.status === 'open' || r.status === 'under_review');
    
    // Support Tickets
    const openTickets = db.supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress');

    // Study Groups
    const activeStudyGroups = db.studyGroups.filter((g) => g.status === 'upcoming' || g.status === 'live');
    const studyGroupRevenue = db.studyGroupParticipants
      .filter((p) => p.paymentStatus === 'successful' || p.paymentStatus === 'verified')
      .reduce((sum, p) => sum + Math.round(p.amountPaid * (db.platformSettings.studyGroupFeePercentage || 0.1)), 0);

    const metrics = {
      totalStudents: students.length,
      activeStudents: activeStudents.length,
      totalColleges: colleges.length,
      totalNotes: notes.length,
      totalPurchases: verifiedPurchases.length,
      totalTransactionValue,
      platformRevenue,
      buyerFees,
      sellerFees,
      studyGroupRevenue,
      pendingPaymentVerifications: pendingPayments.length,
      pendingListings: pendingListings.length,
      openReports: openReports.length,
      openSupportTickets: openTickets.length,
      activeStudyGroups: activeStudyGroups.length,
    };

    // 2. Action Required Breakdown
    const actionRequired = {
      pendingPaymentsCount: pendingPayments.length,
      pendingPayments: pendingPayments.slice(0, 10),
      pendingListingsCount: pendingListings.length,
      pendingListings: pendingListings.slice(0, 10),
      openReportsCount: openReports.length,
      openReports: openReports.slice(0, 10),
      openTicketsCount: openTickets.length,
      openTickets: openTickets.slice(0, 10),
    };

    // 3. Enrich Students with Profile and Activity
    const enrichedStudents = students.map((s) => {
      const profile = db.getStudentProfile(s.id);
      const studentPurchases = db.purchases.filter((p) => p.buyerId === s.id);
      const studentSales = db.purchases.filter((p) => p.sellerId === s.id && (p.paymentStatus === 'verified' || p.paymentStatus === 'successful'));
      const studentListings = db.listings.filter((l) => l.sellerId === s.id);
      const studentReviews = db.reviews.filter((r) => r.buyerId === s.id);
      const studentReports = db.reports.filter((r) => r.reportedUserId === s.id || r.reporterUserId === s.id);
      const college = profile?.collegeId ? db.getCollegeById(profile.collegeId) : null;

      return {
        ...s,
        collegeId: profile?.collegeId || 'dgvaishnav',
        collegeName: profile?.collegeName || college?.name || 'DG Vaishnav College',
        courseId: profile?.courseId || 'dgvc_bcom_gen',
        courseName: profile?.courseName || 'B.Com',
        year: profile?.year || 2,
        section: profile?.section || 'B',
        credibilityScore: profile?.credibilityScore || 70,
        rating: profile?.rating || 5.0,
        reviewCount: profile?.reviewCount || 0,
        verifiedBadge: profile?.verifiedBadge || false,
        totalPurchasesCount: studentPurchases.length,
        totalSalesCount: studentSales.length,
        totalListingsCount: studentListings.length,
        purchases: studentPurchases,
        sales: studentSales,
        listings: studentListings,
        reviews: studentReviews,
        reports: studentReports,
      };
    });

    // 4. Sellers Directory
    const sellerIds = Array.from(new Set(db.listings.map((l) => l.sellerId)));
    const enrichedSellers = sellerIds.map((sellerId) => {
      const user = db.getUserById(sellerId);
      const profile = db.getStudentProfile(sellerId);
      const sellerListings = db.listings.filter((l) => l.sellerId === sellerId);
      const sellerSales = db.purchases.filter((p) => p.sellerId === sellerId && (p.paymentStatus === 'verified' || p.paymentStatus === 'successful'));
      const grossSales = sellerSales.reduce((sum, p) => sum + p.basePrice, 0);
      const netEarnings = sellerSales.reduce((sum, p) => sum + p.sellerNetAmount, 0);
      const sellerReports = db.reports.filter((r) => r.reportedUserId === sellerId);

      return {
        sellerId,
        sellerName: user?.fullName || 'Seller',
        sellerEmail: user?.email || '',
        sellerMobile: user?.mobile || '',
        sellerCollege: profile?.collegeName || 'Chennai Institution',
        credibilityScore: profile?.credibilityScore || 75,
        rating: profile?.rating || 5.0,
        reviewCount: profile?.reviewCount || 0,
        resourcesListedCount: sellerListings.length,
        salesCount: sellerSales.length,
        grossSales,
        netEarnings,
        reportsCount: sellerReports.length,
        status: user?.isSuspended ? (user.isBanned ? 'banned' : 'suspended') : 'active',
      };
    });

    // 5. Revenue by College & Category Analytics
    const collegeRevenueMap: Record<string, number> = {};
    const categoryRevenueMap: Record<string, number> = {};

    verifiedPurchases.forEach((p) => {
      collegeRevenueMap[p.buyerCollegeId] = (collegeRevenueMap[p.buyerCollegeId] || 0) + p.platformRevenue;
      categoryRevenueMap[p.listingCategory] = (categoryRevenueMap[p.listingCategory] || 0) + p.platformRevenue;
    });

    return NextResponse.json({
      success: true,
      metrics,
      actionRequired,
      payments: db.paymentSubmissions,
      transactions: db.purchases,
      revenueAnalytics: {
        totalGMV: totalTransactionValue,
        platformRevenue,
        buyerFees,
        sellerFees,
        studyGroupRevenue,
        netRevenue: platformRevenue + studyGroupRevenue,
        collegeRevenueMap,
        categoryRevenueMap,
      },
      students: enrichedStudents,
      sellers: enrichedSellers,
      colleges: db.colleges,
      courses: db.courses,
      subjects: db.subjects,
      marketplace: db.listings,
      reviews: db.reviews,
      studyGroups: db.studyGroups,
      announcements: db.announcements,
      reports: db.reports,
      supportTickets: db.supportTickets,
      auditLogs: db.auditLogs,
      platformSettings: db.platformSettings,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
