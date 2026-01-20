import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Monitor, Apple, ShoppingCart, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GameServer } from "@/data/gameServersData";
import { gameServerProducts } from "@/data/products";

interface GameCardProps {
  game: GameServer;
  index: number;
}

/**
 * Get the default (popular or first) plan for a game product
 */
function getDefaultPlanForGame(gameSlug: string): { planId: string; productSlug: string } | null {
  const product = gameServerProducts.find((p) => p.gameSlug === gameSlug || p.slug === gameSlug);
  if (!product || product.plans.length === 0) {
    return null;
  }
  
  // Find popular plan, otherwise use first plan
  const popularPlan = product.plans.find((p) => p.popular);
  const defaultPlan = popularPlan || product.plans[0];
  
  return {
    planId: defaultPlan.id,
    productSlug: product.slug,
  };
}

export function GameCard({ game, index }: GameCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get proper plan from products.ts
    const planInfo = getDefaultPlanForGame(game.slug);
    
    if (planInfo) {
      // Navigate to checkout with category=games and proper plan
      navigate(`/checkout?category=games&product=${planInfo.productSlug}&plan=${planInfo.planId}&billing=monthly`);
    } else {
      // Fallback: go to game detail page
      navigate(`/game-servers/${game.slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(25,195,255,0.15)] hover:-translate-y-1">
        {/* Image Container */}
        <Link to={`/game-servers/${game.slug}`}>
          <div className="relative h-40 overflow-hidden">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            {/* Popular Badge */}
            {game.popular && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                {t("common.popular")}
              </div>
            )}
            
            {/* OS Badge */}
            <div className="absolute top-3 right-3 flex gap-1">
              {(game.os === "windows" || game.os === "both") && (
                <div className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm">
                  <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
              {(game.os === "linux" || game.os === "both") && (
                <div className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm">
                  <Apple className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Price Overlay */}
            <div className="absolute bottom-3 left-3">
              <span className="text-xl font-bold text-primary">{game.pricingDisplay}</span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link to={`/game-servers/${game.slug}`}>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {game.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {game.shortDescription}
            </p>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/game-servers/${game.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg btn-outline"
            >
              <Eye className="w-3.5 h-3.5" />
              {t("buttons.viewPlans")}
            </Link>
            <button
              onClick={handleOrderNow}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg btn-glow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t("buttons.orderNow")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
