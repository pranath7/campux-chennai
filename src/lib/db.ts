import {
  College,
  Course,
  Subject,
  User,
  StudentProfile,
  Listing,
  Purchase,
  PaymentSubmission,
  Review,
  StudyGroup,
  StudyGroupParticipant,
  Announcement,
  NotificationItem,
  Report,
  SupportTicket,
  TicketStatus,
  VerificationRequest,
  PlatformSettings,
  AuditLog,
} from '@/types/marketplace';
import { DEFAULT_PLATFORM_SETTINGS } from './payment';

// Seed Colleges
export const SEED_COLLEGES: College[] = [
  {
    id: 'dgvaishnav',
    name: 'DG Vaishnav College',
    shortName: 'DGVC',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Gokul Bagh, 833 EVR Periyar High Road, Arumbakkam, Chennai - 600106',
    emailDomains: ['dgvaishnav.edu.in', 'dgvc.ac.in'],
    bannerGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    status: 'active',
    stats: { studentsCount: 4200, resourcesCount: 180, studyGroupsCount: 14 },
  },
  {
    id: 'loyola',
    name: 'Loyola College',
    shortName: 'Loyola',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Sterling Road, Nungambakkam, Chennai - 600034',
    emailDomains: ['loyolacollege.edu', 'loyola.ac.in'],
    bannerGradient: 'from-amber-700 via-orange-800 to-slate-900',
    status: 'active',
    stats: { studentsCount: 5100, resourcesCount: 240, studyGroupsCount: 22 },
  },
  {
    id: 'mcc',
    name: 'Madras Christian College',
    shortName: 'MCC',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Tambaram East, Chennai - 600059',
    emailDomains: ['mcc.edu.in'],
    bannerGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    status: 'active',
    stats: { studentsCount: 3800, resourcesCount: 155, studyGroupsCount: 12 },
  },
  {
    id: 'srmist',
    name: 'SRM Institute of Science and Technology',
    shortName: 'SRM',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Kattankulathur / Ramapuram Campus, Chennai - 603203',
    emailDomains: ['srmist.edu.in', 'srmuniv.ac.in'],
    bannerGradient: 'from-sky-700 via-blue-900 to-slate-900',
    status: 'active',
    stats: { studentsCount: 8900, resourcesCount: 410, studyGroupsCount: 38 },
  },
  {
    id: 'vit_chennai',
    name: 'VIT Chennai',
    shortName: 'VITC',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Vandalur-Kelambakkam Road, Chennai - 600127',
    emailDomains: ['vit.ac.in', 'vitchennai.ac.in'],
    bannerGradient: 'from-purple-700 via-violet-900 to-slate-900',
    status: 'active',
    stats: { studentsCount: 7200, resourcesCount: 360, studyGroupsCount: 31 },
  },
  {
    id: 'hits',
    name: 'Hindustan Institute of Technology and Science',
    shortName: 'HITS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '1 Rajiv Gandhi Salai (OMR), Padur, Chennai - 603103',
    emailDomains: ['hindustanuniv.ac.in', 'hits.ac.in'],
    bannerGradient: 'from-rose-700 via-red-900 to-slate-900',
    status: 'active',
    stats: { studentsCount: 3100, resourcesCount: 120, studyGroupsCount: 9 },
  },
];

// Seed Courses
export const SEED_COURSES: Course[] = [
  // DG Vaishnav
  { id: 'dgvc_bcom_gen', collegeId: 'dgvaishnav', name: 'B.Com (General)', code: 'BCOM-GEN', durationYears: 3, totalSemesters: 6 },
  { id: 'dgvc_bcom_cs', collegeId: 'dgvaishnav', name: 'B.Com (Corporate Secretaryship)', code: 'BCOM-CS', durationYears: 3, totalSemesters: 6 },
  { id: 'dgvc_bsc_cs', collegeId: 'dgvaishnav', name: 'B.Sc Computer Science', code: 'BSC-CS', durationYears: 3, totalSemesters: 6 },
  { id: 'dgvc_bba', collegeId: 'dgvaishnav', name: 'Bachelor of Business Administration (BBA)', code: 'BBA', durationYears: 3, totalSemesters: 6 },
  { id: 'dgvc_bca', collegeId: 'dgvaishnav', name: 'Bachelor of Computer Applications (BCA)', code: 'BCA', durationYears: 3, totalSemesters: 6 },
  
  // Loyola
  { id: 'loyola_bcom', collegeId: 'loyola', name: 'B.Com (General)', code: 'BCOM', durationYears: 3, totalSemesters: 6 },
  { id: 'loyola_bsc_cs', collegeId: 'loyola', name: 'B.Sc Computer Science', code: 'BSC-CS', durationYears: 3, totalSemesters: 6 },
  { id: 'loyola_bba', collegeId: 'loyola', name: 'BBA', code: 'BBA', durationYears: 3, totalSemesters: 6 },
  { id: 'loyola_bca', collegeId: 'loyola', name: 'BCA', code: 'BCA', durationYears: 3, totalSemesters: 6 },
  
  // MCC
  { id: 'mcc_bcom', collegeId: 'mcc', name: 'B.Com', code: 'BCOM', durationYears: 3, totalSemesters: 6 },
  { id: 'mcc_bsc_cs', collegeId: 'mcc', name: 'B.Sc Computer Science', code: 'BSC-CS', durationYears: 3, totalSemesters: 6 },
  { id: 'mcc_bba', collegeId: 'mcc', name: 'BBA', code: 'BBA', durationYears: 3, totalSemesters: 6 },
  
  // SRM
  { id: 'srm_btech_cse', collegeId: 'srmist', name: 'B.Tech Computer Science & Engineering', code: 'BTECH-CSE', durationYears: 4, totalSemesters: 8 },
  { id: 'srm_bcom', collegeId: 'srmist', name: 'B.Com', code: 'BCOM', durationYears: 3, totalSemesters: 6 },
  
  // VIT Chennai
  { id: 'vit_btech_cse', collegeId: 'vit_chennai', name: 'B.Tech Computer Science & Engineering', code: 'BTECH-CSE', durationYears: 4, totalSemesters: 8 },
  { id: 'vit_bba', collegeId: 'vit_chennai', name: 'BBA (Honours)', code: 'BBA-HONS', durationYears: 3, totalSemesters: 6 },
  
  // HITS
  { id: 'hits_btech_cse', collegeId: 'hits', name: 'B.Tech CSE', code: 'BTECH-CSE', durationYears: 4, totalSemesters: 8 },
  { id: 'hits_bba', collegeId: 'hits', name: 'BBA', code: 'BBA', durationYears: 3, totalSemesters: 6 },
];

// Seed Subjects with Canonical Mapping Keys
export const SEED_SUBJECTS: Subject[] = [
  // DG Vaishnav B.Com Subjects
  { id: 'sub_dgvc_fa', courseId: 'dgvc_bcom_gen', collegeId: 'dgvaishnav', name: 'Financial Accounting', code: 'BCM201', year: 2, semester: 3, canonicalKey: 'financial_accounting', tags: ['accounting', 'accounts', 'ledger'] },
  { id: 'sub_dgvc_cost', courseId: 'dgvc_bcom_gen', collegeId: 'dgvaishnav', name: 'Cost Accounting', code: 'BCM202', year: 2, semester: 3, canonicalKey: 'cost_accounting', tags: ['costing', 'material', 'overhead'] },
  { id: 'sub_dgvc_law', courseId: 'dgvc_bcom_gen', collegeId: 'dgvaishnav', name: 'Business Law', code: 'BCM203', year: 2, semester: 3, canonicalKey: 'business_law', tags: ['law', 'contract', 'mercantile'] },
  { id: 'sub_dgvc_eco', courseId: 'dgvc_bcom_gen', collegeId: 'dgvaishnav', name: 'Business Economics', code: 'BCM104', year: 1, semester: 2, canonicalKey: 'business_economics', tags: ['economics', 'demand', 'elasticity'] },
  
  // DG Vaishnav B.Sc CS
  { id: 'sub_dgvc_dsa', courseId: 'dgvc_bsc_cs', collegeId: 'dgvaishnav', name: 'Data Structures & Algorithms', code: 'CSC201', year: 2, semester: 3, canonicalKey: 'data_structures', tags: ['dsa', 'trees', 'graphs'] },
  { id: 'sub_dgvc_dbms', courseId: 'dgvc_bsc_cs', collegeId: 'dgvaishnav', name: 'Database Management Systems', code: 'CSC202', year: 2, semester: 4, canonicalKey: 'dbms', tags: ['sql', 'rdbms', 'normalization'] },
  { id: 'sub_dgvc_python', courseId: 'dgvc_bsc_cs', collegeId: 'dgvaishnav', name: 'Python Programming', code: 'CSC103', year: 1, semester: 2, canonicalKey: 'python_programming', tags: ['python', 'oop', 'scripts'] },

  // Loyola College B.Com
  { id: 'sub_loy_fa', courseId: 'loyola_bcom', collegeId: 'loyola', name: 'Financial Accounting II', code: 'CO201', year: 2, semester: 3, canonicalKey: 'financial_accounting', tags: ['accounts', 'partnership', 'company'] },
  { id: 'sub_loy_cost', courseId: 'loyola_bcom', collegeId: 'loyola', name: 'Cost Accounting', code: 'CO202', year: 2, semester: 4, canonicalKey: 'cost_accounting', tags: ['cost', 'marginal'] },
  { id: 'sub_loy_law', courseId: 'loyola_bcom', collegeId: 'loyola', name: 'Mercantile & Business Law', code: 'CO203', year: 2, semester: 3, canonicalKey: 'business_law', tags: ['law', 'negotiable'] },
  { id: 'sub_loy_dsa', courseId: 'loyola_bsc_cs', collegeId: 'loyola', name: 'Data Structures in C++', code: 'CS201', year: 2, semester: 3, canonicalKey: 'data_structures', tags: ['dsa', 'stacks', 'queues'] },
  { id: 'sub_loy_os', courseId: 'loyola_bsc_cs', collegeId: 'loyola', name: 'Operating Systems', code: 'CS202', year: 2, semester: 4, canonicalKey: 'operating_systems', tags: ['os', 'threads', 'deadlock'] },

  // MCC
  { id: 'sub_mcc_fa', courseId: 'mcc_bcom', collegeId: 'mcc', name: 'Financial Accounting', code: 'MC-BCOM-21', year: 2, semester: 3, canonicalKey: 'financial_accounting', tags: ['accounting', 'trial balance'] },
  { id: 'sub_mcc_dbms', courseId: 'mcc_bsc_cs', collegeId: 'mcc', name: 'Relational Database Systems', code: 'MC-CS-22', year: 2, semester: 3, canonicalKey: 'dbms', tags: ['dbms', 'sql'] },

  // SRM B.Tech CSE
  { id: 'sub_srm_dsa', courseId: 'srm_btech_cse', collegeId: 'srmist', name: 'Data Structures & Algorithms', code: '18CSC201J', year: 2, semester: 3, canonicalKey: 'data_structures', tags: ['dsa', 'trees', 'heaps', 'dp'] },
  { id: 'sub_srm_os', courseId: 'srm_btech_cse', collegeId: 'srmist', name: 'Operating Systems', code: '18CSC202J', year: 2, semester: 4, canonicalKey: 'operating_systems', tags: ['os', 'scheduling', 'memory'] },
  { id: 'sub_srm_dbms', courseId: 'srm_btech_cse', collegeId: 'srmist', name: 'Database Management Systems', code: '18CSC203J', year: 2, semester: 4, canonicalKey: 'dbms', tags: ['dbms', 'acid', 'indexing'] },

  // VIT Chennai
  { id: 'sub_vit_dsa', courseId: 'vit_btech_cse', collegeId: 'vit_chennai', name: 'Data Structures and Algorithms', code: 'CSE2001', year: 2, semester: 3, canonicalKey: 'data_structures', tags: ['dsa', 'algorithms'] },
  { id: 'sub_vit_math', courseId: 'vit_btech_cse', collegeId: 'vit_chennai', name: 'Discrete Mathematics', code: 'MAT2002', year: 1, semester: 2, canonicalKey: 'discrete_mathematics', tags: ['math', 'graph'] },
];

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: 'user_rahul_dgvc',
    fullName: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul.sharma@dgvaishnav.edu.in',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-02-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_pranath_dgvc',
    fullName: 'Pranath K.',
    email: 'student@dgvaishnav.edu.in',
    mobile: '9840123456',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-10T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_priya_loyola',
    fullName: 'Priya Sundaram',
    email: 'priya.s@loyolacollege.edu',
    mobile: '9840234567',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-12T11:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_arjun_mcc',
    fullName: 'Arjun Ramesh',
    email: 'arjun.r@mcc.edu.in',
    mobile: '9840345678',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-15T09:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_kavya_srm',
    fullName: 'Kavya Natarajan',
    email: 'kavya.n@srmist.edu.in',
    mobile: '9840456789',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-18T14:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_rohit_vit',
    fullName: 'Rohit Balaji',
    email: 'rohit.b@vit.ac.in',
    mobile: '9840567890',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-20T16:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_divya_hits',
    fullName: 'Divya Krishnan',
    email: 'divya.k@hindustanuniv.ac.in',
    mobile: '9840678901',
    role: 'student',
    passwordHash: 'student123',
    createdAt: '2026-01-22T08:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_admin',
    fullName: 'Master Administrator',
    email: 'admin@campux.in',
    mobile: '9840000000',
    role: 'admin',
    passwordHash: 'admin123',
    createdAt: '2026-01-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
];

// Student Profiles
export const SEED_STUDENT_PROFILES: StudentProfile[] = [
  {
    userId: 'user_rahul_dgvc',
    collegeId: 'dgvaishnav',
    collegeName: 'DG Vaishnav College',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com',
    year: 2,
    section: 'B',
    semester: 3,
    bio: 'B.Com 2nd Year, Section B @ DG Vaishnav College. Focus on Financial Accounting, Corporate Law and Costing.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-02-01T12:00:00Z',
    subjectsOfInterest: ['Financial Accounting', 'Cost Accounting', 'Business Law'],
    credibilityScore: 88,
    rating: 4.8,
    reviewCount: 14,
    resourcesSoldCount: 12,
    resourcesListedCount: 3,
  },
  {
    userId: 'user_pranath_dgvc',
    collegeId: 'dgvaishnav',
    collegeName: 'DG Vaishnav College',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com (General)',
    year: 2,
    section: 'A',
    semester: 3,
    bio: 'B.Com 2nd Year student & Academic Peer Tutor. Sharing comprehensive revision handwritten notes, formula sheets, and past question solutions.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-01-10T12:00:00Z',
    subjectsOfInterest: ['Financial Accounting', 'Cost Accounting', 'Business Law', 'Corporate Finance'],
    credibilityScore: 94,
    rating: 4.9,
    reviewCount: 42,
    resourcesSoldCount: 37,
    resourcesListedCount: 8,
  },
  {
    userId: 'user_priya_loyola',
    collegeId: 'loyola',
    courseId: 'loyola_bsc_cs',
    year: 3,
    semester: 5,
    bio: 'Loyola CS Department Gold Medalist contender. Curating crisp Data Structures, Operating Systems, and DBMS quick-revision guides.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-01-12T14:00:00Z',
    subjectsOfInterest: ['Data Structures', 'Operating Systems', 'DBMS', 'Machine Learning'],
    credibilityScore: 96,
    rating: 4.95,
    reviewCount: 58,
    resourcesSoldCount: 62,
    resourcesListedCount: 12,
  },
  {
    userId: 'user_arjun_mcc',
    collegeId: 'mcc',
    courseId: 'mcc_bcom',
    year: 2,
    semester: 3,
    bio: 'Commerce enthusiast @ MCC. Specializing in Cost Accounting problem breakdowns and previous year question bank with step-by-step answers.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-01-15T11:00:00Z',
    subjectsOfInterest: ['Financial Accounting', 'Cost Accounting', 'Business Law'],
    credibilityScore: 89,
    rating: 4.8,
    reviewCount: 28,
    resourcesSoldCount: 24,
    resourcesListedCount: 6,
  },
  {
    userId: 'user_kavya_srm',
    collegeId: 'srmist',
    courseId: 'srm_btech_cse',
    year: 2,
    semester: 4,
    bio: 'B.Tech CSE student @ SRM Kattankulathur. Love creating visual architectural diagrams, formula sheets, and code cheat-sheets for midterms.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-01-18T16:00:00Z',
    subjectsOfInterest: ['Data Structures', 'Operating Systems', 'Database Systems', 'Python'],
    credibilityScore: 92,
    rating: 4.85,
    reviewCount: 34,
    resourcesSoldCount: 41,
    resourcesListedCount: 9,
  },
  {
    userId: 'user_rohit_vit',
    collegeId: 'vit_chennai',
    courseId: 'vit_btech_cse',
    year: 2,
    semester: 3,
    bio: 'VIT Chennai CSE sophomore. Creating high-yield exam preparation summaries, memory tricks, and important questions compilation.',
    verificationStatus: 'verified',
    verificationMethod: 'college_email',
    verifiedBadge: true,
    verificationDate: '2026-01-20T18:00:00Z',
    subjectsOfInterest: ['Discrete Mathematics', 'DSA', 'Algorithms'],
    credibilityScore: 91,
    rating: 4.8,
    reviewCount: 31,
    resourcesSoldCount: 35,
    resourcesListedCount: 7,
  },
  {
    userId: 'user_divya_hits',
    collegeId: 'hits',
    courseId: 'hits_btech_cse',
    year: 2,
    semester: 3,
    bio: 'HITS Chennai student. Sharing verified chapter notes and clean diagrams for engineering subjects.',
    verificationStatus: 'pending',
    verificationMethod: 'student_id',
    studentIdDocUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
    verifiedBadge: false,
    subjectsOfInterest: ['Python', 'Data Structures', 'Web Tech'],
    credibilityScore: 68,
    rating: 4.5,
    reviewCount: 6,
    resourcesSoldCount: 5,
    resourcesListedCount: 2,
  },
];

// Seed Academic Marketplace Listings (50+ items)
export const SEED_LISTINGS: Listing[] = [
  {
    id: 'list_fa_dgvc_chap4',
    sellerId: 'user_pranath_dgvc',
    sellerName: 'Pranath K.',
    sellerCollegeId: 'DG Vaishnav College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 94,
    sellerRating: 4.9,
    sellerVerified: true,
    title: 'Financial Accounting — Chapter 4 Revision Notes & Journal Mastery',
    description: 'Ultra-clear revision notes on Partnership Accounts, Admission, Retirement & Dissolution. Includes step-by-step journal entries, revaluation accounts, and 8 solved university exam problems.',
    category: 'Revision Notes',
    collegeId: 'dgvaishnav',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com (General)',
    subjectId: 'sub_dgvc_fa',
    subjectName: 'Financial Accounting',
    canonicalKey: 'financial_accounting',
    year: 2,
    semester: 3,
    price: 49,
    pageCount: 32,
    fileFormat: 'PDF',
    fileSizeFormatted: '4.8 MB',
    storageKey: 'vault/fa_dgvc_chap4.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Financial Accounting', 'Partnership', 'Solved Problems', 'Exam Revision', 'B.Com'],
    status: 'active',
    viewsCount: 642,
    purchasesCount: 88,
    averageRating: 4.9,
    totalReviews: 24,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'list_fa_formula_sheet_dgvc',
    sellerId: 'user_pranath_dgvc',
    sellerName: 'Pranath K.',
    sellerCollegeId: 'DG Vaishnav College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 94,
    sellerRating: 4.9,
    sellerVerified: true,
    title: 'Financial & Corporate Accounting — Complete Formula & Ratio Sheet',
    description: 'Comprehensive 8-page formula sheet covering Liquidity, Solvency, Turnover, Profitability ratios, Depreciation methods, and Capital Reserve rules. Perfect for quick last-minute exam recall.',
    category: 'Formula Sheets',
    collegeId: 'dgvaishnav',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com (General)',
    subjectId: 'sub_dgvc_fa',
    subjectName: 'Financial Accounting',
    canonicalKey: 'financial_accounting',
    year: 2,
    semester: 3,
    price: 29,
    pageCount: 8,
    fileFormat: 'PDF',
    fileSizeFormatted: '1.9 MB',
    storageKey: 'vault/fa_formula_sheet_dgvc.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Formula Sheet', 'Ratios', 'Cheat Sheet', 'Quick Revision'],
    status: 'active',
    viewsCount: 420,
    purchasesCount: 56,
    averageRating: 4.8,
    totalReviews: 18,
    createdAt: '2026-02-04T12:00:00Z',
    updatedAt: '2026-02-04T12:00:00Z',
  },
  {
    id: 'list_cost_dgvc_notes',
    sellerId: 'user_pranath_dgvc',
    sellerName: 'Pranath K.',
    sellerCollegeId: 'DG Vaishnav College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 94,
    sellerRating: 4.9,
    sellerVerified: true,
    title: 'Cost Accounting — Material & Labour Costing Handwritten Guide',
    description: 'Complete handwritten walkthrough for EOQ, Re-order levels, FIFO/LIFO stores ledger, Taylor & Halsey wage plans. Includes neat diagrams and 15 university model questions.',
    category: 'Handwritten Notes',
    collegeId: 'dgvaishnav',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com (General)',
    subjectId: 'sub_dgvc_cost',
    subjectName: 'Cost Accounting',
    canonicalKey: 'cost_accounting',
    year: 2,
    semester: 3,
    price: 59,
    pageCount: 42,
    fileFormat: 'PDF',
    fileSizeFormatted: '6.1 MB',
    storageKey: 'vault/cost_dgvc_notes.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Cost Accounting', 'Handwritten', 'EOQ', 'Stores Ledger', 'Labour Costing'],
    status: 'active',
    viewsCount: 512,
    purchasesCount: 64,
    averageRating: 4.95,
    totalReviews: 21,
    createdAt: '2026-02-08T09:00:00Z',
    updatedAt: '2026-02-08T09:00:00Z',
  },
  {
    id: 'list_loyola_fa_pyq',
    sellerId: 'user_priya_loyola',
    sellerName: 'Priya Sundaram',
    sellerCollegeId: 'Loyola College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 96,
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Financial Accounting II — Loyola 5-Year Solved Question Papers',
    description: 'Past 5 semester university examinations with fully verified answers, balance sheet workings, and examiner mark allocation guidelines.',
    category: 'Previous-Year Question Papers',
    collegeId: 'loyola',
    courseId: 'loyola_bcom',
    courseName: 'B.Com (General)',
    subjectId: 'sub_loy_fa',
    subjectName: 'Financial Accounting II',
    canonicalKey: 'financial_accounting',
    year: 2,
    semester: 3,
    price: 69,
    pageCount: 54,
    fileFormat: 'PDF',
    fileSizeFormatted: '7.8 MB',
    storageKey: 'vault/loyola_fa_pyq.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Loyola', 'Financial Accounting', 'PYQ', 'Solved Papers', 'University Exams'],
    status: 'active',
    viewsCount: 880,
    purchasesCount: 112,
    averageRating: 4.95,
    totalReviews: 38,
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'list_loyola_dsa_notes',
    sellerId: 'user_priya_loyola',
    sellerName: 'Priya Sundaram',
    sellerCollegeId: 'Loyola College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 96,
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Data Structures & Algorithms — Complete Visual Diagrams & C++ Code',
    description: 'Comprehensive handwritten & typed notes covering Linked Lists, Stacks, Queues, Binary Search Trees, AVL Trees, Graphs, Dijkstra, and Dynamic Programming. With full memory diagrams and code examples.',
    category: 'Chapter Notes',
    collegeId: 'loyola',
    courseId: 'loyola_bsc_cs',
    courseName: 'B.Sc Computer Science',
    subjectId: 'sub_loy_dsa',
    subjectName: 'Data Structures in C++',
    canonicalKey: 'data_structures',
    year: 2,
    semester: 3,
    price: 79,
    pageCount: 68,
    fileFormat: 'PDF',
    fileSizeFormatted: '9.2 MB',
    storageKey: 'vault/loyola_dsa_notes.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1516116211227-bbc13c6314f3?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['DSA', 'Data Structures', 'C++', 'Trees', 'Graphs', 'Algorithms'],
    status: 'active',
    viewsCount: 1240,
    purchasesCount: 174,
    averageRating: 4.98,
    totalReviews: 52,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'list_srm_dsa_cheat_sheet',
    sellerId: 'user_kavya_srm',
    sellerName: 'Kavya Natarajan',
    sellerCollegeId: 'SRM IST Kattankulathur',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 92,
    sellerRating: 4.85,
    sellerVerified: true,
    title: 'DSA Time Complexity & Recurrence Relations Formula Sheet',
    description: 'Master Theorem lookup tables, time & space complexities for all 18 standard sorting & searching algorithms, and traversal trees cheat-sheet.',
    category: 'Formula Sheets',
    collegeId: 'srmist',
    courseId: 'srm_btech_cse',
    courseName: 'B.Tech CSE',
    subjectId: 'sub_srm_dsa',
    subjectName: 'Data Structures & Algorithms',
    canonicalKey: 'data_structures',
    year: 2,
    semester: 3,
    price: 35,
    pageCount: 12,
    fileFormat: 'PDF',
    fileSizeFormatted: '2.4 MB',
    storageKey: 'vault/srm_dsa_cheat_sheet.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Time Complexity', 'Master Theorem', 'Algorithms', 'SRM', 'Cheat Sheet'],
    status: 'active',
    viewsCount: 710,
    purchasesCount: 94,
    averageRating: 4.85,
    totalReviews: 29,
    createdAt: '2026-02-05T15:30:00Z',
    updatedAt: '2026-02-05T15:30:00Z',
  },
  {
    id: 'list_mcc_fa_imp_questions',
    sellerId: 'user_arjun_mcc',
    sellerName: 'Arjun Ramesh',
    sellerCollegeId: 'Madras Christian College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 89,
    sellerRating: 4.8,
    sellerVerified: true,
    title: 'Financial Accounting — Top 25 Most Repeated University Questions',
    description: 'Curated list of high-probability 10-mark and 5-mark questions with comprehensive breakdown solutions, ledger workings, and common pitfalls to avoid.',
    category: 'Important Questions',
    collegeId: 'mcc',
    courseId: 'mcc_bcom',
    courseName: 'B.Com',
    subjectId: 'sub_mcc_fa',
    subjectName: 'Financial Accounting',
    canonicalKey: 'financial_accounting',
    year: 2,
    semester: 3,
    price: 45,
    pageCount: 28,
    fileFormat: 'PDF',
    fileSizeFormatted: '3.6 MB',
    storageKey: 'vault/mcc_fa_imp_questions.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Important Questions', 'Exam Predictor', 'MCC', 'Accounts', 'Solved'],
    status: 'active',
    viewsCount: 590,
    purchasesCount: 73,
    averageRating: 4.8,
    totalReviews: 22,
    createdAt: '2026-01-28T16:00:00Z',
    updatedAt: '2026-01-28T16:00:00Z',
  },
  {
    id: 'list_vit_discrete_math',
    sellerId: 'user_rohit_vit',
    sellerName: 'Rohit Balaji',
    sellerCollegeId: 'VIT Chennai',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 91,
    sellerRating: 4.8,
    sellerVerified: true,
    title: 'Discrete Mathematics & Graph Theory — Complete Problem Solving Blueprint',
    description: 'In-depth coverage of Propositional Logic, Predicates, Recurrence relations, Eulerian & Hamiltonian paths, Planar graphs, and Chromatic numbers.',
    category: 'Study Guides',
    collegeId: 'vit_chennai',
    courseId: 'vit_btech_cse',
    courseName: 'B.Tech CSE',
    subjectId: 'sub_vit_math',
    subjectName: 'Discrete Mathematics',
    canonicalKey: 'discrete_mathematics',
    year: 1,
    semester: 2,
    price: 55,
    pageCount: 46,
    fileFormat: 'PDF',
    fileSizeFormatted: '5.5 MB',
    storageKey: 'vault/vit_discrete_math.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Discrete Math', 'Graph Theory', 'Logic', 'VIT Chennai', 'CAT Revision'],
    status: 'active',
    viewsCount: 630,
    purchasesCount: 81,
    averageRating: 4.8,
    totalReviews: 26,
    createdAt: '2026-02-02T13:15:00Z',
    updatedAt: '2026-02-02T13:15:00Z',
  },
  {
    id: 'list_dgvc_law_case_studies',
    sellerId: 'user_pranath_dgvc',
    sellerName: 'Pranath K.',
    sellerCollegeId: 'DG Vaishnav College',
    sellerAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerCredibilityScore: 94,
    sellerRating: 4.9,
    sellerVerified: true,
    title: 'Business & Mercantile Law — 50 Landmark Case Laws Summary',
    description: 'Balfour v. Balfour, Carlill v. Carbolic Smoke Ball Co., Salomon v. Salomon, and 47 other essential case summaries with judgment reasoning and exam citation format.',
    category: 'Revision Notes',
    collegeId: 'dgvaishnav',
    courseId: 'dgvc_bcom_gen',
    courseName: 'B.Com (General)',
    subjectId: 'sub_dgvc_law',
    subjectName: 'Business Law',
    canonicalKey: 'business_law',
    year: 2,
    semester: 3,
    price: 39,
    pageCount: 26,
    fileFormat: 'PDF',
    fileSizeFormatted: '3.2 MB',
    storageKey: 'vault/dgvc_law_case_studies.pdf',
    previewImageUrls: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['Business Law', 'Case Laws', 'Contract Act', 'Legal Principles'],
    status: 'active',
    viewsCount: 410,
    purchasesCount: 52,
    averageRating: 4.85,
    totalReviews: 16,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
];

// Seed Paid Live Study Groups
export const SEED_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'sg_fa_chap4_revision',
    hostId: 'user_pranath_dgvc',
    hostName: 'Pranath K.',
    hostCollegeId: 'DG Vaishnav College',
    hostAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostCredibilityScore: 94,
    hostRating: 4.9,
    hostVerified: true,
    title: 'Financial Accounting — Partnership & Dissolution Intensive Problem Solving',
    description: 'Live 60-minute intensive walkthrough solving university question papers, adjusting revaluation profits, and clarifying common accounting doubts in real-time.',
    subjectName: 'Financial Accounting',
    courseName: 'B.Com (2nd Year)',
    collegeId: 'dgvaishnav',
    year: 2,
    date: '2026-08-28',
    startTime: '18:00',
    durationMinutes: 60,
    price: 25,
    maxParticipants: 20,
    currentParticipantsCount: 16,
    meetingPlatform: 'Google Meet',
    meetingLink: 'https://meet.google.com/abc-dgvc-study',
    meetingInstructions: 'Please keep your notebook and scientific calculator ready. Meeting link activates 15 mins prior.',
    status: 'upcoming',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'sg_loyola_dsa_live',
    hostId: 'user_priya_loyola',
    hostName: 'Priya Sundaram',
    hostCollegeId: 'Loyola College',
    hostAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hostCredibilityScore: 96,
    hostRating: 4.95,
    hostVerified: true,
    title: 'Trees & Graph Traversal (DFS/BFS) Live Coding Bootcamp',
    description: 'We will implement Binary Search Tree operations, Level-order traversals, and Graph BFS/DFS live in C++ and solve 4 classic exam coding problems.',
    subjectName: 'Data Structures & Algorithms',
    courseName: 'B.Sc CS / BCA / B.Tech',
    collegeId: 'loyola',
    year: 2,
    date: '2026-08-29',
    startTime: '19:30',
    durationMinutes: 90,
    price: 49,
    maxParticipants: 25,
    currentParticipantsCount: 22,
    meetingPlatform: 'Google Meet',
    meetingLink: 'https://meet.google.com/loy-dsa-live',
    meetingInstructions: 'Have VS Code or OnlineGDB open for live coding exercises.',
    status: 'upcoming',
    createdAt: '2026-02-16T12:00:00Z',
  },
  {
    id: 'sg_cost_accounting_mcc',
    hostId: 'user_arjun_mcc',
    hostName: 'Arjun Ramesh',
    hostCollegeId: 'Madras Christian College',
    hostAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hostCredibilityScore: 89,
    hostRating: 4.8,
    hostVerified: true,
    title: 'Cost Accounting — Marginal Costing & Break-Even Analysis Workshop',
    description: 'Learn P/V Ratio, Margin of Safety, and Decision-making problems without memorizing confusing formulas. Guaranteed clarity for 10-mark problems.',
    subjectName: 'Cost Accounting',
    courseName: 'B.Com / BBA',
    collegeId: 'mcc',
    year: 2,
    date: '2026-08-30',
    startTime: '17:00',
    durationMinutes: 75,
    price: 30,
    maxParticipants: 15,
    currentParticipantsCount: 12,
    meetingPlatform: 'Zoom',
    meetingLink: 'https://zoom.us/j/98403456781',
    meetingInstructions: 'Bring last year exam question papers for collaborative solution discussions.',
    status: 'upcoming',
    createdAt: '2026-02-18T14:00:00Z',
  },
];

// Seed Campus Announcements
export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_dgvc_commerce_symposium',
    title: 'COMMEX 2026 — Inter-Collegiate State Commerce Symposium',
    description: 'DG Vaishnav College Department of Commerce invites undergraduate students from all Chennai colleges for Best Manager, Stock War, Corporate Pitch, and Quiz competitions. Cash pool ₹50,000.',
    collegeId: 'dgvaishnav',
    collegeName: 'DG Vaishnav College',
    organizer: 'DGVC Commerce Association',
    category: 'COMPETITION',
    date: '2026-09-12',
    time: '09:00 AM - 04:30 PM',
    venueOrOnline: 'Main Auditorium, DGVC Campus, Arumbakkam',
    registrationLink: 'https://dgvaishnav.edu.in/commex2026',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    isOfficial: true,
    createdByUserId: 'user_dgvc_admin',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'ann_loyola_hackathon',
    title: 'Loyola CodeSprint 2026 — 24-Hour AI & Web3 Hackathon',
    description: 'Build impactful solutions in Fintech, EdTech, and HealthTech. Mentorship from top Chennai tech founders. Cash prizes ₹1,00,000 + Summer Internship opportunities.',
    collegeId: 'loyola',
    collegeName: 'Loyola College',
    organizer: 'Loyola Computer Science Society',
    category: 'COMPETITION',
    date: '2026-09-18',
    time: '24 Hours (Starts 10:00 AM)',
    venueOrOnline: 'Loyola Tech Hub, Nungambakkam',
    registrationLink: 'https://loyolacodesprint.in',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80',
    isOfficial: true,
    createdByUserId: 'user_priya_loyola',
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'ann_srm_internship_drive',
    title: 'Chennai Tech Internship Expo 2026 (Open to All Chennai Colleges)',
    description: 'Over 35 SaaS, FinTech, and Analytics startups hiring for Summer 2026 Developer, Analyst, and Product Interns. On-the-spot interviews.',
    collegeId: 'all_chennai',
    collegeName: 'All Chennai Colleges',
    organizer: 'Chennai Student Developer Network',
    category: 'INTERNSHIP',
    date: '2026-09-22',
    time: '10:00 AM - 05:00 PM',
    venueOrOnline: 'Hybrid (Online Screening + OMR Tech Park)',
    registrationLink: 'https://chennaitechinterns.dev',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    isOfficial: true,
    createdByUserId: 'user_super_admin',
    createdAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'ann_mcc_workshop_finance',
    title: 'Financial Modeling & Valuation with Excel Workshop',
    description: 'Hands-on 3-day weekend workshop on DCF valuation, three-statement financial modeling, and pitch deck preparation led by Big 4 alumni.',
    collegeId: 'mcc',
    collegeName: 'Madras Christian College',
    organizer: 'MCC Economics & Commerce Forum',
    category: 'WORKSHOP',
    date: '2026-09-05',
    time: '02:00 PM - 06:00 PM',
    venueOrOnline: 'Online via MS Teams',
    registrationLink: 'https://mcc.edu.in/fin-workshop',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    isOfficial: true,
    createdByUserId: 'user_arjun_mcc',
    createdAt: '2026-02-15T15:00:00Z',
  },
];

// Seed Purchases
export const SEED_PURCHASES: Purchase[] = [
  {
    id: 'pur_txn_101',
    transactionId: 'TXN-CAMP-98401-A1',
    buyerId: 'user_pranath_dgvc',
    buyerName: 'Pranath K.',
    buyerEmail: 'student@dgvaishnav.edu.in',
    buyerCollegeId: 'dgvaishnav',
    sellerId: 'user_priya_loyola',
    sellerName: 'Priya Sundaram',
    listingId: 'list_loyola_fa_pyq',
    listingTitle: 'Financial Accounting II — Loyola 5-Year Solved Question Papers',
    listingSubject: 'Financial Accounting',
    listingCategory: 'Previous-Year Question Papers',
    basePrice: 69,
    buyerFee: 5,
    sellerFee: 7,
    totalAmountPaid: 74,
    sellerNetAmount: 62,
    platformRevenue: 12,
    paymentMethod: 'UPI',
    paymentStatus: 'verified',
    purchasedAt: '2026-02-12T14:20:00Z',
    hasReviewed: true,
  },
  {
    id: 'pur_txn_102',
    transactionId: 'TXN-CAMP-98402-B2',
    buyerId: 'user_rahul_dgvc',
    buyerName: 'Rahul Sharma',
    buyerEmail: 'rahul.sharma@dgvaishnav.edu.in',
    buyerCollegeId: 'dgvaishnav',
    sellerId: 'user_kavya_srm',
    sellerName: 'Kavya Natarajan',
    listingId: 'list_srm_dsa_cheat_sheet',
    listingTitle: 'DSA Time Complexity & Recurrence Relations Formula Sheet',
    listingSubject: 'Data Structures & Algorithms',
    listingCategory: 'Formula Sheets',
    basePrice: 35,
    buyerFee: 4,
    sellerFee: 4,
    totalAmountPaid: 39,
    sellerNetAmount: 31,
    platformRevenue: 8,
    paymentMethod: 'UPI',
    paymentStatus: 'submitted',
    utrId: '423190881234',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    purchasedAt: '2026-02-14T09:15:00Z',
    hasReviewed: false,
  },
];

// Seed Reviews
export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    purchaseId: 'pur_txn_101',
    listingId: 'list_loyola_fa_pyq',
    buyerId: 'user_pranath_dgvc',
    buyerName: 'Pranath K.',
    buyerCollege: 'DG Vaishnav College',
    sellerId: 'user_priya_loyola',
    rating: 5,
    qualityRating: 5,
    accuracyRating: 5,
    valueRating: 5,
    comment: 'Incredible compilation! The solved balance sheet adjustments matched our semester exam format perfectly. Saved me 20+ hours of prep time.',
    createdAt: '2026-02-13T10:00:00Z',
  },
  {
    id: 'rev_2',
    purchaseId: 'pur_mock_2',
    listingId: 'list_fa_dgvc_chap4',
    buyerId: 'user_priya_loyola',
    buyerName: 'Priya Sundaram',
    buyerCollege: 'Loyola College',
    sellerId: 'user_pranath_dgvc',
    rating: 5,
    qualityRating: 5,
    accuracyRating: 5,
    valueRating: 5,
    comment: 'Super crisp handwriting and clean journal formats. The partnership dissolution illustrations were crystal clear.',
    createdAt: '2026-02-06T15:30:00Z',
  },
];

// Seed Verification Requests
export const SEED_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'ver_divya_hits',
    userId: 'user_divya_hits',
    studentName: 'Divya Krishnan',
    collegeId: 'hits',
    collegeName: 'Hindustan Institute of Technology & Science',
    courseName: 'B.Tech CSE',
    year: 2,
    email: 'divya.k@hindustanuniv.ac.in',
    method: 'student_id',
    studentIdDocUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
    status: 'pending',
    submittedAt: '2026-02-20T10:00:00Z',
  },
];

// Seed Support Tickets
export const SEED_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_101',
    userId: 'user_rahul_dgvc',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@dgvaishnav.edu.in',
    userMobile: '9876543210',
    userCollege: 'DG Vaishnav College',
    category: 'payment',
    subject: 'Verification status query for Cost Accounting notes',
    description: 'I transferred ₹39 via Google Pay and submitted UTR ID 423190881234. Wondering when it will unlock.',
    status: 'open',
    priority: 'medium',
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-02-14T09:30:00Z',
    replies: [
      {
        id: 'rep_1',
        sender: 'user',
        senderName: 'Rahul Sharma',
        message: 'I have attached the transaction screenshot with UTR 423190881234.',
        createdAt: '2026-02-14T09:30:00Z',
      },
    ],
  },
  {
    id: 'tkt_102',
    userId: 'user_divya_hits',
    userName: 'Divya Krishnan',
    userEmail: 'divya.k@hindustanuniv.ac.in',
    userMobile: '9840678901',
    userCollege: 'Hindustan University',
    category: 'seller',
    subject: 'Request to list handwritten Engineering Physics mindmaps',
    description: 'Submitted my student ID badge for verification 2 days ago. Please expedite so I can upload notes.',
    status: 'in_progress',
    priority: 'low',
    createdAt: '2026-02-18T11:00:00Z',
    updatedAt: '2026-02-18T14:00:00Z',
    replies: [],
  },
  {
    id: 'tkt_103',
    userId: 'user_arjun_mcc',
    userName: 'Arjun Ramesh',
    userEmail: 'arjun.r@mcc.edu.in',
    userMobile: '9840345678',
    userCollege: 'Madras Christian College',
    category: 'technical',
    subject: 'Live study group Zoom link question',
    description: 'Do participants need a passcode for the Costing live study session?',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-02-10T16:00:00Z',
    updatedAt: '2026-02-10T17:00:00Z',
    resolvedAt: '2026-02-10T17:00:00Z',
    replies: [
      {
        id: 'rep_2',
        sender: 'admin',
        senderName: 'Admin',
        message: 'No passcode required. The direct meeting link is embedded in your unlocked session card.',
        createdAt: '2026-02-10T17:00:00Z',
      },
    ],
  },
];

// In-Memory Database Store Class with atomic state operations
class DatabaseStore {
  public colleges: College[] = [...SEED_COLLEGES];
  public courses: Course[] = [...SEED_COURSES];
  public subjects: Subject[] = [...SEED_SUBJECTS];
  public users: User[] = [...SEED_USERS];
  public studentProfiles: StudentProfile[] = [...SEED_STUDENT_PROFILES];
  public listings: Listing[] = [...SEED_LISTINGS];
  public purchases: Purchase[] = [...SEED_PURCHASES];
  public reviews: Review[] = [...SEED_REVIEWS];
  public studyGroups: StudyGroup[] = [...SEED_STUDY_GROUPS];
  public studyGroupParticipants: StudyGroupParticipant[] = [
    {
      id: 'sg_part_1',
      studyGroupId: 'sg_fa_chap4_revision',
      userId: 'user_priya_loyola',
      userName: 'Priya Sundaram',
      userEmail: 'priya.s@loyolacollege.edu',
      userCollege: 'Loyola College',
      amountPaid: 25,
      paymentStatus: 'successful',
      joinedAt: '2026-02-16T12:00:00Z',
    },
  ];
  public announcements: Announcement[] = [...SEED_ANNOUNCEMENTS];
  public notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      userId: 'user_pranath_dgvc',
      title: '✓ Account Verified',
      message: 'Your DG Vaishnav College student status has been successfully verified! You can now list academic resources.',
      type: 'verification',
      isRead: false,
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'notif_2',
      userId: 'user_pranath_dgvc',
      title: '🎉 New Sale Alert!',
      message: 'Someone from Loyola College just purchased your "Financial Accounting — Chapter 4 Revision Notes" (₹49).',
      type: 'sale',
      isRead: false,
      createdAt: '2026-02-12T14:20:00Z',
    },
  ];
  public reports: Report[] = [
    {
      id: 'rep_1',
      reporterUserId: 'user_pranath_dgvc',
      reporterName: 'Pranath K.',
      reportedListingId: 'list_mock_flagged',
      reason: 'misleading_resource',
      description: 'Outdated syllabus copy from 2019 labeled as 2026 regulation.',
      status: 'resolved',
      adminNotes: 'Seller updated file to 2026 syllabus version.',
      actionTaken: 'Seller notified and file updated',
      createdAt: '2026-02-10T11:00:00Z',
      resolvedAt: '2026-02-11T16:00:00Z',
    },
  ];
  public supportTickets: SupportTicket[] = [...SEED_SUPPORT_TICKETS];
  public verifications: VerificationRequest[] = [...SEED_VERIFICATIONS];
  public platformSettings: PlatformSettings = {
    ...DEFAULT_PLATFORM_SETTINGS,
    platformName: 'Campux Chennai',
    supportEmail: 'support@campux.in',
    activeCity: 'Chennai',
    allowedFileTypes: ['PDF', 'DOCX', 'EPUB'],
    maxUploadSizeMb: 50,
    minNotePrice: 10,
    maxNotePrice: 500,
    studyGroupFeePercentage: 0.1,
  };
  public auditLogs: AuditLog[] = [
    {
      id: 'log_1',
      adminUserId: 'user_admin',
      adminName: 'Master Administrator',
      action: 'PLATFORM_INITIALIZED',
      entity: 'SYSTEM',
      entityId: 'ALL',
      details: 'Platform initialized with 6 Chennai premier institutions, single unified admin portal, and verified curriculum mappings.',
      timestamp: '2026-01-01T00:00:00Z',
    },
  ];

  public paymentSubmissions: PaymentSubmission[] = [
    {
      id: 'sub_pending_101',
      purchaseId: 'pur_txn_102',
      buyerId: 'user_rahul_dgvc',
      buyerName: 'Rahul Sharma',
      buyerMobile: '9876543210',
      buyerCollegeId: 'DG Vaishnav College',
      listingId: 'list_srm_dsa_cheat_sheet',
      listingTitle: 'DSA Time Complexity & Recurrence Relations Formula Sheet',
      amount: 39,
      utrId: '423190881234',
      screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      status: 'submitted',
      isDuplicateFlagged: false,
      submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
  ];

  // Helper Methods
  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
  }

  getUserByMobileOrEmail(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) =>
        u.mobile === clean ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.id && u.id.toLowerCase() === clean)
    );
  }

  getStudentProfile(userId: string) {
    return this.studentProfiles.find((p) => p.userId === userId);
  }

  updateStudentProfile(userId: string, data: Partial<StudentProfile>) {
    const idx = this.studentProfiles.findIndex((p) => p.userId === userId);
    if (idx !== -1) {
      this.studentProfiles[idx] = { ...this.studentProfiles[idx], ...data };
      return this.studentProfiles[idx];
    }
    return null;
  }

  getCollegeById(id: string) {
    return this.colleges.find((c) => c.id === id);
  }

  getListingById(id: string) {
    return this.listings.find((l) => l.id === id);
  }

  getListingReviews(listingId: string) {
    return this.reviews.filter((r) => r.listingId === listingId);
  }

  hasPurchased(buyerId: string, listingId: string): boolean {
    return this.purchases.some(
      (p) =>
        p.buyerId === buyerId &&
        p.listingId === listingId &&
        (p.paymentStatus === 'verified' || p.paymentStatus === 'successful')
    );
  }

  hasJoinedStudyGroup(userId: string, studyGroupId: string): boolean {
    return this.studyGroupParticipants.some(
      (p) => p.userId === userId && p.studyGroupId === studyGroupId
    );
  }

  // Audit Logger
  logAudit(
    adminUserId: string,
    adminName: string,
    action: string,
    entity: string,
    entityId: string,
    details: string,
    previousStatus?: string,
    newStatus?: string
  ) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminUserId,
      adminName,
      action,
      entity,
      entityId,
      previousStatus,
      newStatus,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Submit Manual Payment
  submitManualPayment(params: {
    buyerId: string;
    buyerName: string;
    buyerMobile: string;
    buyerCollegeId: string;
    buyerEmail?: string;
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
    utrId: string;
    screenshotUrl: string;
  }) {
    const purchaseId = `pur_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const txnId = `TXN-CAMP-${Date.now().toString().slice(-5)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const isDuplicate = this.paymentSubmissions.some(
      (s) => s.utrId.trim().toLowerCase() === params.utrId.trim().toLowerCase()
    );

    const purchase: Purchase = {
      id: purchaseId,
      transactionId: txnId,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      buyerMobile: params.buyerMobile,
      buyerEmail: params.buyerEmail,
      buyerCollegeId: params.buyerCollegeId,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      listingId: params.listingId,
      listingTitle: params.listingTitle,
      listingSubject: params.listingSubject,
      listingCategory: params.listingCategory,
      basePrice: params.basePrice,
      buyerFee: params.buyerFee,
      sellerFee: params.sellerFee,
      totalAmountPaid: params.totalAmountPaid,
      sellerNetAmount: params.sellerNetAmount,
      platformRevenue: params.platformRevenue,
      paymentMethod: 'UPI',
      paymentStatus: 'submitted',
      utrId: params.utrId,
      screenshotUrl: params.screenshotUrl,
      purchasedAt: now,
      hasReviewed: false,
    };

    const submission: PaymentSubmission = {
      id: submissionId,
      purchaseId,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      buyerMobile: params.buyerMobile,
      buyerCollegeId: params.buyerCollegeId,
      listingId: params.listingId,
      listingTitle: params.listingTitle,
      amount: params.totalAmountPaid,
      utrId: params.utrId,
      screenshotUrl: params.screenshotUrl,
      status: 'submitted',
      isDuplicateFlagged: isDuplicate,
      submittedAt: now,
    };

    this.purchases.unshift(purchase);
    this.paymentSubmissions.unshift(submission);

    // Dispatch Notification to Buyer
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: params.buyerId,
      title: 'Payment Submitted',
      message: `Your payment of ₹${params.totalAmountPaid} for "${params.listingTitle}" has been submitted and is awaiting verification.`,
      type: 'payment_submitted',
      isRead: false,
      createdAt: now,
    });

    return { purchase, submission, isDuplicate };
  }

  // Approve Payment by Admin
  approvePayment(submissionId: string, adminUserId: string): boolean {
    const submission = this.paymentSubmissions.find((s) => s.id === submissionId);
    if (!submission) return false;

    const purchase = this.purchases.find((p) => p.id === submission.purchaseId);
    const now = new Date().toISOString();
    const admin = this.getUserById(adminUserId);
    const adminName = admin?.fullName || 'Admin';

    submission.status = 'verified';
    submission.verifiedAt = now;
    submission.verifiedBy = adminUserId;

    if (purchase) {
      const prevStatus = purchase.paymentStatus;
      purchase.paymentStatus = 'verified';
      purchase.verifiedAt = now;

      // Update listing purchase count
      const listing = this.listings.find((l) => l.id === purchase.listingId);
      if (listing) {
        listing.purchasesCount += 1;
      }

      // Update seller stats
      const sellerProfile = this.studentProfiles.find((p) => p.userId === purchase.sellerId);
      if (sellerProfile) {
        sellerProfile.resourcesSoldCount += 1;
      }

      // Notify Buyer
      this.notifications.unshift({
        id: `notif_${Date.now()}_appr`,
        userId: purchase.buyerId,
        title: 'Payment Verified ✓',
        message: `Your payment for "${purchase.listingTitle}" has been verified! Your notes are ready to download in My Purchases.`,
        type: 'payment_verified',
        isRead: false,
        createdAt: now,
      });

      // Notify Seller
      this.notifications.unshift({
        id: `notif_${Date.now()}_seller`,
        userId: purchase.sellerId,
        title: '🎉 New Sale Confirmed!',
        message: `Your note "${purchase.listingTitle}" was purchased by ${purchase.buyerName}. Net payout of ₹${purchase.sellerNetAmount} credited.`,
        type: 'sale',
        isRead: false,
        createdAt: now,
      });

      // Log audit
      this.logAudit(
        adminUserId,
        adminName,
        'APPROVE_PAYMENT',
        'PAYMENT',
        submission.id,
        `Approved payment for order ${purchase.id} (UTR: ${submission.utrId}, Amount: ₹${submission.amount})`,
        prevStatus,
        'verified'
      );
    }

    return true;
  }

  // Reject Payment by Admin
  rejectPayment(submissionId: string, adminUserId: string, reason: string): boolean {
    const submission = this.paymentSubmissions.find((s) => s.id === submissionId);
    if (!submission) return false;

    const purchase = this.purchases.find((p) => p.id === submission.purchaseId);
    const now = new Date().toISOString();
    const admin = this.getUserById(adminUserId);
    const adminName = admin?.fullName || 'Admin';

    submission.status = 'rejected';
    submission.verifiedAt = now;
    submission.verifiedBy = adminUserId;
    submission.rejectionReason = reason;

    if (purchase) {
      const prevStatus = purchase.paymentStatus;
      purchase.paymentStatus = 'rejected';
      purchase.rejectionReason = reason;

      // Notify Buyer
      this.notifications.unshift({
        id: `notif_${Date.now()}_rej`,
        userId: purchase.buyerId,
        title: 'Payment Rejected',
        message: `Your payment for "${purchase.listingTitle}" was rejected. Reason: ${reason}. Please verify and resubmit.`,
        type: 'payment_rejected',
        isRead: false,
        createdAt: now,
      });

      // Log audit
      this.logAudit(
        adminUserId,
        adminName,
        'REJECT_PAYMENT',
        'PAYMENT',
        submission.id,
        `Rejected payment for order ${purchase.id} (Reason: ${reason})`,
        prevStatus,
        'rejected'
      );
    }

    return true;
  }

  // Suspend or Ban Student
  suspendStudent(userId: string, isBanned: boolean = false, reason: string = 'Policy violation', adminUserId: string = 'user_admin') {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.isSuspended = true;
    user.isBanned = isBanned;
    user.status = isBanned ? 'banned' : 'suspended';

    const admin = this.getUserById(adminUserId);
    this.logAudit(
      adminUserId,
      admin?.fullName || 'Admin',
      isBanned ? 'BAN_STUDENT' : 'SUSPEND_STUDENT',
      'USER',
      userId,
      `${isBanned ? 'Banned' : 'Suspended'} student ${user.fullName} (${user.mobile}). Reason: ${reason}`
    );
    return true;
  }

  // Restore Student
  restoreStudent(userId: string, adminUserId: string = 'user_admin') {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.isSuspended = false;
    user.isBanned = false;
    user.status = 'active';

    const admin = this.getUserById(adminUserId);
    this.logAudit(
      adminUserId,
      admin?.fullName || 'Admin',
      'RESTORE_STUDENT',
      'USER',
      userId,
      `Restored account for student ${user.fullName}`
    );
    return true;
  }

  // Listing Management
  approveListing(listingId: string, adminUserId: string = 'user_admin') {
    const listing = this.getListingById(listingId);
    if (!listing) return false;
    listing.status = 'active';
    listing.updatedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'APPROVE_LISTING', 'LISTING', listingId, `Approved listing: ${listing.title}`);
    return true;
  }

  rejectListing(listingId: string, reason: string, adminUserId: string = 'user_admin') {
    const listing = this.getListingById(listingId);
    if (!listing) return false;
    listing.status = 'rejected';
    listing.rejectionReason = reason;
    listing.updatedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'REJECT_LISTING', 'LISTING', listingId, `Rejected listing: ${listing.title}. Reason: ${reason}`);
    return true;
  }

  removeListing(listingId: string, reason: string, adminUserId: string = 'user_admin') {
    const listing = this.getListingById(listingId);
    if (!listing) return false;
    listing.status = 'removed';
    listing.rejectionReason = reason;
    listing.updatedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'REMOVE_LISTING', 'LISTING', listingId, `Removed listing: ${listing.title}. Reason: ${reason}`);
    return true;
  }

  hideListing(listingId: string, adminUserId: string = 'user_admin') {
    const listing = this.getListingById(listingId);
    if (!listing) return false;
    listing.status = listing.status === 'hidden' ? 'active' : 'hidden';
    listing.updatedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'TOGGLE_HIDE_LISTING', 'LISTING', listingId, `Toggled visibility for listing: ${listing.title}`);
    return true;
  }

  // Reports & Safety
  resolveReport(reportId: string, actionTaken: string, adminNotes?: string, adminUserId: string = 'user_admin') {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return false;
    rep.status = 'resolved';
    rep.actionTaken = actionTaken;
    rep.adminNotes = adminNotes || rep.adminNotes;
    rep.resolvedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'RESOLVE_REPORT', 'REPORT', reportId, `Resolved report #${reportId}. Action: ${actionTaken}`);
    return true;
  }

  dismissReport(reportId: string, adminUserId: string = 'user_admin') {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return false;
    rep.status = 'dismissed';
    rep.resolvedAt = new Date().toISOString();

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'DISMISS_REPORT', 'REPORT', reportId, `Dismissed report #${reportId}`);
    return true;
  }

  // Support Tickets
  replySupportTicket(ticketId: string, message: string, newStatus?: TicketStatus, adminNotes?: string, adminUserId: string = 'user_admin') {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return false;

    const now = new Date().toISOString();
    const admin = this.getUserById(adminUserId);
    const adminName = admin?.fullName || 'Admin';

    ticket.replies.push({
      id: `rep_${Date.now()}`,
      sender: 'admin',
      senderName: adminName,
      message,
      createdAt: now,
    });

    if (newStatus) {
      ticket.status = newStatus;
      if (newStatus === 'resolved' || newStatus === 'closed') {
        ticket.resolvedAt = now;
      }
    }
    if (adminNotes) {
      ticket.adminNotes = adminNotes;
    }
    ticket.updatedAt = now;

    this.logAudit(adminUserId, adminName, 'REPLY_SUPPORT_TICKET', 'SUPPORT_TICKET', ticketId, `Replied to ticket #${ticketId}`);
    return true;
  }

  // Broadcast Notification
  broadcastNotification(
    target: { type: 'individual' | 'college' | 'course' | 'global'; targetId?: string },
    title: string,
    message: string,
    adminUserId: string = 'user_admin'
  ) {
    const now = new Date().toISOString();
    let recipients: string[] = [];

    if (target.type === 'individual' && target.targetId) {
      recipients = [target.targetId];
    } else if (target.type === 'college' && target.targetId) {
      recipients = this.studentProfiles
        .filter((p) => p.collegeId === target.targetId)
        .map((p) => p.userId);
    } else if (target.type === 'course' && target.targetId) {
      recipients = this.studentProfiles
        .filter((p) => p.courseId === target.targetId)
        .map((p) => p.userId);
    } else {
      recipients = this.users.filter((u) => u.role === 'student').map((u) => u.id);
    }

    recipients.forEach((userId) => {
      this.notifications.unshift({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        userId,
        title,
        message,
        type: 'system',
        isRead: false,
        createdAt: now,
      });
    });

    const admin = this.getUserById(adminUserId);
    this.logAudit(
      adminUserId,
      admin?.fullName || 'Admin',
      'BROADCAST_NOTIFICATION',
      'NOTIFICATION',
      target.type,
      `Broadcasted "${title}" to ${recipients.length} recipients (${target.type})`
    );
    return recipients.length;
  }

  // College CRUD
  addCollege(data: Partial<College>, adminUserId: string = 'user_admin') {
    const newCollege: College = {
      id: data.id || `col_${Date.now()}`,
      name: data.name || 'New College',
      shortName: data.shortName || 'COL',
      city: data.city || 'Chennai',
      state: data.state || 'Tamil Nadu',
      address: data.address || '',
      website: data.website || '',
      emailDomains: data.emailDomains || [],
      status: data.status || 'active',
      bannerGradient: data.bannerGradient || 'from-indigo-700 via-blue-800 to-slate-900',
      stats: { studentsCount: 0, resourcesCount: 0, studyGroupsCount: 0 },
    };
    this.colleges.push(newCollege);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'ADD_COLLEGE', 'COLLEGE', newCollege.id, `Added college ${newCollege.name}`);
    return newCollege;
  }

  updateCollege(id: string, data: Partial<College>, adminUserId: string = 'user_admin') {
    const col = this.getCollegeById(id);
    if (!col) return false;
    Object.assign(col, data);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'UPDATE_COLLEGE', 'COLLEGE', id, `Updated college ${col.name}`);
    return col;
  }

  toggleCollegeStatus(id: string, adminUserId: string = 'user_admin') {
    const col = this.getCollegeById(id);
    if (!col) return false;
    col.status = col.status === 'active' ? 'disabled' : 'active';

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'TOGGLE_COLLEGE_STATUS', 'COLLEGE', id, `${col.name} status changed to ${col.status}`);
    return col;
  }

  // Academic Structure
  addCourse(data: Partial<Course>, adminUserId: string = 'user_admin') {
    const newCourse: Course = {
      id: data.id || `crs_${Date.now()}`,
      collegeId: data.collegeId || 'dgvaishnav',
      name: data.name || 'New Course',
      code: data.code || 'CRS',
      durationYears: Number(data.durationYears) || 3,
      totalSemesters: Number(data.totalSemesters) || 6,
    };
    this.courses.push(newCourse);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'ADD_COURSE', 'COURSE', newCourse.id, `Added course ${newCourse.name}`);
    return newCourse;
  }

  addSubject(data: Partial<Subject>, adminUserId: string = 'user_admin') {
    const newSub: Subject = {
      id: data.id || `sub_${Date.now()}`,
      courseId: data.courseId || 'dgvc_bcom_gen',
      collegeId: data.collegeId || 'dgvaishnav',
      name: data.name || 'New Subject',
      code: data.code || 'SUB',
      year: Number(data.year) || 1,
      semester: Number(data.semester) || 1,
      canonicalKey: data.canonicalKey || data.name?.toLowerCase().replace(/\s+/g, '_') || 'general',
      tags: data.tags || [],
      status: 'active',
    };
    this.subjects.push(newSub);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'ADD_SUBJECT', 'SUBJECT', newSub.id, `Added subject ${newSub.name}`);
    return newSub;
  }

  toggleSubjectStatus(id: string, adminUserId: string = 'user_admin') {
    const sub = this.subjects.find((s) => s.id === id);
    if (!sub) return false;
    sub.status = sub.status === 'active' ? 'disabled' : 'active';

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'TOGGLE_SUBJECT_STATUS', 'SUBJECT', id, `${sub.name} status changed to ${sub.status}`);
    return sub;
  }

  // Reviews
  deleteReview(reviewId: string, adminUserId: string = 'user_admin') {
    const idx = this.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return false;
    const rev = this.reviews[idx];
    this.reviews.splice(idx, 1);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'DELETE_REVIEW', 'REVIEW', reviewId, `Deleted review by ${rev.buyerName} on listing ${rev.listingId}`);
    return true;
  }

  // Study Groups
  updateStudyGroupStatus(id: string, status: StudyGroup['status'], adminUserId: string = 'user_admin') {
    const grp = this.studyGroups.find((g) => g.id === id);
    if (!grp) return false;
    grp.status = status;

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'UPDATE_STUDY_GROUP_STATUS', 'STUDY_GROUP', id, `Updated study group "${grp.title}" status to ${status}`);
    return true;
  }

  // Announcements
  createAnnouncement(data: Partial<Announcement>, adminUserId: string = 'user_admin') {
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: data.title || 'New Announcement',
      description: data.description || '',
      collegeId: data.collegeId || 'dgvaishnav',
      collegeName: data.collegeName || 'DG Vaishnav College',
      organizer: data.organizer || 'Admin Office',
      category: data.category || 'EVENT',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '10:00 AM',
      venueOrOnline: data.venueOrOnline || 'Campus Main Auditorium',
      registrationLink: data.registrationLink || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&auto=format&fit=crop&q=80',
      isOfficial: true,
      status: data.status || 'published',
      createdByUserId: adminUserId,
      createdAt: new Date().toISOString(),
    };
    this.announcements.unshift(newAnn);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'CREATE_ANNOUNCEMENT', 'ANNOUNCEMENT', newAnn.id, `Created announcement: ${newAnn.title}`);
    return newAnn;
  }

  updateAnnouncement(id: string, data: Partial<Announcement>, adminUserId: string = 'user_admin') {
    const ann = this.announcements.find((a) => a.id === id);
    if (!ann) return false;
    Object.assign(ann, data);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'UPDATE_ANNOUNCEMENT', 'ANNOUNCEMENT', id, `Updated announcement: ${ann.title}`);
    return ann;
  }

  deleteAnnouncement(id: string, adminUserId: string = 'user_admin') {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const ann = this.announcements[idx];
    this.announcements.splice(idx, 1);

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'DELETE_ANNOUNCEMENT', 'ANNOUNCEMENT', id, `Deleted announcement: ${ann.title}`);
    return true;
  }

  // Settings
  updatePlatformSettings(newSettings: Partial<PlatformSettings>, adminUserId: string = 'user_admin') {
    this.platformSettings = {
      ...this.platformSettings,
      ...newSettings,
    };

    const admin = this.getUserById(adminUserId);
    this.logAudit(adminUserId, admin?.fullName || 'Admin', 'UPDATE_SETTINGS', 'SETTINGS', 'PLATFORM', 'Updated platform configuration and fee parameters');
    return this.platformSettings;
  }

  resetToSeed() {
    this.colleges = [...SEED_COLLEGES];
    this.courses = [...SEED_COURSES];
    this.subjects = [...SEED_SUBJECTS];
    this.users = [...SEED_USERS];
    this.studentProfiles = [...SEED_STUDENT_PROFILES];
    this.listings = [...SEED_LISTINGS];
    this.purchases = [...SEED_PURCHASES];
    this.reviews = [...SEED_REVIEWS];
    this.studyGroups = [...SEED_STUDY_GROUPS];
    this.announcements = [...SEED_ANNOUNCEMENTS];
    this.supportTickets = [...SEED_SUPPORT_TICKETS];
    this.verifications = [...SEED_VERIFICATIONS];
    this.platformSettings = { ...DEFAULT_PLATFORM_SETTINGS };
  }
}

// Global Singleton Database Instance
declare global {
  // eslint-disable-next-line no-var
  var __campuxDb: DatabaseStore | undefined;
}

export const db: DatabaseStore = globalThis.__campuxDb || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__campuxDb = db;
}
