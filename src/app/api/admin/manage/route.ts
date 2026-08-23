import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const action = (body.action || '').toUpperCase();
    const targetId = body.targetId || body.submissionId || body.requestId || body.reportId;
    const decision = body.decision || body.status;
    const notes = body.notes || body.reason || body.rejectionReason || '';
    const feeSettings = body.feeSettings || body.data;

    switch (action) {
      case 'APPROVE_PAYMENT':
      case 'RESOLVE_PAYMENT': {
        const ok = db.approvePayment(targetId, session.userId);
        if (!ok) return NextResponse.json({ error: 'Payment submission not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Payment approved and resource unlocked.' });
      }

      case 'REJECT_PAYMENT': {
        const ok = db.rejectPayment(targetId, session.userId, notes || 'Invalid UTR / Screenshot mismatch');
        if (!ok) return NextResponse.json({ error: 'Payment submission not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Payment rejected.' });
      }

      case 'REVIEW_VERIFICATION':
      case 'RESOLVE_VERIFICATION': {
        const ver = db.verifications.find((v) => v.id === targetId);
        if (!ver) return NextResponse.json({ error: 'Verification request not found.' }, { status: 404 });

        ver.status = decision === 'approve' || decision === 'approved' ? 'verified' : 'rejected';
        ver.reviewedAt = new Date().toISOString();
        ver.reviewedBy = session.fullName;
        ver.adminNote = notes;

        const profile = db.getStudentProfile(ver.userId);
        if (profile) {
          profile.verificationStatus = ver.status;
          profile.verifiedBadge = ver.status === 'verified';
          if (ver.status === 'verified') {
            profile.credibilityScore = Math.max(75, profile.credibilityScore + 15);
          }
        }

        return NextResponse.json({ success: true, verification: ver });
      }

      case 'RESOLVE_REPORT': {
        const rep = db.reports.find((r) => r.id === targetId);
        if (!rep) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });

        rep.status = decision === 'resolve' || decision === 'resolved' ? 'resolved' : 'rejected';
        rep.adminNotes = notes;
        rep.resolvedAt = new Date().toISOString();

        return NextResponse.json({ success: true, report: rep });
      }

      case 'UPDATE_FEES': {
        if (feeSettings) {
          if (feeSettings.buyerFeeFixed !== undefined) {
            db.platformSettings.buyerFeeFixed = Number(feeSettings.buyerFeeFixed);
          }
          if (feeSettings.buyerFeePercent !== undefined) {
            db.platformSettings.buyerFeePercentage = Number(feeSettings.buyerFeePercent);
          }
          if (feeSettings.sellerFeePercent !== undefined) {
            db.platformSettings.sellerFeePercentage = Number(feeSettings.sellerFeePercent);
          }
        }
        return NextResponse.json({ success: true, settings: db.platformSettings });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
