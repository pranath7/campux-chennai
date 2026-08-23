import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');

    if (collegeId) {
      const college = db.getCollegeById(collegeId);
      if (!college) {
        return NextResponse.json({ error: 'College not found' }, { status: 404 });
      }
      const courses = db.courses.filter((c) => c.collegeId === collegeId);
      const subjects = db.subjects.filter((s) => s.collegeId === collegeId);

      return NextResponse.json({
        success: true,
        college,
        courses,
        subjects,
      });
    }

    return NextResponse.json({
      success: true,
      colleges: db.colleges,
      courses: db.courses,
      subjects: db.subjects,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
