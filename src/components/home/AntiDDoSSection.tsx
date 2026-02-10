import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Shield, Zap, Activity } from "lucide-react";

export function AntiDDoSSection() {
  const { t } = useTranslation();

  const features = [
    t("sections.antiDdosCapacity"),
    t("sections.antiDdosFiltering"),
    t("sections.antiDdosAlerts"),
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-primary/10 p-8 md:p-12"
          style={{
            background: `
              radial-gradient(900px 420px at 90% 0%, rgba(255,255,255,0.06), transparent 60%),
              linear-gradient(135deg, hsl(210 60% 7%) 0%, hsl(210 50% 14%) 100%)
            `,
            boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Animated Radar */}
            <div className="relative w-full max-w-[380px] aspect-square mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                  <filter id="radarGlow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid circles */}
                {[30, 55, 80].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="0.5" />
                ))}

                {/* Cross lines */}
                <line x1="100" y1="15" x2="100" y2="185" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="0.5" />
                <line x1="15" y1="100" x2="185" y2="100" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="0.5" />
                <line x1="40" y1="40" x2="160" y2="160" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="0.5" />
                <line x1="160" y1="40" x2="40" y2="160" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="0.5" />

                {/* Rotating sweep */}
                <g style={{ transformOrigin: '100px 100px' }}>
                  <path
                    d="M100,100 L100,20 A80,80 0 0,1 169,60 Z"
                    fill="url(#radarSweep)"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 100 100"
                      to="360 100 100"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>

                {/* Sweep line */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.6" filter="url(#radarGlow)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 100 100"
                    to="360 100 100"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </line>

                {/* Dashed orbit ring */}
                <circle cx="100" cy="100" r="65" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.3">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 100 100"
                    to="-360 100 100"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Blips — threat dots */}
                {[
                  { cx: 72, cy: 48, delay: "0s" },
                  { cx: 135, cy: 65, delay: "1.2s" },
                  { cx: 60, cy: 120, delay: "2.5s" },
                  { cx: 140, cy: 130, delay: "0.8s" },
                  { cx: 110, cy: 45, delay: "3s" },
                  { cx: 85, cy: 140, delay: "1.8s" },
                ].map((blip, idx) => (
                  <g key={idx}>
                    <circle cx={blip.cx} cy={blip.cy} r="2" fill="hsl(var(--primary))" filter="url(#radarGlow)">
                      <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin={blip.delay} repeatCount="indefinite" />
                    </circle>
                    <circle cx={blip.cx} cy={blip.cy} r="2" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5">
                      <animate attributeName="r" values="2;6;2" dur="2s" begin={blip.delay} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin={blip.delay} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}

                {/* Center dot */}
                <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" filter="url(#radarGlow)" />
                <circle cx="100" cy="100" r="1.5" fill="white" opacity="0.9" />

                {/* Outer ring */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.15" strokeWidth="0.8" />

                {/* Tick marks on outer ring */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const inner = 83;
                  const outer = 87;
                  return (
                    <line
                      key={i}
                      x1={100 + Math.cos(angle) * inner}
                      y1={100 + Math.sin(angle) * inner}
                      x2={100 + Math.cos(angle) * outer}
                      y2={100 + Math.sin(angle) * outer}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={i % 3 === 0 ? 0.3 : 0.12}
                      strokeWidth={i % 3 === 0 ? 0.8 : 0.4}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("sections.antiDdos")}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("sections.antiDdosDesc")}
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
