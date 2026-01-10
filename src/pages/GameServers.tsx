import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const games = [
  { id: "minecraft", name: "Minecraft", price: 3.29, image: "🎮", description: "Java & Bedrock server hosting" },
  { id: "rust", name: "Rust", price: 20.00, image: "🎯", description: "Survival game servers" },
  { id: "fivem", name: "FiveM", price: 19.00, image: "🚗", description: "GTA V roleplay servers" },
  { id: "redm", name: "RedM", price: 15.00, image: "🤠", description: "Red Dead Redemption 2 servers" },
  { id: "cs2", name: "Counter-Strike 2", price: 8.00, image: "🔫", description: "Competitive CS2 servers" },
  { id: "valheim", name: "Valheim", price: 10.00, image: "⚔️", description: "Viking survival servers" },
  { id: "ark", name: "ARK: Survival", price: 15.00, image: "🦖", description: "Dinosaur survival servers" },
  { id: "terraria", name: "Terraria", price: 5.00, image: "🌍", description: "2D sandbox adventure" },
];

export default function GameServers() {
  const [searchParams] = useSearchParams();
  const selectedGame = searchParams.get("game");

  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">Game Servers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {selectedGame ? games.find(g => g.id === selectedGame)?.name : "Game Server"} <span className="text-gradient">Hosting</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              High-performance game servers with instant setup, DDoS protection, and 24/7 support.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`glass-card-hover p-6 ${selectedGame === game.id ? "border-primary/50 shadow-glow" : ""}`}
              >
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {game.image}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{game.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-2xl font-bold text-primary">${game.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <Link
                  to={`/contact?game=${game.id}`}
                  className="block w-full py-2 text-center text-sm font-medium rounded-lg bg-muted hover:bg-primary/20 text-foreground transition-colors"
                >
                  Configure Server
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
