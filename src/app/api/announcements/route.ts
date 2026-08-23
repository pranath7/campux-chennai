import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { Announcement, AnnouncementCategory } from '@/types/marketplace';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');
    const category = searchParams.get('category') as AnnouncementCategory | null;

    let items = [...db.announcements];

    if (collegeId && collegeId !== 'all') {
      items = items.filter((a) => a.collegeId === collegeId || a.collegeId === 'all_chennai');
    }

    if (category) {
      items = items.filter((a) => a.category === category);
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      announcements: items,
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

    // Only admin or verified student organizers can post
    const isAuthorized = session.role === 'admin' || session.isVerified;
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Permission denied. Only verified student leads or admins can publish announcements.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, collegeId, organizer, category, date, time, venueOrOnline, registrationLink, imageUrl } = body;

    if (!title || !description || !category || !date) {
      return NextResponse.json({ error: 'Please provide all required announcement details.' }, { status: 400 });
    }

    const college = collegeId === 'all_chennai' ? { name: 'All Chennai Colleges' } : db.getCollegeById(collegeId || session.collegeId || '');

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      collegeId: collegeId || session.collegeId || 'dgvaishnav',
      collegeName: college?.name || 'Chennai College',
      organizer: organizer?.trim() || session.fullName,
      category,
      date,
      time: time || '10:00 AM',
      venueOrOnline: venueOrOnline || 'Campus Auditorium',
      registrationLink: registrationLink || '#',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      isOfficial: session.role === 'admin',
      createdByUserId: session.userId,
      createdAt: new Date().toISOString(),
    };

    db.announcements.unshift(newAnnouncement);

    return NextResponse.json({
      success: true,
      announcement: newAnnouncement,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
