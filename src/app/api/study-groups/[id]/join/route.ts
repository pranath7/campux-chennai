import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { PaymentGatewayService } from '@/lib/payment';
import { StudyGroupParticipant } from '@/types/marketplace';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AuthService.getCookieName())?.value;
    const session = AuthService.verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Please login to join this study group.' }, { status: 401 });
    }

    const group = db.studyGroups.find((g) => g.id === id);
    if (!group) {
      return NextResponse.json({ error: 'Study session not found.' }, { status: 404 });
    }

    if (group.hostId === session.userId) {
      return NextResponse.json({ error: 'You are the host of this study group.' }, { status: 400 });
    }

    // Check if already registered
    const alreadyJoined = db.hasJoinedStudyGroup(session.userId, group.id);
    if (alreadyJoined) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled.',
        meetingLink: group.meetingLink,
        meetingInstructions: group.meetingInstructions,
      });
    }

    // Check capacity limit
    if (group.currentParticipantsCount >= group.maxParticipants) {
      return NextResponse.json({ error: 'This study session has reached maximum participant capacity.' }, { status: 400 });
    }

    // Process payment if price > 0
    if (group.price > 0) {
      const txnId = PaymentGatewayService.generateTransactionId('TXN-SG');
      const payResult = await PaymentGatewayService.verifyPayment({
        transactionId: txnId,
        amount: group.price,
        paymentMethod: 'UPI',
      });

      if (!payResult.success) {
        return NextResponse.json({ error: 'Payment declined.' }, { status: 402 });
      }
    }

    const profile = db.getStudentProfile(session.userId);
    const college = profile?.collegeId ? db.getCollegeById(profile.collegeId)?.name || 'Chennai College' : 'Chennai College';

    const newParticipant: StudyGroupParticipant = {
      id: `sg_part_${Date.now()}`,
      studyGroupId: group.id,
      userId: session.userId,
      userName: session.fullName,
      userEmail: session.email,
      userCollege: college,
      amountPaid: group.price,
      paymentStatus: 'successful',
      joinedAt: new Date().toISOString(),
    };

    db.studyGroupParticipants.push(newParticipant);
    group.currentParticipantsCount += 1;

    // Send notifications
    db.notifications.unshift({
      id: `notif_${Date.now()}_sg_buyer`,
      userId: session.userId,
      title: '🎯 Study Session Confirmed!',
      message: `You are registered for "${group.title}". Meeting link is now unlocked.`,
      type: 'study_group',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.notifications.unshift({
      id: `notif_${Date.now()}_sg_host`,
      userId: group.hostId,
      title: '👥 New Study Group Attendee',
      message: `${session.fullName} from ${college} registered for your session "${group.title}". (${group.currentParticipantsCount}/${group.maxParticipants})`,
      type: 'study_group',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      meetingLink: group.meetingLink,
      meetingInstructions: group.meetingInstructions,
      participant: newParticipant,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
