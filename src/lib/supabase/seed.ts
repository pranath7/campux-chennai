import { supabaseAdmin } from './admin';
import {
  SEED_COLLEGES,
  SEED_COURSES,
  SEED_SUBJECTS,
  SEED_LISTINGS,
  SEED_STUDY_GROUPS,
  SEED_ANNOUNCEMENTS,
} from '../db';

export async function seedSupabase() {
  console.log('🌱 Starting Supabase Seeding...');

  // 1. Colleges
  const collegesPayload = SEED_COLLEGES.map((c) => ({
    id: c.id,
    name: c.name,
    short_name: c.shortName,
    city: c.city,
    state: c.state,
    address: c.address,
    website: c.website || null,
    status: c.status,
    logo_url: c.logoUrl || null,
    email_domains: JSON.stringify(c.emailDomains),
    banner_gradient: c.bannerGradient,
  }));
  const { error: errColleges } = await supabaseAdmin.from('colleges').upsert(collegesPayload, { onConflict: 'id' });
  if (errColleges) console.error('Error seeding colleges:', errColleges);
  else console.log('✓ Colleges seeded:', collegesPayload.length);

  // 2. Courses
  const coursesPayload = SEED_COURSES.map((c) => ({
    id: c.id,
    college_id: c.collegeId,
    name: c.name,
    code: c.code,
    duration_years: c.durationYears,
    total_semesters: c.totalSemesters,
  }));
  const { error: errCourses } = await supabaseAdmin.from('courses').upsert(coursesPayload, { onConflict: 'id' });
  if (errCourses) console.error('Error seeding courses:', errCourses);
  else console.log('✓ Courses seeded:', coursesPayload.length);

  // 3. Subjects
  const subjectsPayload = SEED_SUBJECTS.map((s) => ({
    id: s.id,
    course_id: s.courseId,
    college_id: s.collegeId,
    name: s.name,
    code: s.code,
    year: s.year,
    semester: s.semester,
    canonical_key: s.canonicalKey,
    tags: JSON.stringify(s.tags || []),
    status: s.status || 'active',
  }));
  const { error: errSubjects } = await supabaseAdmin.from('subjects').upsert(subjectsPayload, { onConflict: 'id' });
  if (errSubjects) console.error('Error seeding subjects:', errSubjects);
  else console.log('✓ Subjects seeded:', subjectsPayload.length);

  // 4. Initial Verified Listings
  const listingsPayload = SEED_LISTINGS.map((l) => ({
    id: l.id,
    seller_id: l.sellerId,
    seller_name: l.sellerName,
    seller_college_id: l.sellerCollegeId,
    seller_avatar_url: l.sellerAvatarUrl || null,
    seller_credibility_score: l.sellerCredibilityScore,
    seller_rating: l.sellerRating,
    seller_verified: l.sellerVerified,
    title: l.title,
    description: l.description,
    category: l.category,
    college_id: l.collegeId,
    course_id: l.courseId,
    course_name: l.courseName,
    subject_id: l.subjectId,
    subject_name: l.subjectName,
    canonical_key: l.canonicalKey,
    year: l.year,
    semester: l.semester,
    price: l.price,
    page_count: l.pageCount,
    file_format: l.fileFormat,
    file_size_formatted: l.fileSizeFormatted,
    storage_key: l.storageKey,
    preview_image_urls: JSON.stringify(l.previewImageUrls || []),
    tags: JSON.stringify(l.tags || []),
    status: l.status || 'active',
    views_count: l.viewsCount || 0,
    purchases_count: l.purchasesCount || 0,
    average_rating: l.averageRating || 5.0,
    total_reviews: l.totalReviews || 0,
  }));
  const { error: errListings } = await supabaseAdmin.from('listings').upsert(listingsPayload, { onConflict: 'id' });
  if (errListings) console.error('Error seeding listings:', errListings);
  else console.log('✓ Listings seeded:', listingsPayload.length);

  // 5. Study Groups
  const studyGroupsPayload = SEED_STUDY_GROUPS.map((sg) => ({
    id: sg.id,
    title: sg.title,
    description: sg.description,
    subject_id: sg.subjectName,
    subject_name: sg.subjectName,
    college_id: sg.collegeId,
    college_name: sg.collegeId,
    host_id: sg.hostId,
    host_name: sg.hostName,
    host_avatar_url: sg.hostAvatarUrl || null,
    host_credibility_score: sg.hostCredibilityScore,
    date: sg.date,
    time: sg.startTime,
    duration_minutes: sg.durationMinutes,
    fee: sg.price,
    max_participants: sg.maxParticipants,
    current_participants: sg.currentParticipantsCount,
    meeting_link: sg.meetingLink,
    tags: JSON.stringify([]),
    status: sg.status || 'upcoming',
  }));
  const { error: errStudyGroups } = await supabaseAdmin.from('study_groups').upsert(studyGroupsPayload, { onConflict: 'id' });
  if (errStudyGroups) console.error('Error seeding study groups:', errStudyGroups);
  else console.log('✓ Study groups seeded:', studyGroupsPayload.length);

  // 6. Announcements
  const announcementsPayload = SEED_ANNOUNCEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.description,
    category: a.category,
    college_id: a.collegeId,
    college_name: a.collegeName,
    author_id: a.createdByUserId,
    author_name: a.organizer,
    date: a.date,
    deadline_date: a.date,
    cta_label: 'View Details',
    cta_url: a.registrationLink || null,
    is_pinned: a.isOfficial || false,
  }));
  const { error: errAnnouncements } = await supabaseAdmin.from('announcements').upsert(announcementsPayload, { onConflict: 'id' });
  if (errAnnouncements) console.error('Error seeding announcements:', errAnnouncements);
  else console.log('✓ Announcements seeded:', announcementsPayload.length);

  console.log('🎉 Supabase Seeding Complete!');
}
