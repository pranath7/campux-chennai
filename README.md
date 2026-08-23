# Campux Chennai — Verified Student Academic Marketplace & College Community

> **Find. Share. Learn. Grow — within your Chennai college community.**

Campux is a production-quality, digital-first academic marketplace and collegiate community platform built specifically for students in **Chennai, Tamil Nadu, India**. It brings together verified peer notes, formula cheat sheets, solved university question banks, and paid live study groups into a secure, trust-first platform.

---

## 🏛️ Initial Launch Geography: Chennai Premier Campuses

Pre-configured with authentic curricula and course structures across 6 Chennai institutions:
1. **DG Vaishnav College (DGVC)** — Arumbakkam
2. **Loyola College** — Nungambakkam
3. **Madras Christian College (MCC)** — Tambaram
4. **SRM Institute of Science & Technology** — Kattankulathur / Ramapuram
5. **VIT Chennai** — Vandalur-Kelambakkam Road
6. **Hindustan Institute of Technology & Science (HITS)** — Padur

---

## ✨ Key Features & Architecture

### 1. 🛡️ Verification & Seller Credibility
- **Instant Institutional Email Domain Matching** (`@dgvaishnav.edu.in`, `@loyolacollege.edu`, `@mcc.edu.in`, `@srmist.edu.in`, `@vit.ac.in`).
- **Student ID Document Upload** for admin review.
- **✓ Verified Student Badge** (strictly required to create marketplace listings).
- **Credibility Score Engine (0–100)**: Transparent score computed from rating performance, verified sales volume, dispute history, and institutional verification bonus.

### 2. 🔒 Secure Digital Resource Vault
- **Digital-Only Platform**: Zero physical logistics or barter complexity in MVP.
- **Private File Protection**: Digital assets are stored securely with tokenized, time-limited download signatures. Public access is locked.
- **Watermarked Preview Extracts**: Non-buyers can review sample excerpts, syllabus outlines, and page counts before purchase.

### 3. 💳 Payment Architecture & Transparent Fee Model
- **Indian Payment Gateway Abstraction**: Supports UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, Mastercard, RuPay), and NetBanking.
- **Dynamic Fee Architecture**:
  - `Buyer Convenience Fee` (e.g. 5% + ₹2 fixed).
  - `Seller Platform Deduction` (e.g. 10%).
  - Configurable directly from the Admin Management portal.

### 4. 🧭 Rules-Based Smart Cross-College Matching
- **Zero AI Dependency**: Deterministic semantic curriculum alignment maps equivalent modules across Chennai universities (e.g., Financial Accounting between DG Vaishnav $\leftrightarrow$ Loyola $\leftrightarrow$ MCC).
- **"Students studying [Subject] at other Chennai colleges are using these"** discovery section.

### 5. 👥 Paid Live Study Groups
- Small-batch (15–25 students) live revision sessions hosted by top peer tutors.
- Host credentials & seat capacity tracking.
- Google Meet / Zoom link unlocking upon paid enrollment.

### 6. 📢 Campus Announcements & Pulse
- Inter-collegiate symposia, hackathons, workshops, and internship drives.
- Filter by *My College* vs *All Chennai Colleges*.

### 7. ⚖️ Trust & Safety Moderation
- 1-click **Report Resource** and **Report User** for copyright violations, misconduct, or misleading content.
- Admin dashboard to review ID verifications, resolve reports, and inspect the financial ledger.

---

## 🎭 1-Click Presentation & Demo Accounts

Use the **top presentation bar** to instantly switch between personas without entering passwords:

| Role | Name | Institution / Course | Key Privileges |
| :--- | :--- | :--- | :--- |
| **Demo Student / Top Creator** | `Pranath K.` | DG Vaishnav College (B.Com 2nd Yr) | 94/100 Credibility, Verified Student, Listed notes, Purchases & Reviews |
| **Top CS Creator** | `Priya Sundaram` | Loyola College (B.Sc CS 3rd Yr) | 96/100 Credibility, Solved PYQ & DSA notes, Live Study Group host |
| **College Administrator** | `Prof. S. Ranganathan` | DG Vaishnav College Admin | Student verification review, college announcements |
| **Platform Super Admin** | `Campux Super Admin` | Platform Operations | Full metrics, platform fee config, trust moderation |

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone <repo-url>
cd ca-foundation-os

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Campux Chennai"
PORT=3000
```

### 3. Run Locally
```bash
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Technical Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/             # Analytics metrics & moderation actions
│   │   ├── announcements/     # Campus notices
│   │   ├── auth/              # Login, register, session, demo switcher
│   │   ├── checkout/          # Server-side payment & fee breakdown
│   │   ├── colleges/          # Colleges, courses, subjects master data
│   │   ├── listings/          # Marketplace search & upload
│   │   ├── purchases/         # Buyer library
│   │   ├── resources/[id]/    # Tokenized download & previews
│   │   ├── reviews/           # 1-5 star ratings & credibility update
│   │   ├── seller/            # Seller revenue analytics
│   │   ├── smart-match/       # Cross-college subject matcher
│   │   ├── study-groups/      # Paid live study sessions
│   │   └── verification/      # Student ID & email verify
│   ├── announcements/         # Announcements board
│   ├── marketplace/           # Multi-filter search & cards
│   ├── my-purchases/          # Buyer portal & downloads
│   ├── policy/                # Academic integrity pledge
│   ├── profile/               # Student credibility & badges
│   ├── resources/[id]/        # Resource detail & locked preview
│   ├── sell/                  # Resource listing creator
│   ├── seller/                # Seller earnings & transactions
│   ├── smart-match/           # Cross-college explorer
│   ├── study-groups/          # Live study groups hub
│   ├── admin/                 # Admin management center
│   ├── layout.tsx             # Root layout & providers
│   └── page.tsx               # 10-section landing page
├── components/
│   ├── announcements/         # Announcement cards
│   ├── layout/                # Navbar, Footer
│   ├── marketplace/           # ResourceCard, CheckoutModal, PreviewModal, ReviewModal, ReportModal
│   ├── presentation/          # DemoBar 1-click persona switcher
│   ├── study-groups/          # StudyGroupCard
│   └── verification/          # VerificationModal
├── context/
│   └── AuthContext.tsx        # React session & notification context
├── lib/
│   ├── auth.ts                # Session management & token handling
│   ├── brandConfig.ts         # Configurable branding & tokens
│   ├── credibility.ts         # Modular credibility algorithm
│   ├── db.ts                  # Relational store & Chennai seed data
│   ├── payment.ts             # Fee calculator & gateway abstraction
│   ├── smartMatch.ts          # Rules-based curriculum matcher
│   └── storage.ts             # Digital vault & secure signed tokens
└── types/
    └── marketplace.ts         # TypeScript domain models
```
