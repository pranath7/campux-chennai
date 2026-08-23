import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { PayoutDetails } from '@/types/marketplace';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const profile = db.getStudentProfile ? db.getStudentProfile(session.userId) : db.studentProfiles.find(p => p.userId === session.userId);
    const payout = profile?.payoutDetails;

    // Mask sensitive banking numbers on response
    let safePayout = null;
    if (payout) {
      safePayout = {
        ...payout,
        accountNumber: undefined, // Never expose raw bank account over GET API
      };
    }

    return NextResponse.json({
      success: true,
      payoutDetails: safePayout,
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
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { payoutMethod, upiId, accountHolder, bankName, accountNumber, ifsc } = body;

    let payoutData: PayoutDetails;

    if (payoutMethod === 'upi') {
      if (!upiId || !upiId.includes('@') || upiId.trim().length < 5) {
        return NextResponse.json({ error: 'Please enter a valid UPI ID (e.g. yourname@okaxis or mobile@paytm).' }, { status: 400 });
      }

      payoutData = {
        payoutMethod: 'upi',
        upiId: upiId.trim(),
        accountHolder: (accountHolder || session.fullName).trim(),
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      };
    } else if (payoutMethod === 'bank') {
      if (!accountHolder || accountHolder.trim().length < 2) {
        return NextResponse.json({ error: 'Please enter the Account Holder Name.' }, { status: 400 });
      }
      if (!bankName || bankName.trim().length < 2) {
        return NextResponse.json({ error: 'Please enter the Bank Name.' }, { status: 400 });
      }
      if (!accountNumber || accountNumber.trim().length < 8) {
        return NextResponse.json({ error: 'Please enter a valid Bank Account Number (at least 8-18 digits).' }, { status: 400 });
      }
      if (!ifsc || ifsc.trim().length < 6) {
        return NextResponse.json({ error: 'Please enter a valid 11-character IFSC Code.' }, { status: 400 });
      }

      const rawAcc = accountNumber.trim();
      const last4 = rawAcc.slice(-4);
      const maskedAcc = `•••• •••• ${last4}`;

      payoutData = {
        payoutMethod: 'bank',
        accountHolder: accountHolder.trim(),
        bankName: bankName.trim(),
        accountNumber: rawAcc,
        accountNumberMasked: maskedAcc,
        ifsc: ifsc.trim().toUpperCase(),
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: 'Invalid payout method selected.' }, { status: 400 });
    }

    // Direct and method update
    const profile = db.studentProfiles.find(p => p.userId === session.userId);
    if (profile) {
      profile.payoutDetails = payoutData;
    }
    if (typeof db.updateStudentProfile === 'function') {
      db.updateStudentProfile(session.userId, { payoutDetails: payoutData });
    }

    return NextResponse.json({
      success: true,
      message: payoutMethod === 'upi' ? 'UPI Payout method linked successfully!' : 'Bank Account linked successfully!',
      payoutDetails: {
        ...payoutData,
        accountNumber: undefined, // Return masked representation
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
