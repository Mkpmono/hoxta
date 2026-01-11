import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Monitor, Apple, ShoppingCart, Eye } from "lucide-react";
import type { GameServer } from "@/data/gameServersData";

interface GameCardProps {
  game: GameServer;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const navigate = useNavigate();

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate directly to checkout with the game product and default first plan
    const planId = `${game.slug}-starter`;
    navigate(`/checkout?product=${game.slug}&plan=${planId}&billing=monthly`);
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
                Popular
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
              View Plans
            </Link>
            <button
              onClick={handleOrderNow}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg btn-glow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Order Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
