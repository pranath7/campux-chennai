/**
 * Rules-Based Smart Subject & Cross-College Matcher
 * Non-AI deterministic curriculum alignment across Chennai collegiate systems
 */

import { Listing, StudentProfile } from '@/types/marketplace';

// Mapping of canonical academic subject keys to synonymous terms & cross-college equivalents
export const SUBJECT_CURRICULUM_EQUIVALENCY: Record<
  string,
  {
    displayName: string;
    equivalentCourses: string[];
    synonyms: string[];
    relatedCanonicals: string[];
  }
> = {
  financial_accounting: {
    displayName: 'Financial Accounting',
    equivalentCourses: ['B.Com', 'B.Com Corporate Secretaryship', 'B.Com Accounting & Finance', 'BBA'],
    synonyms: ['Accounts', 'Financial Accounts', 'Advanced Accounting', 'Basic Accounting'],
    relatedCanonicals: ['cost_accounting', 'management_accounting', 'auditing'],
  },
  cost_accounting: {
    displayName: 'Cost Accounting',
    equivalentCourses: ['B.Com', 'B.Com Accounting & Finance', 'BBA'],
    synonyms: ['Costing', 'Cost & Management Accounting', 'Process Costing'],
    relatedCanonicals: ['financial_accounting', 'management_accounting'],
  },
  business_law: {
    displayName: 'Business & Mercantile Law',
    equivalentCourses: ['B.Com', 'BBA', 'B.Com Corporate Secretaryship'],
    synonyms: ['Company Law', 'Mercantile Law', 'Commercial Law', 'Contract Act'],
    relatedCanonicals: ['company_law', 'corporate_governance'],
  },
  business_economics: {
    displayName: 'Business & Managerial Economics',
    equivalentCourses: ['B.Com', 'BBA', 'B.A Economics'],
    synonyms: ['Microeconomics', 'Macroeconomics', 'Managerial Economics'],
    relatedCanonicals: ['business_environment', 'financial_management'],
  },
  data_structures: {
    displayName: 'Data Structures & Algorithms',
    equivalentCourses: ['B.Sc Computer Science', 'BCA', 'B.Tech CSE', 'B.Tech IT'],
    synonyms: ['DSA', 'Data Structures in C/C++', 'Advanced Data Structures'],
    relatedCanonicals: ['design_analysis_algorithms', 'operating_systems', 'dbms'],
  },
  dbms: {
    displayName: 'Database Management Systems',
    equivalentCourses: ['B.Sc Computer Science', 'BCA', 'B.Tech CSE', 'B.Tech IT'],
    synonyms: ['DBMS', 'SQL & RDBMS', 'Relational Databases', 'Database Systems'],
    relatedCanonicals: ['data_structures', 'web_development', 'operating_systems'],
  },
  operating_systems: {
    displayName: 'Operating Systems & System Programming',
    equivalentCourses: ['B.Sc Computer Science', 'BCA', 'B.Tech CSE', 'B.Tech IT'],
    synonyms: ['OS', 'Linux & Shell Programming', 'Unix Internals'],
    relatedCanonicals: ['computer_networks', 'data_structures'],
  },
  python_programming: {
    displayName: 'Python Programming & Problem Solving',
    equivalentCourses: ['B.Sc Computer Science', 'BCA', 'B.Tech CSE', 'B.Sc Data Science'],
    synonyms: ['Python', 'Problem Solving in Python', 'Intro to Python'],
    relatedCanonicals: ['machine_learning', 'data_structures', 'web_development'],
  },
  discrete_mathematics: {
    displayName: 'Discrete Mathematics & Graph Theory',
    equivalentCourses: ['B.Sc Computer Science', 'BCA', 'B.Tech CSE'],
    synonyms: ['Discrete Maths', 'Combinatorics', 'Graph Theory'],
    relatedCanonicals: ['data_structures', 'theory_of_computation'],
  },
  financial_management: {
    displayName: 'Financial Management',
    equivalentCourses: ['BBA', 'B.Com', 'B.Com Accounting & Finance'],
    synonyms: ['Corporate Finance', 'Fin Man', 'Capital Budgeting'],
    relatedCanonicals: ['financial_accounting', 'cost_accounting'],
  },
  marketing_management: {
    displayName: 'Principles of Marketing Management',
    equivalentCourses: ['BBA', 'B.Com'],
    synonyms: ['Marketing Principles', 'Modern Marketing', 'Digital Marketing'],
    relatedCanonicals: ['consumer_behaviour', 'business_economics'],
  },
};

export interface MatchResult {
  listing: Listing;
  matchType: 'exact_subject_other_college' | 'related_subject' | 'same_college_recommended';
  matchScore: number; // 0 - 100
  collegeDifferenceNote?: string;
}

export function findSmartMatches(
  currentListing: Partial<Listing>,
  allListings: Listing[],
  studentProfile?: StudentProfile
): MatchResult[] {
  const currentCanonical = currentListing.canonicalKey || '';
  const currentCollege = currentListing.collegeId || studentProfile?.collegeId || '';
  const currentCourse = currentListing.courseName || '';

  const matched: MatchResult[] = [];

  for (const item of allListings) {
    if (item.id === currentListing.id) continue;
    if (item.status !== 'active') continue;

    let score = 0;
    let matchType: MatchResult['matchType'] = 'related_subject';

    // 1. Exact Canonical Match from a DIFFERENT Chennai college
    if (currentCanonical && item.canonicalKey === currentCanonical && item.collegeId !== currentCollege) {
      matchType = 'exact_subject_other_college';
      score = 90 + (item.averageRating || 4.5) * 2; // high priority
      matched.push({
        listing: item,
        matchType,
        matchScore: Math.min(100, score),
        collegeDifferenceNote: `Popular resource used by students at ${item.sellerCollegeId}`,
      });
      continue;
    }

    // 2. Related canonical subject
    const relatedList = SUBJECT_CURRICULUM_EQUIVALENCY[currentCanonical]?.relatedCanonicals || [];
    if (relatedList.includes(item.canonicalKey)) {
      matchType = 'related_subject';
      score = 70 + (item.averageRating || 4.0) * 3;
      matched.push({
        listing: item,
        matchType,
        matchScore: Math.min(95, score),
        collegeDifferenceNote: `Related curriculum module (${item.subjectName})`,
      });
      continue;
    }

    // 3. Same course from same or other college
    if (currentCourse && item.courseName.toLowerCase().includes(currentCourse.toLowerCase())) {
      matchType = 'same_college_recommended';
      score = 50 + (item.averageRating || 4.0) * 4;
      matched.push({
        listing: item,
        matchType,
        matchScore: Math.min(90, score),
      });
    }
  }

  // Sort descending by matchScore then ratings
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}
