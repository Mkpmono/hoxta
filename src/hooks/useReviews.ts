import { useState, useEffect, useCallback } from 'react';
import { 
  fetchReviewsData, 
  type ReviewsData, 
  type Review, 
  type ReviewSummary 
} from '@/services/reviewsService';

interface UseReviewsOptions {
  /** Auto-refresh interval in milliseconds (0 = disabled) */
  refreshInterval?: number;
}

interface UseReviewsReturn {
  /** Review summary (rating, count, distribution) */
  summary: ReviewSummary | null;
  /** Array of individual reviews */
  reviews: Review[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether data is from placeholder/fallback */
  isPlaceholder: boolean;
  /** Manually refresh data */
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage reviews data
 * 
 * Provides loading states, error handling, and fallback UI support.
 * Designed for easy integration with future server-side API.
 * 
 * @example
 * const { summary, reviews, isLoading, error, isPlaceholder } = useReviews();
 * 
 * if (isLoading) return <Skeleton />;
 * if (error) return <FallbackUI />;
 */
export function useReviews(options: UseReviewsOptions = {}): UseReviewsReturn {
  const { refreshInterval = 0 } = options;
  
  const [data, setData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchReviewsData();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reviews';
      setError(message);
      console.error('[useReviews] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optional auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    summary: data?.summary ?? null,
    reviews: data?.reviews ?? [],
    isLoading,
    error,
    isPlaceholder: data?.isPlaceholder ?? true,
    refresh: fetchData,
  };
}
