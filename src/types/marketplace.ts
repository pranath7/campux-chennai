/**
 * Domain types for Chennai Student Academic Marketplace — Single Unified Admin Architecture
 */

export type UserRole = 'student' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type ResourceCategory =
  | 'Revision Notes'
  | 'Handwritten Notes'
  | 'Important Questions'
  | 'Chapter Notes'
  | 'Diagrams & Mindmaps'
  | 'Formula Sheet'
  | 'Formula Sheets'
  | 'PYQ Solutions'
  | 'Previous-Year Question Papers'
  | 'Summary Guide'
  | 'Study Guides'
  | 'Case Study Notes';

export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | 'successful' | 'refunded';

export type ReportReason =
  | 'copyright_violation'
  | 'academic_misconduct'
  | 'misleading_resource'
  | 'pirated_content'
  | 'scam'
  | 'spam'
  | 'harassment'
  | 'fraud'
  | 'fake_resource'
  | 'inappropriate_content'
  | 'other';

export type AnnouncementCategory =
  | 'EVENT'
  | 'CLUB'
  | 'WORKSHOP'
  | 'INTERNSHIP'
  | 'COMPETITION'
  | 'SEMINAR'
  | 'OPPORTUNITY';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketCategory = 'payment' | 'notes_access' | 'account' | 'seller' | 'refund' | 'technical' | 'other';

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  address: string;
  website?: string;
  status: 'active' | 'disabled';
  logoUrl?: string;
  emailDomains: string[];
  bannerGradient: string;
  stats?: {
    studentsCount: number;
    resourcesCount: number;
    studyGroupsCount: number;
  };
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  code: string;
  durationYears: number;
  totalSemesters: number;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  courseId: string;
  collegeId: string;
  name: string;
  code: string;
  year: number;
  semester: number;
  tags?: string[];
  canonicalKey: string;
  status?: 'active' | 'disabled';
}

export interface User {
  id: string;
  fullName: string;
  email?: string;
  mobile: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: string;
  isSuspended?: boolean;
  isBanned?: boolean;
  status?: 'active' | 'suspended' | 'banned';
  avatarUrl?: string;
}

export interface StudentProfile {
  userId: string;
  collegeId: string;
  collegeName?: string;
  courseId: string;
  courseName?: string;
  year: number;
  section?: string;
  semester?: number;
  bio?: string;
  verificationStatus: VerificationStatus;
  verificationMethod?: 'college_email' | 'student_id';
  studentIdDocUrl?: string;
  verificationDate?: string;
  verifiedBadge: boolean;
  subjectsOfInterest?: string[];
  credibilityScore: number;
  rating: number;
  reviewCount: number;
  resourcesSoldCount: number;
  resourcesListedCount: number;
  payoutDetails?: PayoutDetails;
}

export interface PayoutDetails {
  payoutMethod: 'upi' | 'bank';
  upiId?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  accountNumberMasked?: string;
  ifsc?: string;
  isConfigured: boolean;
  updatedAt?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCollegeId: string;
  sellerAvatarUrl?: string;
  sellerCredibilityScore: number;
  sellerRating: number;
  sellerVerified: boolean;
  
  title: string;
  description: string;
  category: ResourceCategory;
  collegeId: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  canonicalKey: string;
  year: number;
  semester: number;
  section?: string;
  
  price: number;
  pageCount: number;
  fileFormat: string;
  fileSizeFormatted: string;
  storageKey: string;
  
  previewTextSample?: string;
  previewImageUrls?: string[];
  tableOfContents?: string[];
  
  tags: string[];
  status: 'pending' | 'active' | 'under_review' | 'rejected' | 'hidden' | 'removed' | 'archived';
  rejectionReason?: string;
  viewsCount: number;
  purchasesCount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSubmission {
  id: string;
  purchaseId: string;
  buyerId: string;
  buyerName: string;
  buyerMobile: string;
  buyerCollegeId: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  utrId: string;
  screenshotUrl: string;
  status: PaymentStatus;
  isDuplicateFlagged?: boolean;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface Purchase {
  id: string;
  transactionId: string;
  buyerId: string;
  buyerName: string;
  buyerMobile?: string;
  buyerEmail?: string;
  buyerCollegeId: string;
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
  listingSubject: string;
  listingCategory: string;
  
  basePrice: number;
  buyerFee: number;
  sellerFee: number;
  totalAmountPaid: number;
  sellerNetAmount: number;
  platformRevenue: number;
  
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  paymentStatus: PaymentStatus;
  utrId?: string;
  screenshotUrl?: string;
  rejectionReason?: string;
  purchasedAt: string;
  verifiedAt?: string;
  hasReviewed: boolean;
}

export interface Review {
  id: string;
  purchaseId: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatarUrl?: string;
  buyerCollege?: string;
  sellerId?: string;
  rating: number;
  qualityRating?: number;
  accuracyRating?: number;
  valueRating?: number;
  comment: string;
  createdAt: string;
  status?: 'active' | 'removed';
}

export interface StudyGroup {
  id: string;
  hostId: string;
  hostName: string;
  hostCollegeId: string;
  hostAvatarUrl?: string;
  hostCredibilityScore: number;
  hostRating: number;
  hostVerified: boolean;
  
  title: string;
  description: string;
  subjectName: string;
  courseName: string;
  collegeId: string;
  year: number;
  
  date: string;
  startTime: string;
  durationMinutes: number;
  
  price: number;
  maxParticipants: number;
  currentParticipantsCount: number;
  
  meetingPlatform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  meetingLink: string;
  meetingInstructions?: string;
  
  status: 'upcoming' | 'live' | 'completed' | 'cancelled' | 'rejected';
  createdAt: string;
}

export interface StudyGroupParticipant {
  id: string;
  studyGroupId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userCollege?: string;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  joinedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  collegeId: string;
  collegeName: string;
  organizer: string;
  category: AnnouncementCategory;
  date: string;
  time?: string;
  venueOrOnline: string;
  registrationLink?: string;
  imageUrl?: string;
  isOfficial: boolean;
  status?: 'published' | 'draft' | 'scheduled' | 'unpublished';
  createdByUserId: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'verification' | 'purchase' | 'payment_submitted' | 'payment_verified' | 'payment_rejected' | 'sale' | 'study_group' | 'review' | 'announcement' | 'system';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  reporterName: string;
  reportedListingId?: string;
  reportedUserId?: string;
  reportedStudyGroupId?: string;
  reportedReviewId?: string;
  reportedAnnouncementId?: string;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected' | 'dismissed';
  adminNotes?: string;
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userMobile?: string;
  userCollege?: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  replies: {
    id: string;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
}

export interface VerificationRequest {
  id: string;
  userId: string;
  studentName: string;
  collegeId: string;
  collegeName: string;
  courseName: string;
  year: number;
  email?: string;
  method: 'college_email' | 'student_id';
  studentIdDocUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNote?: string;
}

export interface AuditLog {
  id: string;
  adminUserId: string;
  adminName: string;
  action: string;
  entity: string;
  entityId: string;
  targetType?: string;
  targetId?: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformName?: string;
  supportEmail?: string;
  activeCity?: string;
  buyerFeePercentage: number;
  buyerFeeFixed: number;
  sellerFeePercentage: number;
  studyGroupFeePercentage?: number;
  minFee: number;
  maxFee: number;
  allowRegistration?: boolean;
  requireVerificationToSell?: boolean;
  currencySymbol?: string;
  defaultCity?: string;
  buyerConvenienceFeePercentage?: number;
  buyerConvenienceFeeFixed?: number;
  sellerPlatformFeePercentage?: number;
  upiId?: string;
  upiQrCodeUrl?: string;
  allowedFileTypes?: string[];
  maxUploadSizeMb?: number;
  minNotePrice?: number;
  maxNotePrice?: number;
}
