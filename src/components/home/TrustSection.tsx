import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReviews } from "@/hooks/useReviews";
import { TrustpilotWidget } from "./TrustpilotWidget";
import { ReviewCard } from "./ReviewCard";

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch reviews from service (static placeholder for now)
  const { summary, reviews, isLoading, isPlaceholder } = useReviews();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || !emblaApi) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [emblaApi, isPaused, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:pr-8 lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Quote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted by Gamers <span className="text-primary">Worldwide</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands of players who trust Hoxta for their gaming communities. 
              With 99.9% uptime and 24/7 support, we keep your game running smoothly.
            </p>

            {/* Trustpilot Widget */}
            <div className="mb-8">
              <TrustpilotWidget 
                summary={summary} 
                isLoading={isLoading} 
                isPlaceholder={isPlaceholder} 
              />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={scrollPrev}
                className="p-3 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="p-3 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 ml-4">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === selectedIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <a
              href={summary?.profileUrl || "https://trustpilot.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 hover:border-primary/50 text-sm font-medium text-foreground hover:text-primary transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              View All Reviews
            </a>
          </motion.div>

          {/* Testimonials Carousel */}
          <div
            className="overflow-hidden"
            ref={emblaRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            role="region"
            aria-label="Testimonials carousel"
          >
            <div className="flex gap-5">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(50%-10px)]"
                >
                  <ReviewCard 
                    review={review} 
                    index={index} 
                    isSelected={index === selectedIndex} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
