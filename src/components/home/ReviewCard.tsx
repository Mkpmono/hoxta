import { Star, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { type Review } from '@/services/reviewsService';

interface ReviewCardProps {
  review: Review;
  index: number;
  isSelected?: boolean;
}

/**
 * Individual review card component
 * 
 * Displays a single review with rating, content, and author info.
 * Supports animation and selection highlighting.
 */
export function ReviewCard({ review, index, isSelected = false }: ReviewCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`h-full p-6 rounded-2xl bg-card border transition-all duration-300 ${
        isSelected
          ? 'border-primary/40 shadow-lg shadow-primary/5'
          : 'border-border/50'
      }`}
    >
      {/* Rating & Verified Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          {Array.from({ length: 5 - review.rating }).map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
          ))}
        </div>
        {review.verified && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="font-semibold text-lg text-foreground mb-3">
        {review.title}
      </h4>

      {/* Content */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        "{review.content}"
      </p>

      {/* Author */}
      <div className="pt-4 border-t border-border/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
          {review.author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-foreground">{review.author}</p>
          {review.role && (
            <p className="text-xs text-primary">{review.role}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
