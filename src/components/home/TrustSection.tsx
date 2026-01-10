import { motion, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink, Shield } from "lucide-react";
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
    verified: true,
  },
  {
    rating: 5,
    title: "Easy to Understand!",
    content: "The control panel is super intuitive. I managed to set up my Minecraft server in less than 10 minutes. Perfect for beginners!",
    author: "Maria P.",
    role: "Community Manager",
    verified: true,
  },
  {
    rating: 5,
    title: "Reliable Services",
    content: "I've been using their VPS for 2 years for my projects. Zero downtime, consistent performance. The best hosting I've ever had.",
    author: "Andrei C.",
    role: "Developer",
    verified: true,
  },
  {
    rating: 5,
    title: "Exceptional Performance",
    content: "Our FiveM server handles 200+ players without any lag. The DDoS protection has saved us multiple times. Worth every cent!",
    author: "Stefan R.",
    role: "FiveM Server Admin",
    verified: true,
  },
  {
    rating: 5,
    title: "Best Value for Money",
    content: "Switched from a bigger provider and couldn't be happier. Better performance, better support, and half the price. Amazing!",
    author: "Elena D.",
    role: "Gaming Community Leader",
    verified: true,
  },
  {
    rating: 5,
    title: "Professional Team",
    content: "The migration was seamless. Their team handled everything professionally. Our community experienced zero downtime during the switch.",
    author: "Mihai T.",
    role: "Esports Team Manager",
    verified: true,
  },
  {
    rating: 5,
    title: "Top-tier DDoS Protection",
    content: "We've been hit with massive attacks and Hoxta absorbed them all. Our players didn't even notice. That's the level of protection you need.",
    author: "David K.",
    role: "Rust Server Owner",
    verified: true,
  },
  {
    rating: 5,
    title: "Incredible Uptime",
    content: "99.99% uptime isn't just marketing speak with Hoxta. We've tracked it ourselves for 18 months. Absolutely reliable infrastructure.",
    author: "Laura S.",
    role: "Web Developer",
    verified: true,
  },
];

// Trustpilot-style rating display
function TrustpilotWidget() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center">
            <Star className="w-4 h-4 fill-white text-white" />
          </div>
        ))}
      </div>
      <div className="text-sm">
        <p className="font-semibold text-foreground">Excellent</p>
        <p className="text-muted-foreground text-xs">Based on <span className="text-foreground font-medium">847 reviews</span></p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Star className="w-5 h-5 text-[#00b67a]" />
        <span className="text-sm font-medium text-foreground">Trustpilot</span>
      </div>
    </div>
  );
}

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

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
              <TrustpilotWidget />
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
                {testimonials.map((_, index) => (
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
              href="https://trustpilot.com"
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
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(50%-10px)]"
                >
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className={`h-full p-6 rounded-2xl bg-card border transition-all duration-300 ${
                      index === selectedIndex
                        ? "border-primary/40 shadow-lg shadow-primary/5"
                        : "border-border/50"
                    }`}
                  >
                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
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
                    <div className="pt-4 border-t border-border/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.author}</p>
                        <p className="text-xs text-primary">{testimonial.role}</p>
                      </div>
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
