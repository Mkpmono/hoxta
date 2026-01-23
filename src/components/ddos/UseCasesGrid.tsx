import { motion } from "framer-motion";
import { Gamepad2, Globe, Code2, Phone, Building2, ShoppingCart } from "lucide-react";

const useCases = [
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "Game Servers",
    pain: "Players experience lag and disconnects during attacks",
    solution: "Sub-10ms mitigation keeps gameplay smooth",
    outcome: "Zero downtime, happy players",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Web Applications",
    pain: "Sites become unavailable during HTTP floods",
    solution: "L7 protection filters malicious requests",
    outcome: "Consistent uptime and performance",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "APIs",
    pain: "Rate-limited by attackers, not by design",
    solution: "Intelligent rate limiting and bot detection",
    outcome: "APIs remain responsive for real users",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "VoIP Services",
    pain: "Call quality degrades under SIP floods",
    solution: "Protocol-aware mitigation for VoIP traffic",
    outcome: "Crystal-clear calls, no interruptions",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Corporate VPN",
    pain: "Remote workers can't connect during attacks",
    solution: "Always-on protection for VPN endpoints",
    outcome: "Secure, reliable remote access",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "E-commerce",
    pain: "Revenue lost during checkout attacks",
    solution: "Bot mitigation protects transactions",
    outcome: "Secure shopping, maximized revenue",
  },
];

export function UseCasesGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Protection for Every Use Case
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From game servers to enterprise infrastructure, we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 group hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {useCase.icon}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4">{useCase.title}</h3>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-destructive uppercase tracking-wide">Pain</span>
                  <p className="text-sm text-muted-foreground mt-1">{useCase.pain}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Solution</span>
                  <p className="text-sm text-muted-foreground mt-1">{useCase.solution}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-green-500 uppercase tracking-wide">Outcome</span>
                  <p className="text-sm text-foreground mt-1 font-medium">{useCase.outcome}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
