import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, ChevronLeft, ChevronRight, Flame, Star, Sparkles, ShoppingCart } from "lucide-react";
import { gameCoverImages } from "@/assets/games";

interface Game {
  id: string;
  name: string;
  image: string;
  price: number;
  badge: string | null;
  badgeIcon: React.ReactNode;
  badgeColor: string;
  planId: string; // First plan ID for direct checkout
}

const games: Game[] = [
  {
    id: "minecraft",
    name: "Minecraft",
    image: gameCoverImages.minecraft,
    price: 3.00,
    badge: "BESTSELLER",
    badgeIcon: <Star className="w-3 h-3" />,
    badgeColor: "from-amber-500 to-orange-500",
    planId: "mc-starter",
  },
  {
    id: "fivem",
    name: "FiveM",
    image: gameCoverImages.fivem,
    price: 19.00,
    badge: "POPULAR",
    badgeIcon: <Flame className="w-3 h-3" />,
    badgeColor: "from-red-500 to-pink-500",
    planId: "fivem-starter",
  },
  {
    id: "rust",
    name: "Rust",
    image: gameCoverImages.rust,
    price: 20.00,
    badge: "HOT",
    badgeIcon: <Flame className="w-3 h-3" />,
    badgeColor: "from-orange-500 to-red-500",
    planId: "rust-starter",
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    image: gameCoverImages.cs2,
    price: 8.00,
    badge: null,
    badgeIcon: null,
    badgeColor: "",
    planId: "cs2-starter",
  },
  {
    id: "palworld",
    name: "Palworld",
    image: gameCoverImages.palworld,
    price: 12.00,
    badge: "NEW",
    badgeIcon: <Sparkles className="w-3 h-3" />,
    badgeColor: "from-primary to-cyan-400",
    planId: "palworld-starter",
  },
  {
    id: "ark",
    name: "ARK: Survival",
    image: gameCoverImages.ark,
    price: 18.00,
    badge: null,
    badgeIcon: null,
    badgeColor: "",
    planId: "ark-starter",
  },
  {
    id: "valheim",
    name: "Valheim",
    image: gameCoverImages.valheim,
    price: 6.00,
    badge: null,
    badgeIcon: null,
    badgeColor: "",
    planId: "valheim-starter",
  },
  {
    id: "dayz",
    name: "DayZ",
    image: gameCoverImages.dayz,
    price: 25.00,
    badge: null,
    badgeIcon: null,
    badgeColor: "",
    planId: "dayz-starter",
  },
];

export function ChooseGameSection() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleOrderNow = (game: Game, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const billing = billingPeriod === "annual" ? "annually" : "monthly";
    navigate(`/checkout?product=${game.id}&plan=${game.planId}&billing=${billing}`);
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/30 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Game Servers</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Choose Your Game
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Launch your server in minutes with our optimized game hosting solutions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
              </button>
            </div>
            {billingPeriod === "annual" && (
              <span className="px-3 py-1.5 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                SAVE 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Game Cards Carousel */}
        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/90 backdrop-blur border border-border/50 flex items-center justify-center transition-all duration-200 -translate-x-1/2 ${
              canScrollLeft
                ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-primary hover:border-primary hover:text-primary-foreground shadow-xl"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/90 backdrop-blur border border-border/50 flex items-center justify-center transition-all duration-200 translate-x-1/2 ${
              canScrollRight
                ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-primary hover:border-primary hover:text-primary-foreground shadow-xl"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <div className="group block relative rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                  {/* Image */}
                  <Link to={`/game-servers/${game.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      
                      {/* Badge */}
                      {game.badge && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${game.badgeColor} flex items-center gap-1 shadow-lg`}>
                          {game.badgeIcon}
                          {game.badge}
                        </div>
                      )}

                      {/* Hover overlay glow */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <Link to={`/game-servers/${game.id}`}>
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {game.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-xs text-muted-foreground">from</span>
                      <span className="text-2xl font-bold text-primary">
                        ${billingPeriod === "annual" ? (game.price * 0.8).toFixed(2) : game.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/game-servers/${game.id}`}
                        className="flex-1 py-2.5 text-center rounded-lg text-sm font-medium btn-outline"
                      >
                        View Plans
                      </Link>
                      <button
                        onClick={(e) => handleOrderNow(game, e)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium btn-glow"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/game-servers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/80 border border-border/50 text-foreground font-medium hover:border-primary/50 hover:text-primary transition-all duration-200"
          >
            <Gamepad2 className="w-4 h-4" />
            Browse All Games
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
