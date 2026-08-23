/**
 * Seller Credibility Engine
 * Calculates a reliable 0-100 credibility score based on multiple trust metrics
 */

export interface CredibilityFactors {
  averageRating: number;       // 1.0 to 5.0
  totalSales: number;          // Completed purchases
  totalReviews: number;        // Total reviews received
  isVerified: boolean;         // Verified student badge
  accountAgeDays?: number;     // Days since registration
  disputeCount?: number;       // Reported disputes / violations
}

export function calculateCredibilityScore(factors: CredibilityFactors): number {
  const {
    averageRating = 5.0,
    totalSales = 0,
    totalReviews = 0,
    isVerified = false,
    disputeCount = 0,
  } = factors;

  // Base score starting point for a brand new student
  let score = 50;

  // 1. Verification Bonus (+15 pts)
  if (isVerified) {
    score += 15;
  }

  // 2. Rating Performance (-20 to +25 pts)
  if (totalReviews > 0) {
    // Rating 5.0 -> +25, 4.0 -> +15, 3.0 -> +0, 2.0 -> -15, 1.0 -> -30
    const ratingContribution = (averageRating - 3.0) * 12.5;
    score += ratingContribution;
  }

  // 3. Sales Volume Track Record (+0 to +15 pts)
  // Diminishing returns: 5 sales -> +5, 15 sales -> +10, 30+ sales -> +15
  const salesContribution = Math.min(15, Math.log10(totalSales + 1) * 10);
  score += salesContribution;

  // 4. Review Engagement (+0 to +10 pts)
  const reviewContribution = Math.min(10, Math.sqrt(totalReviews) * 2.5);
  score += reviewContribution;

  // 5. Dispute / Report Penalty (-25 pts per valid dispute)
  score -= disputeCount * 25;

  // Clamp strictly between 10 and 99 (100 reserved for top 0.1% verified hosts)
  const finalScore = Math.max(15, Math.min(99, Math.round(score)));
  
  return finalScore;
}

export function getCredibilityTier(score: number): {
  tier: 'Elite' | 'Trusted' | 'Established' | 'Rising' | 'Unverified';
  color: string;
  badgeBg: string;
  description: string;
} {
  if (score >= 90) {
    return {
      tier: 'Elite',
      color: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      description: 'Top rated student creator with verified accuracy & high sales',
    };
  }
  if (score >= 80) {
    return {
      tier: 'Trusted',
      color: 'text-blue-500',
      badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      description: 'Consistently verified notes with high buyer satisfaction',
    };
  }
  if (score >= 65) {
    return {
      tier: 'Established',
      color: 'text-indigo-500',
      badgeBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      description: 'Verified student with authentic peer resources',
    };
  }
  if (score >= 45) {
    return {
      tier: 'Rising',
      color: 'text-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      description: 'New creator building academic track record',
    };
  }
  return {
    tier: 'Unverified',
    color: 'text-gray-400',
    badgeBg: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    description: 'Pending college verification',
  };
}
