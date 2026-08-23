import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { Report, ReportReason } from '@/types/marketplace';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please login to submit a trust report.' }, { status: 401 });
    }

    const { reportedListingId, reportedUserId, reportedStudyGroupId, reason, description } = await req.json();

    if (!reason || !description) {
      return NextResponse.json({ error: 'Reason and description are required.' }, { status: 400 });
    }

    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterUserId: session.userId,
      reporterName: session.fullName,
      reportedUserId,
      reportedListingId,
      reportedStudyGroupId,
      reason: reason as ReportReason,
      description: description.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    db.reports.unshift(newReport);

    // Add audit log
    db.logAudit(
      session.userId,
      session.fullName,
      'TRUST_REPORT_FILED',
      reportedListingId ? 'LISTING' : 'USER',
      reportedListingId || reportedUserId || 'UNKNOWN',
      `Reason: ${reason}. Summary: ${description.slice(0, 80)}`
    );

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Thank you for helping keep Campux safe. Our Trust & Safety team has received your report.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
