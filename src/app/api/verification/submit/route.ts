import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { VerificationRequest } from '@/types/marketplace';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please login to submit verification.' }, { status: 401 });
    }

    const { method, collegeEmail, studentIdDocUrl } = await req.json();

    const profile = db.getStudentProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const college = db.getCollegeById(profile.collegeId);
    if (!college) {
      return NextResponse.json({ error: 'Associated college not found.' }, { status: 404 });
    }

    // Method 1: Instant Institutional Email matching
    if (method === 'college_email' && collegeEmail) {
      const emailDomain = collegeEmail.split('@')[1]?.toLowerCase();
      const isValidDomain = college.emailDomains.some((d) => emailDomain?.includes(d));

      if (isValidDomain) {
        profile.verificationStatus = 'verified';
        profile.verificationMethod = 'college_email';
        profile.verifiedBadge = true;
        profile.verificationDate = new Date().toISOString();
        profile.credibilityScore = Math.max(65, profile.credibilityScore + 15);

        db.notifications.unshift({
          id: `notif_${Date.now()}_ver`,
          userId: session.userId,
          title: '✓ Instant Email Verified!',
          message: `Your college email (${collegeEmail}) matches ${college.name}. You are now a Verified Student with listing privileges!`,
          type: 'verification',
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          status: 'verified',
          message: 'Institutional email successfully verified!',
          profile,
        });
      } else {
        return NextResponse.json(
          {
            error: `Domain @${emailDomain} does not match ${college.name} approved domains (${college.emailDomains.join(', ')}). You can upload a Student ID instead.`,
          },
          { status: 400 }
        );
      }
    }

    // Method 2: Student ID Document upload for Admin Review
    const newReq: VerificationRequest = {
      id: `ver_${Date.now()}`,
      userId: session.userId,
      studentName: session.fullName,
      collegeId: profile.collegeId,
      collegeName: college.name,
      courseName: profile.courseId,
      year: profile.year,
      email: session.email,
      method: 'student_id',
      studentIdDocUrl: studentIdDocUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.verifications.unshift(newReq);
    profile.verificationStatus = 'pending';
    profile.verificationMethod = 'student_id';
    profile.studentIdDocUrl = newReq.studentIdDocUrl;

    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Student ID submitted for review. An administrator will verify your credentials shortly.',
      verificationRequest: newReq,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
