import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const games = [
  {
    id: "rust",
    name: "RUST",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    price: 20.00,
    badge: "HOT",
    badgeColor: "bg-red-500",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "https://images.unsplash.com/photo-1587573088697-b4fa24c18962?w=400&h=300&fit=crop",
    price: 3.29,
    badge: "BESTSELLER",
    badgeColor: "bg-green-500",
  },
  {
    id: "fivem",
    name: "FiveM",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f55a4?w=400&h=300&fit=crop",
    price: 19.00,
    badge: "NEW",
    badgeColor: "bg-primary",
  },
  {
    id: "redm",
    name: "Red Dead Redemption 2",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop",
    price: 15.00,
    badge: null,
    badgeColor: null,
  },
];

export function ChooseGameSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="py-20 md:py-32 relative bg-background-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-muted-foreground mb-2 block">GAMES</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your Game
          </h2>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-muted/50 border border-border/50">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
            </button>
            {billingPeriod === "annual" && (
              <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                SAVE UP TO 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Game Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="glass-card overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-glow">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  
                  {/* Badge */}
                  {game.badge && (
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold text-white ${game.badgeColor}`}>
                      {game.badge}
                    </div>
                  )}

                  {/* Game Icon with Pulse */}
                  <motion.div
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-card/80 backdrop-blur flex items-center justify-center"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-lg">🎮</span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{game.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xs text-muted-foreground">Start at</span>
                    <span className="text-xl font-bold text-primary">
                      ${billingPeriod === "annual" ? (game.price * 0.8).toFixed(2) : game.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <Link
                    to={`/game-servers?game=${game.id}`}
                    className="block w-full py-2 text-center text-sm font-medium rounded-lg bg-muted hover:bg-primary/20 text-foreground transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/game-servers"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View all games →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
