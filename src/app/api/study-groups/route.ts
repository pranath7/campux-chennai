import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { StudyGroup } from '@/types/marketplace';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');
    const subject = searchParams.get('subject')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();

    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    let groups = [...db.studyGroups];

    if (collegeId && collegeId !== 'all') {
      groups = groups.filter((g) => g.collegeId === collegeId);
    }

    if (subject) {
      groups = groups.filter((g) => g.subjectName.toLowerCase().includes(subject));
    }

    if (search) {
      groups = groups.filter(
        (g) =>
          g.title.toLowerCase().includes(search) ||
          g.subjectName.toLowerCase().includes(search) ||
          g.hostName.toLowerCase().includes(search) ||
          g.description.toLowerCase().includes(search)
      );
    }

    // Mask meeting links if caller has not joined and is not host
    const sanitized = groups.map((g) => {
      const isHost = session ? session.userId === g.hostId : false;
      const hasJoined = session ? db.hasJoinedStudyGroup(session.userId, g.id) : false;
      const isUnlocked = isHost || hasJoined;

      return {
        ...g,
        meetingLink: isUnlocked ? g.meetingLink : null,
        meetingInstructions: isUnlocked ? g.meetingInstructions : null,
        isUnlocked,
        isHost,
        hasJoined,
        availableSeats: Math.max(0, g.maxParticipants - g.currentParticipantsCount),
        isFull: g.currentParticipantsCount >= g.maxParticipants,
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitized.length,
      studyGroups: sanitized,
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
      return NextResponse.json({ error: 'Please login to host study groups.' }, { status: 401 });
    }

    const profile = db.getStudentProfile(session.userId);
    if (!profile || !profile.verifiedBadge) {
      return NextResponse.json({ error: 'Only verified students can host paid study groups.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      subjectName,
      courseName,
      date,
      startTime,
      durationMinutes,
      price,
      maxParticipants,
      meetingPlatform,
      meetingLink,
      meetingInstructions,
    } = body;

    if (!title || !subjectName || !date || !startTime || !meetingLink) {
      return NextResponse.json({ error: 'Please provide all required session details.' }, { status: 400 });
    }

    const newGroup: StudyGroup = {
      id: `sg_${Date.now()}`,
      hostId: session.userId,
      hostName: session.fullName,
      hostCollegeId: profile.collegeId,
      hostAvatarUrl: db.getUserById(session.userId)?.avatarUrl,
      hostCredibilityScore: profile.credibilityScore,
      hostRating: profile.rating,
      hostVerified: profile.verifiedBadge,
      title: title.trim(),
      description: description?.trim() || '',
      subjectName: subjectName.trim(),
      courseName: courseName?.trim() || 'Degree Course',
      collegeId: profile.collegeId,
      year: profile.year,
      date,
      startTime,
      durationMinutes: Number(durationMinutes) || 60,
      price: Number(price) || 0,
      maxParticipants: Number(maxParticipants) || 20,
      currentParticipantsCount: 0,
      meetingPlatform: meetingPlatform || 'Google Meet',
      meetingLink: meetingLink.trim(),
      meetingInstructions: meetingInstructions?.trim() || 'Join promptly with mic & notebook ready.',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    db.studyGroups.unshift(newGroup);

    return NextResponse.json({
      success: true,
      studyGroup: newGroup,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
