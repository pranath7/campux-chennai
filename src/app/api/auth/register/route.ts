import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { User, StudentProfile } from '@/types/marketplace';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, collegeId, courseId, year, section, semester } = body;

    if (!fullName || !mobile || !collegeId || !courseId) {
      return NextResponse.json(
        { error: 'Please provide Full Name, Mobile Number, College, Course, and Year.' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.trim();
    const existing = db.getUserByMobileOrEmail(cleanMobile);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this mobile number already exists. Please log in.' },
        { status: 409 }
      );
    }

    const college = db.getCollegeById(collegeId) || db.colleges[0];
    const userEmail = email ? email.trim().toLowerCase() : `${cleanMobile}@campux.local`;

    const newUserId = `user_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: userEmail,
      role: 'student',
      passwordHash: 'student123',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    };

    const newProfile: StudentProfile = {
      userId: newUserId,
      collegeId: college.id,
      collegeName: college.name,
      courseId: courseId || 'dgvc_bcom_gen',
      year: Number(year) || 1,
      section: (section || 'A').toUpperCase().trim(),
      semester: Number(semester) || (Number(year) ? Number(year) * 2 - 1 : 1),
      verificationStatus: 'unverified',
      verifiedBadge: false,
      credibilityScore: 50,
      rating: 0,
      reviewCount: 0,
      resourcesSoldCount: 0,
      resourcesListedCount: 0,
    };

    db.users.push(newUser);
    db.studentProfiles.push(newProfile);

    // Mirror to Supabase PostgreSQL database
    try {
      await supabaseAdmin.from('profiles').insert({
        user_id: newUserId,
        full_name: newUser.fullName,
        mobile: newUser.mobile,
        email: newUser.email,
        role: 'student',
        college_id: college.id,
        college_name: college.name,
        course_id: courseId,
        course_name: newProfile.courseName,
        year: newProfile.year,
        section: newProfile.section,
        semester: newProfile.semester,
        avatar_url: newUser.avatarUrl,
        verification_status: 'unverified',
        verified_badge: false,
        credibility_score: 50,
        rating: 0,
        review_count: 0,
        resources_sold_count: 0,
        resources_listed_count: 0,
      });
    } catch (sbErr) {
      console.error('Supabase profile registration error:', sbErr);
    }

    // Welcome notification
    db.notifications.push({
      id: `notif_${Date.now()}`,
      userId: newUserId,
      title: '👋 Welcome to Campux Chennai',
      message: `Welcome ${fullName}! You are registered under ${college.name} (Year ${newProfile.year}, Sec ${newProfile.section}).`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    const token = AuthService.createSessionToken(newUser);

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        profile: newProfile,
        college,
      },
      token,
    });

    response.cookies.set(AuthService.getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
