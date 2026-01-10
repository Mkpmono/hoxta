import { useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

export function AntiDDoSSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const arcsRef = useRef<SVGGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const features = [
    "400+ Gbps capacitate, always-on",
    "Filtrare inteligentă & rate-limiting L7",
    "Alertare instant & rapoarte",
  ];

  // Generate arcs between threats
  const createArc = useCallback(() => {
    if (!arcsRef.current || prefersReducedMotion) return;
    
    const threatPositions = [
      { x: 55, y: 60 },
      { x: 150, y: 65 },
      { x: 135, y: 150 },
      { x: 60, y: 140 },
    ];
    
    const a = threatPositions[Math.floor(Math.random() * threatPositions.length)];
    const b = threatPositions[Math.floor(Math.random() * threatPositions.length)];
    if (a === b) return;
    
    const center = { x: 100, y: 100 };
    const midx = (a.x + b.x) / 2;
    const midy = (a.y + b.y) / 2;
    const vx = midx - center.x;
    const vy = midy - center.y;
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    const nx = vx / len;
    const ny = vy / len;
    const bend = 22;
    const cx = midx + nx * bend;
    const cy = midy + ny * bend;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`);
    path.setAttribute('class', 'arc');
    path.style.cssText = `
      fill: none;
      stroke: url(#arcGrad);
      stroke-width: 2;
      stroke-linecap: round;
      filter: drop-shadow(0 0 4px rgba(103,232,249,0.35));
      stroke-dasharray: 6 10;
      animation: glide 2.4s linear infinite;
    `;
    
    arcsRef.current.appendChild(path);
    
    setTimeout(() => {
      if (arcsRef.current?.contains(path)) {
        arcsRef.current.removeChild(path);
      }
    }, 2600);
  }, [prefersReducedMotion]);

  // Create sparkles
  const createSparkle = useCallback(() => {
    if (!svgRef.current || prefersReducedMotion) return;
    
    const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = 100 + (Math.random() * 120 - 60);
    const y = 100 + (Math.random() * 120 - 60);
    
    sparkle.setAttribute('cx', String(x));
    sparkle.setAttribute('cy', String(y));
    sparkle.setAttribute('r', String(0.8 + Math.random() * 1.2));
    sparkle.setAttribute('fill', '#67e8f9');
    sparkle.style.opacity = '0.9';
    sparkle.style.transition = 'opacity 0.8s';
    
    svgRef.current.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
      if (svgRef.current?.contains(sparkle)) {
        svgRef.current.removeChild(sparkle);
      }
    }, 900);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const arcInterval = setInterval(createArc, 900);
    const sparkleInterval = setInterval(createSparkle, 1200);
    
    return () => {
      clearInterval(arcInterval);
      clearInterval(sparkleInterval);
    };
  }, [createArc, createSparkle, prefersReducedMotion]);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <style>{`
        @keyframes sweep-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes reticle-rot {
          to { transform: rotate(360deg); }
        }
        @keyframes ringrot {
          to { transform: rotate(-360deg); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -200; }
        }
        @keyframes pulse-threat {
          0% { transform: scale(0.7); opacity: 0.95; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes glide {
          to { stroke-dashoffset: -200; }
        }
        .sweep {
          transform-origin: 50% 50%;
          animation: sweep-rotate 5.5s linear infinite;
        }
        .reticle {
          transform-origin: 50% 50%;
          animation: reticle-rot 24s linear infinite;
        }
        .ring-rot {
          transform-origin: 50% 50%;
          animation: ringrot 30s linear infinite;
        }
        .orbit {
          animation: dash 7s linear infinite;
        }
        .pulse-circle {
          transform-origin: center;
          animation: pulse-threat 2.2s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sweep, .reticle, .ring-rot, .orbit, .pulse-circle {
            animation: none;
          }
        }
      `}</style>
      
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
            {/* Radar */}
            <div className="relative w-full max-w-[380px] aspect-square mx-auto">
              <svg 
                ref={svgRef}
                viewBox="0 0 200 200" 
                className="w-full h-full"
                aria-label="Anti-DDoS live radar"
                role="img"
              >
                <defs>
                  <radialGradient id="dotGrad">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(103,232,249,0.0)" />
                    <stop offset="60%" stopColor="rgba(103,232,249,0.45)" />
                    <stop offset="100%" stopColor="rgba(103,232,249,0.0)" />
                  </linearGradient>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#19e3ff" />
                  </linearGradient>
                </defs>
                
                {/* Major rings */}
                <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.14)" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.14)" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(255,255,255,0.14)" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.14)" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 12" className="ring-rot" />
                
                {/* Minor rings */}
                <g>
                  <circle cx="100" cy="100" r="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 6" />
                  <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 6" />
                  <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 6" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 6" />
                </g>
                
                {/* Axis lines */}
                <g stroke="rgba(255,255,255,0.08)">
                  <line x1="100" y1="5" x2="100" y2="195" />
                  <line x1="5" y1="100" x2="195" y2="100" />
                  <line x1="30" y1="30" x2="170" y2="170" />
                  <line x1="170" y1="30" x2="30" y2="170" />
                </g>
                
                {/* Tick marks */}
                <g stroke="rgba(255,255,255,0.08)">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 100 + Math.cos(angle) * 95;
                    const y1 = 100 + Math.sin(angle) * 95;
                    const x2 = 100 + Math.cos(angle) * 88;
                    const y2 = 100 + Math.sin(angle) * 88;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                  })}
                </g>
                
                {/* Rotating reticle */}
                <g className="reticle" stroke="rgba(255,255,255,0.14)" strokeDasharray="6 10">
                  <line x1="100" y1="100" x2="100" y2="15" />
                  <line x1="100" y1="100" x2="176" y2="100" />
                  <line x1="100" y1="100" x2="135" y2="170" />
                </g>
                
                {/* Elliptical orbits */}
                <g>
                  <ellipse cx="100" cy="100" rx="72" ry="28" transform="rotate(-12 100 100)" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" className="orbit" />
                  <ellipse cx="100" cy="100" rx="52" ry="20" transform="rotate(18 100 100)" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" className="orbit" />
                </g>
                
                {/* Sweep wedge */}
                <path 
                  className="sweep" 
                  d="M100,100 L100,14 A86,86 0 0,1 170,40 Z" 
                  fill="url(#sweepGrad)" 
                  opacity="0.85" 
                />
                
                {/* Threat points */}
                <g style={{ filter: 'drop-shadow(0 0 6px #67e8f9) drop-shadow(0 0 12px #67e8f9)' }}>
                  {[
                    { cx: 55, cy: 60, r: 2.5 },
                    { cx: 150, cy: 65, r: 3 },
                    { cx: 135, cy: 150, r: 2.2 },
                    { cx: 60, cy: 140, r: 2.2 },
                  ].map((threat, i) => (
                    <g key={i}>
                      <circle cx={threat.cx} cy={threat.cy} r={threat.r} fill="#67e8f9" />
                      <circle 
                        cx={threat.cx} 
                        cy={threat.cy} 
                        r={threat.r} 
                        fill="url(#dotGrad)" 
                        className="pulse-circle"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                    </g>
                  ))}
                </g>
                
                {/* Dynamic arcs container */}
                <g ref={arcsRef} />
              </svg>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Anti-<span className="text-gradient">DDoS</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
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
