import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function AntiDDoSSection() {
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random blips
    const generateBlips = () => {
      const newBlips = Array.from({ length: 5 }, (_, i) => ({
        id: Math.random(),
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        delay: Math.random() * 2,
      }));
      setBlips(newBlips);
    };

    generateBlips();
    const interval = setInterval(generateBlips, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    "400+ Gbps capacitate, always-on",
    "Filtrare inteligentă & rate-limiting L7",
    "Alertare instant & rapoarte",
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Radar */}
            <div ref={canvasRef} className="relative aspect-square max-w-md mx-auto">
              {/* Radar Background */}
              <div className="absolute inset-0 rounded-full border border-primary/20" />
              <div className="absolute inset-[15%] rounded-full border border-primary/15" />
              <div className="absolute inset-[30%] rounded-full border border-primary/10" />
              <div className="absolute inset-[45%] rounded-full border border-primary/5" />

              {/* Grid Lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-primary/10" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-px w-full bg-primary/10" />
              </div>

              {/* Sweep Line */}
              <motion.div
                className="absolute inset-0 origin-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute top-1/2 left-1/2 w-1/2 h-1"
                  style={{
                    background: "linear-gradient(90deg, hsl(195 100% 55% / 0.8) 0%, transparent 100%)",
                    transformOrigin: "left center",
                  }}
                />
                {/* Sweep Cone */}
                <div
                  className="absolute top-1/2 left-1/2 w-1/2 h-16"
                  style={{
                    background: "linear-gradient(90deg, hsl(195 100% 55% / 0.15) 0%, transparent 80%)",
                    transformOrigin: "left center",
                    transform: "translateY(-50%)",
                    clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                  }}
                />
              </motion.div>

              {/* Blips */}
              {blips.map((blip) => (
                <motion.div
                  key={blip.id}
                  className="absolute w-3 h-3 rounded-full bg-primary"
                  style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: blip.delay,
                    times: [0, 0.1, 0.8, 1],
                  }}
                />
              ))}

              {/* Center Dot */}
              <div className="absolute inset-[48%] rounded-full bg-primary shadow-glow" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Anti-<span className="text-primary">DDoS</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Protecție multi-layer L3/L4/L7 cu scrubbing automat și monitorizare în timp real. 
                Mitigăm volumetric, protocol și application-layer fără downtime.
              </p>

              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-1 rounded-full bg-primary/20">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
