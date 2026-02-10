import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  { id: "uk", name: "London", x: 47, y: 13, isPrimary: true },
  { id: "nl", name: "Amsterdam", x: 49, y: 12, isPrimary: true },
  { id: "de", name: "Frankfurt", x: 51, y: 13.5, isPrimary: true },
  { id: "ro", name: "Bucharest", x: 56, y: 16, isPrimary: true },
  { id: "fr", name: "Paris", x: 48.5, y: 15 },
  { id: "es", name: "Madrid", x: 46, y: 18 },
  { id: "it", name: "Milan", x: 51, y: 17 },
  { id: "pl", name: "Warsaw", x: 54, y: 12 },
  { id: "fi", name: "Helsinki", x: 55, y: 6 },
  { id: "se", name: "Stockholm", x: 52, y: 7.5 },
  { id: "no", name: "Oslo", x: 50, y: 7 },
  { id: "pt", name: "Lisbon", x: 44, y: 18 },
  { id: "us-east", name: "New York", x: 25, y: 16 },
  { id: "us-west", name: "Los Angeles", x: 14, y: 18 },
  { id: "us-mid", name: "Dallas", x: 19, y: 19 },
  { id: "us-chi", name: "Chicago", x: 21, y: 16 },
  { id: "us-mia", name: "Miami", x: 23, y: 23 },
  { id: "ca", name: "Toronto", x: 22, y: 14 },
  { id: "mx", name: "Mexico City", x: 16, y: 26 },
  { id: "br", name: "São Paulo", x: 34, y: 38 },
  { id: "cl", name: "Santiago", x: 29, y: 41 },
  { id: "ae", name: "Dubai", x: 63, y: 22 },
  { id: "il", name: "Tel Aviv", x: 58, y: 19 },
  { id: "in", name: "Mumbai", x: 69, y: 25 },
  { id: "in2", name: "Chennai", x: 71, y: 30 },
  { id: "sg", name: "Singapore", x: 75, y: 33 },
  { id: "hk", name: "Hong Kong", x: 79, y: 24 },
  { id: "tw", name: "Taipei", x: 81, y: 22 },
  { id: "jp", name: "Tokyo", x: 84, y: 15 },
  { id: "kr", name: "Seoul", x: 82, y: 15 },
  { id: "au", name: "Sydney", x: 87, y: 42 },
  { id: "nz", name: "Auckland", x: 92, y: 44 },
  { id: "ng", name: "Lagos", x: 50, y: 30 },
  { id: "ke", name: "Nairobi", x: 58, y: 33 },
  { id: "za", name: "Cape Town", x: 55, y: 43 },
];

const connections: [string, string][] = [
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "es"],
  ["de", "pl"], ["pl", "fi"], ["nl", "fi"], ["fi", "se"], ["se", "no"],
  ["no", "uk"], ["fr", "it"], ["it", "de"], ["es", "pt"], ["pl", "ro"],
  ["ro", "il"], ["il", "ae"],
  ["uk", "us-east"], ["pt", "us-east"],
  ["us-east", "us-west"], ["us-east", "us-mid"], ["us-east", "us-chi"],
  ["us-chi", "us-west"], ["us-east", "ca"], ["ca", "us-chi"],
  ["us-mid", "us-mia"], ["us-mia", "mx"], ["us-west", "mx"],
  ["us-mia", "br"], ["mx", "br"], ["br", "cl"],
  ["es", "ng"], ["ng", "ke"], ["ke", "za"], ["br", "za"], ["br", "ng"],
  ["ae", "ke"], ["za", "cl"],
  ["ae", "in"], ["in", "in2"], ["in", "sg"], ["in2", "sg"],
  ["sg", "hk"], ["hk", "tw"], ["tw", "jp"], ["jp", "kr"], ["hk", "jp"],
  ["de", "ae"], ["ro", "ae"],
  ["sg", "au"], ["au", "nz"],
  ["us-west", "jp"], ["us-west", "hk"],
  ["ae", "za"], ["ke", "in"], ["sg", "kr"],
];

export function NetworkMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const getById = (id: string) => serverLocations.find(l => l.id === id);

  return (
    <div className="relative w-full aspect-[2/1] min-h-[300px] md:min-h-[420px] overflow-hidden rounded-xl bg-[#080c14]">
      <img
        src={networkMapBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="mapClip">
            <rect x="0" y="0" width="100" height="50" />
          </clipPath>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.25" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g clipPath="url(#mapClip)">
          {connections.map(([fId, tId], i) => {
            const f = getById(fId);
            const t = getById(tId);
            if (!f || !t) return null;
            const dx = t.x - f.x;
            const dy = t.y - f.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const curve = Math.min(dist * 0.15, 3);
            const mx = (f.x + t.x) / 2;
            const my = (f.y + t.y) / 2 - curve;
            const pathD = `M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`;
            return (
              <g key={`${fId}-${tId}`}>
                <motion.path
                  d={pathD} fill="none" stroke="hsl(var(--primary))"
                  strokeWidth="0.06" strokeOpacity="0.2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.04 }}
                />
                <circle r="0.1" fill="hsl(var(--primary))" opacity="0">
                  <animateMotion dur={`${3 + (i % 5)}s`} repeatCount="indefinite" path={pathD} />
                  <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {serverLocations.map((loc, i) => (
            <g key={loc.id}>
              {loc.isPrimary && (
                <>
                  <circle cx={loc.x} cy={loc.y} r="0.8" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.04">
                    <animate attributeName="r" values="0.4;1.5;0.4" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  </circle>
                  <circle cx={loc.x} cy={loc.y} r="0.3" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.03">
                    <animate attributeName="r" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.5 + 0.6}s`} />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.5 + 0.6}s`} />
                  </circle>
                </>
              )}
              <motion.circle
                cx={loc.x} cy={loc.y} r={loc.isPrimary ? 0.8 : 0.35}
                fill="url(#nodeGlow)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.03 }}
              />
              <motion.circle
                cx={loc.x} cy={loc.y} r={loc.isPrimary ? 0.3 : 0.12}
                fill="hsl(var(--primary))" filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.03 }}
              />
              <motion.circle
                cx={loc.x} cy={loc.y} r={loc.isPrimary ? 0.12 : 0.05}
                fill="white"
                initial={{ opacity: 0 }} animate={{ opacity: 0.95 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.03 }}
              />
              {/* Invisible hit area for hover */}
              <circle
                cx={loc.x} cy={loc.y}
                r={loc.isPrimary ? 1.5 : 0.8}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hovered && (() => {
            const loc = getById(hovered);
            if (!loc) return null;
            return (
              <motion.div
                key={loc.id}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${loc.x}%`, top: `${(loc.y / 50) * 100 - 3}%` }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-md px-2.5 py-1 shadow-lg shadow-primary/10">
                  <span className="text-[10px] md:text-xs font-medium text-primary whitespace-nowrap">
                    {loc.name}
                  </span>
                  {loc.isPrimary && (
                    <span className="text-[8px] md:text-[10px] text-muted-foreground ml-1.5">
                      DC
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
