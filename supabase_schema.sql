-- ====================================================================
-- CAMPUX CHENNAI — SUPABASE DATABASE MIGRATION & RLS SECURITY SCHEMA
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Chennai',
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    address TEXT NOT NULL,
    website TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    logo_url TEXT,
    email_domains JSONB DEFAULT '[]'::jsonb,
    banner_gradient TEXT DEFAULT 'from-stone-900 to-stone-800',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    duration_years INT NOT NULL DEFAULT 3,
    total_semesters INT NOT NULL DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    year INT NOT NULL DEFAULT 1,
    semester INT NOT NULL DEFAULT 1,
    canonical_key TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    college_id TEXT REFERENCES public.colleges(id) ON DELETE SET NULL,
    college_name TEXT,
    course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
    course_name TEXT,
    year INT NOT NULL DEFAULT 1,
    section TEXT DEFAULT 'A',
    semester INT NOT NULL DEFAULT 1,
    avatar_url TEXT,
    bio TEXT,
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    verified_badge BOOLEAN NOT NULL DEFAULT FALSE,
    credibility_score INT NOT NULL DEFAULT 50,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0.0,
    review_count INT NOT NULL DEFAULT 0,
    resources_sold_count INT NOT NULL DEFAULT 0,
    resources_listed_count INT NOT NULL DEFAULT 0,
    payout_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MARKETPLACE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id TEXT PRIMARY KEY DEFAULT ('list_' || substr(md5(random()::text), 1, 12)),
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    seller_college_id TEXT NOT NULL,
    seller_avatar_url TEXT,
    seller_credibility_score INT NOT NULL DEFAULT 50,
    seller_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    seller_verified BOOLEAN NOT NULL DEFAULT FALSE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    canonical_key TEXT NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    price INT NOT NULL CHECK (price >= 10),
    page_count INT NOT NULL DEFAULT 1,
    file_format TEXT NOT NULL DEFAULT 'PDF',
    file_size_formatted TEXT NOT NULL DEFAULT '5.0 MB',
    storage_key TEXT NOT NULL,
    preview_image_urls JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'flagged')),
    views_count INT NOT NULL DEFAULT 0,
    purchases_count INT NOT NULL DEFAULT 0,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    total_reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PURCHASES & PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.purchases (
    id TEXT PRIMARY KEY DEFAULT ('pur_' || substr(md5(random()::text), 1, 12)),
    transaction_id TEXT UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT,
    buyer_mobile TEXT,
    buyer_college_id TEXT,
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    listing_title TEXT NOT NULL,
    listing_subject TEXT,
    listing_category TEXT,
    base_price INT NOT NULL,
    buyer_fee INT NOT NULL DEFAULT 0,
    seller_fee INT NOT NULL DEFAULT 0,
    total_amount_paid INT NOT NULL,
    seller_net_amount INT NOT NULL,
    platform_revenue INT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    payment_status TEXT NOT NULL DEFAULT 'submitted' CHECK (payment_status IN ('pending', 'submitted', 'verified', 'rejected', 'successful', 'refunded')),
    utr_id TEXT,
    screenshot_url TEXT,
    rejection_reason TEXT,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    has_reviewed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev_' || substr(md5(random()::text), 1, 12)),
    purchase_id TEXT NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_college TEXT,
    seller_id TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT NOT NULL DEFAULT 5,
    accuracy_rating INT NOT NULL DEFAULT 5,
    value_rating INT NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STUDY GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.study_groups (
    id TEXT PRIMARY KEY DEFAULT ('sg_' || substr(md5(random()::text), 1, 12)),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    college_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    host_id TEXT NOT NULL,
    host_name TEXT NOT NULL,
    host_avatar_url TEXT,
    host_credibility_score INT NOT NULL DEFAULT 50,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    fee INT NOT NULL DEFAULT 0,
    max_participants INT NOT NULL DEFAULT 20,
    current_participants INT NOT NULL DEFAULT 0,
    meeting_link TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. STUDY GROUP PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.study_group_participants (
    id TEXT PRIMARY KEY DEFAULT ('sg_part_' || substr(md5(random()::text), 1, 12)),
    study_group_id TEXT NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    user_college TEXT,
    amount_paid INT NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'successful',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT ('ann_' || substr(md5(random()::text), 1, 12)),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('EVENT', 'CLUB', 'WORKSHOP', 'INTERNSHIP', 'COMPETITION', 'SEMINAR', 'OPPORTUNITY')),
    college_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    date TEXT NOT NULL,
    deadline_date TEXT,
    cta_label TEXT DEFAULT 'View Details',
    cta_url TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY DEFAULT ('tkt_' || substr(md5(random()::text), 1, 12)),
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    user_mobile TEXT,
    user_college TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    replies JSONB DEFAULT '[]'::jsonb
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('log_' || substr(md5(random()::text), 1, 12)),
    admin_user_id TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies (Public / Verified Students)
CREATE POLICY "Public Read Colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Read Subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public Read Active Listings" ON public.listings FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public Read Study Groups" ON public.study_groups FOR SELECT USING (true);

-- Profiles policy: Users can read all basic student public profiles
CREATE POLICY "Allow Profile Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow User Update Own Profile" ON public.profiles FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Purchases: User can read only their own purchases or seller sales
CREATE POLICY "User View Own Purchases" ON public.purchases FOR SELECT USING (
    buyer_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
    seller_id = current_setting('request.jwt.claims', true)::json->>'sub'
);

-- Service Role Full Access (Bypasses RLS for backend API operations)
-- (Supabase service_role key automatically bypasses RLS on server endpoints)

-- ====================================================================
-- STORAGE BUCKETS (Execute in Supabase Storage or via SQL)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('notes_vault', 'notes_vault', false),
('payment_proofs', 'payment_proofs', false),
('student_ids', 'student_ids', false),
('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
