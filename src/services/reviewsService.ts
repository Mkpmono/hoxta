/**
 * Reviews Service - Static/Placeholder Implementation
 * 
 * This service provides a clean interface for reviews data.
 * Currently uses static placeholder data, designed to be replaced
 * with server-side integration (WHMCS/PHP) in the future.
 * 
 * Future integration points:
 * - Replace fetchTrustpilotData() with API call to your backend
 * - Backend should proxy Trustpilot Business API and cache results
 * - Recommended cache TTL: 1 hour for summary, 6 hours for reviews
 */

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  role?: string;
  verified: boolean;
  createdAt: string;
  source: 'trustpilot' | 'google' | 'internal';
}

export interface ReviewSummary {
  source: 'trustpilot' | 'google';
  rating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  profileUrl: string;
  lastUpdated: string;
}

export interface ReviewsData {
  summary: ReviewSummary;
  reviews: Review[];
  isPlaceholder: boolean;
}

// Static placeholder data - matches Trustpilot format
const PLACEHOLDER_SUMMARY: ReviewSummary = {
  source: 'trustpilot',
  rating: 4.8,
  totalReviews: 847,
  ratingDistribution: {
    5: 712,
    4: 98,
    3: 25,
    2: 8,
    1: 4,
  },
  profileUrl: 'https://www.trustpilot.com/review/hoxta.com',
  lastUpdated: new Date().toISOString(),
};

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    rating: 5,
    title: '24/7 Amazing Support',
    content: 'The support team is incredible. They solved my problem in record time, even on a weekend at 3 AM. I highly recommend!',
    author: 'Alex M.',
    role: 'Minecraft Server Owner',
    verified: true,
    createdAt: '2024-12-15T10:30:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-002',
    rating: 5,
    title: 'Easy to Understand!',
    content: 'The control panel is super intuitive. I managed to set up my Minecraft server in less than 10 minutes. Perfect for beginners!',
    author: 'Maria P.',
    role: 'Community Manager',
    verified: true,
    createdAt: '2024-12-10T14:20:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-003',
    rating: 5,
    title: 'Reliable Services',
    content: "I've been using their VPS for 2 years for my projects. Zero downtime, consistent performance. The best hosting I've ever had.",
    author: 'Andrei C.',
    role: 'Developer',
    verified: true,
    createdAt: '2024-12-08T09:15:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-004',
    rating: 5,
    title: 'Exceptional Performance',
    content: "Our FiveM server handles 200+ players without any lag. The DDoS protection has saved us multiple times. Worth every cent!",
    author: 'Stefan R.',
    role: 'FiveM Server Admin',
    verified: true,
    createdAt: '2024-12-05T16:45:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-005',
    rating: 5,
    title: 'Best Value for Money',
    content: "Switched from a bigger provider and couldn't be happier. Better performance, better support, and half the price. Amazing!",
    author: 'Elena D.',
    role: 'Gaming Community Leader',
    verified: true,
    createdAt: '2024-12-01T11:00:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-006',
    rating: 5,
    title: 'Professional Team',
    content: 'The migration was seamless. Their team handled everything professionally. Our community experienced zero downtime during the switch.',
    author: 'Mihai T.',
    role: 'Esports Team Manager',
    verified: true,
    createdAt: '2024-11-28T08:30:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-007',
    rating: 5,
    title: 'Top-tier DDoS Protection',
    content: "We've been hit with massive attacks and Hoxta absorbed them all. Our players didn't even notice. That's the level of protection you need.",
    author: 'David K.',
    role: 'Rust Server Owner',
    verified: true,
    createdAt: '2024-11-25T19:20:00Z',
    source: 'trustpilot',
  },
  {
    id: 'rev-008',
    rating: 5,
    title: 'Incredible Uptime',
    content: "99.99% uptime isn't just marketing speak with Hoxta. We've tracked it ourselves for 18 months. Absolutely reliable infrastructure.",
    author: 'Laura S.',
    role: 'Web Developer',
    verified: true,
    createdAt: '2024-11-20T13:10:00Z',
    source: 'trustpilot',
  },
];

/**
 * Fetch reviews data
 * 
 * Currently returns static placeholder data.
 * Replace this function body with your backend API call:
 * 
 * @example
 * // Future implementation
 * const response = await fetch('/api/reviews/trustpilot');
 * if (!response.ok) throw new Error('Failed to fetch reviews');
 * return response.json();
 */
export async function fetchReviewsData(): Promise<ReviewsData> {
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    summary: PLACEHOLDER_SUMMARY,
    reviews: PLACEHOLDER_REVIEWS,
    isPlaceholder: true,
  };
}

/**
 * Get rating label based on score (Trustpilot style)
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Great';
  if (rating >= 3.5) return 'Good';
  if (rating >= 2.5) return 'Average';
  return 'Poor';
}

/**
 * Format review count for display
 */
export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
