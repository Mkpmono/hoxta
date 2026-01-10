import { motion, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    rating: 5,
    title: "24/7 Amazing Support",
    content: "The support team is incredible. They solved my problem in record time, even on a weekend at 3 AM. I highly recommend!",
    author: "Alex M.",
    role: "Minecraft Server Owner",
  },
  {
    rating: 5,
    title: "Easy to Understand!",
    content: "The control panel is super intuitive. I managed to set up my Minecraft server in less than 10 minutes. Perfect for beginners!",
    author: "Maria P.",
    role: "Community Manager",
  },
  {
    rating: 5,
    title: "Reliable Services",
    content: "I've been using their VPS for 2 years for my projects. Zero downtime, consistent performance. The best hosting I've ever had.",
    author: "Andrei C.",
    role: "Developer",
  },
  {
    rating: 5,
    title: "Exceptional Performance",
    content: "Our FiveM server handles 200+ players without any lag. The DDoS protection has saved us multiple times. Worth every cent!",
    author: "Stefan R.",
    role: "FiveM Server Admin",
  },
  {
    rating: 5,
    title: "Best Value for Money",
    content: "Switched from a bigger provider and couldn't be happier. Better performance, better support, and half the price. Amazing!",
    author: "Elena D.",
    role: "Gaming Community Leader",
  },
  {
    rating: 5,
    title: "Professional Team",
    content: "The migration was seamless. Their team handled everything professionally. Our community experienced zero downtime during the switch.",
    author: "Mihai T.",
    role: "Esports Team Manager",
  },
];

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 1 },
      "(min-width: 1024px)": { slidesToScroll: 1 },
    },
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

  // Auto-advance with pause on hover/interaction
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

  // Keyboard navigation
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
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:pr-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Quote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted by Gamers <span className="text-primary">Worldwide</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Experience why thousands of players choose our hosting for their gaming communities. 
              With 99.9% uptime and 24/7 support, we keep your game running smoothly.
            </p>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2 ml-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === selectedIndex
                        ? "w-6 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl border border-border/50 hover:border-primary/50 text-sm font-medium text-foreground hover:text-primary transition-all duration-200"
            >
              <Star className="w-4 h-4" />
              Leave a Review
            </Link>
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
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(50%-10px)]"
                >
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`h-full p-6 rounded-2xl bg-card border transition-all duration-300 ${
                      index === selectedIndex
                        ? "border-primary/40 shadow-lg shadow-primary/5"
                        : "border-border/50"
                    }`}
                  >
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-semibold text-lg text-foreground mb-3">
                      {testimonial.title}
                    </h4>
                    
                    {/* Content */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="pt-4 border-t border-border/50">
                      <p className="font-medium text-foreground">{testimonial.author}</p>
                      <p className="text-xs text-primary">{testimonial.role}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
