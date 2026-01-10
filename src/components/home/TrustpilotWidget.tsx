import { Star } from 'lucide-react';
import { type ReviewSummary, getRatingLabel, formatReviewCount } from '@/services/reviewsService';
import { Skeleton } from '@/components/ui/skeleton';

interface TrustpilotWidgetProps {
  summary: ReviewSummary | null;
  isLoading?: boolean;
  isPlaceholder?: boolean;
}

/**
 * Trustpilot-style rating widget
 * 
 * Displays aggregate rating with star visualization.
 * Shows loading skeleton during fetch and handles null data gracefully.
 */
export function TrustpilotWidget({ 
  summary, 
  isLoading = false,
  isPlaceholder = false 
}: TrustpilotWidgetProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
        <Skeleton className="h-6 w-32" />
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const ratingLabel = getRatingLabel(summary.rating);
  const reviewCount = formatReviewCount(summary.totalReviews);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(summary.rating);
          return (
            <div 
              key={star} 
              className={`w-6 h-6 flex items-center justify-center ${
                filled ? 'bg-[#00b67a]' : 'bg-[#00b67a]/30'
              }`}
            >
              <Star className={`w-4 h-4 ${filled ? 'fill-white text-white' : 'text-white/50'}`} />
            </div>
          );
        })}
      </div>

      {/* Rating Text */}
      <div className="text-sm">
        <p className="font-semibold text-foreground">{ratingLabel}</p>
        <p className="text-muted-foreground text-xs">
          Based on <span className="text-foreground font-medium">{reviewCount} reviews</span>
          {isPlaceholder && (
            <span className="text-muted-foreground/60 ml-1">(demo)</span>
          )}
        </p>
      </div>

      {/* Trustpilot Branding */}
      <div className="ml-auto flex items-center gap-2">
        <Star className="w-5 h-5 text-[#00b67a]" />
        <span className="text-sm font-medium text-foreground">Trustpilot</span>
      </div>
    </div>
  );
}
