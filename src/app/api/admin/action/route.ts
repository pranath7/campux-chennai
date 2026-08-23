import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin privileges required.' }, { status: 401 });
    }

    const body = await req.json();
    const { action, targetId, payload } = body;

    switch (action) {
      // 1. Payment Verification
      case 'APPROVE_PAYMENT': {
        const success = db.approvePayment(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Payment submission not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Payment approved. Resource unlocked and student notified.' });
      }

      case 'REJECT_PAYMENT': {
        const reason = payload?.reason || 'Invalid transaction details';
        const success = db.rejectPayment(targetId, session.userId, reason);
        if (!success) return NextResponse.json({ error: 'Payment submission not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Payment rejected with reason: ${reason}` });
      }

      // 2. Student Management
      case 'SUSPEND_STUDENT': {
        const reason = payload?.reason || 'Suspended by admin for policy violation';
        const isBanned = !!payload?.isBanned;
        const success = db.suspendStudent(targetId, isBanned, reason, session.userId);
        if (!success) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Student ${isBanned ? 'banned' : 'suspended'} successfully.` });
      }

      case 'RESTORE_STUDENT': {
        const success = db.restoreStudent(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Student account restored successfully.' });
      }

      // 3. Marketplace Listings
      case 'APPROVE_LISTING': {
        const success = db.approveListing(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Resource approved and published to marketplace.' });
      }

      case 'REJECT_LISTING': {
        const reason = payload?.reason || 'Does not meet academic publishing quality guidelines';
        const success = db.rejectListing(targetId, reason, session.userId);
        if (!success) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Listing rejected: ${reason}` });
      }

      case 'REMOVE_LISTING': {
        const reason = payload?.reason || 'Removed by admin';
        const success = db.removeListing(targetId, reason, session.userId);
        if (!success) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Resource removed from marketplace.` });
      }

      case 'TOGGLE_HIDE_LISTING': {
        const success = db.hideListing(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Listing visibility toggled.' });
      }

      // 4. Reports & Safety
      case 'RESOLVE_REPORT': {
        const actionTaken = payload?.actionTaken || 'Investigated and resolved';
        const adminNotes = payload?.adminNotes || '';
        const success = db.resolveReport(targetId, actionTaken, adminNotes, session.userId);
        if (!success) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Report resolved successfully.' });
      }

      case 'DISMISS_REPORT': {
        const success = db.dismissReport(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Report dismissed.' });
      }

      // 5. Support Tickets
      case 'REPLY_SUPPORT_TICKET': {
        const message = payload?.message || '';
        const newStatus = payload?.newStatus;
        const adminNotes = payload?.adminNotes;
        if (!message) return NextResponse.json({ error: 'Reply message cannot be empty.' }, { status: 400 });
        const success = db.replySupportTicket(targetId, message, newStatus, adminNotes, session.userId);
        if (!success) return NextResponse.json({ error: 'Support ticket not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Reply added to ticket.' });
      }

      // 6. Broadcast Notification
      case 'BROADCAST_NOTIFICATION': {
        const { target, title, message } = payload;
        if (!title || !message) {
          return NextResponse.json({ error: 'Title and message are required for notifications.' }, { status: 400 });
        }
        const count = db.broadcastNotification(target, title, message, session.userId);
        return NextResponse.json({ success: true, message: `Notification dispatched to ${count} students.` });
      }

      // 7. Colleges
      case 'ADD_COLLEGE': {
        const newCol = db.addCollege(payload, session.userId);
        return NextResponse.json({ success: true, college: newCol, message: 'College added successfully.' });
      }

      case 'UPDATE_COLLEGE': {
        const updatedCol = db.updateCollege(targetId, payload, session.userId);
        if (!updatedCol) return NextResponse.json({ error: 'College not found.' }, { status: 404 });
        return NextResponse.json({ success: true, college: updatedCol, message: 'College details updated.' });
      }

      case 'TOGGLE_COLLEGE_STATUS': {
        const col = db.toggleCollegeStatus(targetId, session.userId);
        if (!col) return NextResponse.json({ error: 'College not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `${col.name} status updated to ${col.status}.` });
      }

      // 8. Academic Structure (Courses & Subjects)
      case 'ADD_COURSE': {
        const newCourse = db.addCourse(payload, session.userId);
        return NextResponse.json({ success: true, course: newCourse, message: 'Course added to catalog.' });
      }

      case 'ADD_SUBJECT': {
        const newSubject = db.addSubject(payload, session.userId);
        return NextResponse.json({ success: true, subject: newSubject, message: 'Subject added to academic mapping.' });
      }

      case 'TOGGLE_SUBJECT_STATUS': {
        const sub = db.toggleSubjectStatus(targetId, session.userId);
        if (!sub) return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Subject status toggled to ${sub.status}.` });
      }

      // 9. Reviews
      case 'DELETE_REVIEW': {
        const success = db.deleteReview(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Review removed from listing.' });
      }

      // 10. Study Groups
      case 'UPDATE_STUDY_GROUP_STATUS': {
        const status = payload?.status || 'cancelled';
        const success = db.updateStudyGroupStatus(targetId, status, session.userId);
        if (!success) return NextResponse.json({ error: 'Study group not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: `Study group marked as ${status}.` });
      }

      // 11. Announcements
      case 'CREATE_ANNOUNCEMENT': {
        const ann = db.createAnnouncement(payload, session.userId);
        return NextResponse.json({ success: true, announcement: ann, message: 'Announcement published.' });
      }

      case 'UPDATE_ANNOUNCEMENT': {
        const ann = db.updateAnnouncement(targetId, payload, session.userId);
        if (!ann) return NextResponse.json({ error: 'Announcement not found.' }, { status: 404 });
        return NextResponse.json({ success: true, announcement: ann, message: 'Announcement updated.' });
      }

      case 'DELETE_ANNOUNCEMENT': {
        const success = db.deleteAnnouncement(targetId, session.userId);
        if (!success) return NextResponse.json({ error: 'Announcement not found.' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Announcement deleted.' });
      }

      // 12. Settings & Fees
      case 'UPDATE_SETTINGS': {
        const settings = db.updatePlatformSettings(payload, session.userId);
        return NextResponse.json({ success: true, settings, message: 'Platform settings and fee rules updated.' });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
