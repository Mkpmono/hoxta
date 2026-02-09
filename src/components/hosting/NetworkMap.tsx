import { motion } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  name: string;
  country: string;
  x: number; // % from left
  y: number; // % from top
  isPrimary?: boolean;
}

// Coordinates as percentages matching a standard equirectangular world map
// The background image covers roughly: longitude -170 to 180, latitude 80N to 60S
const serverLocations: ServerLocation[] = [
  // Primary DCs — spread out in Europe
  { id: "uk", name: "London", country: "UK", x: 47, y: 26, isPrimary: true },
  { id: "nl", name: "Amsterdam", country: "Netherlands", x: 49.5, y: 24, isPrimary: true },
  { id: "de", name: "Frankfurt", country: "Germany", x: 51.5, y: 27, isPrimary: true },
  { id: "ro", name: "Bucharest", country: "Romania", x: 57, y: 30, isPrimary: true },
  // Edge nodes — global
  { id: "fr", name: "Paris", country: "France", x: 48, y: 29 },
  { id: "es", name: "Madrid", country: "Spain", x: 45, y: 34 },
  { id: "pl", name: "Warsaw", country: "Poland", x: 54, y: 24 },
  { id: "fi", name: "Helsinki", country: "Finland", x: 55, y: 17 },
  { id: "us-east", name: "New York", country: "USA", x: 26, y: 32 },
  { id: "us-west", name: "Los Angeles", country: "USA", x: 14, y: 36 },
  { id: "us-mid", name: "Dallas", country: "USA", x: 20, y: 36 },
  { id: "br", name: "São Paulo", country: "Brazil", x: 31, y: 64 },
  { id: "sg", name: "Singapore", country: "Singapore", x: 76, y: 54 },
  { id: "jp", name: "Tokyo", country: "Japan", x: 85, y: 30 },
  { id: "au", name: "Sydney", country: "Australia", x: 88, y: 70 },
  { id: "in", name: "Mumbai", country: "India", x: 69, y: 42 },
  { id: "za", name: "Cape Town", country: "S. Africa", x: 52, y: 70 },
  { id: "ae", name: "Dubai", country: "UAE", x: 63, y: 38 },
];

const connections: [string, string][] = [
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "es"],
  ["de", "pl"], ["pl", "fi"], ["nl", "fi"],
  ["uk", "us-east"], ["us-east", "us-west"], ["us-east", "us-mid"],
  ["us-east", "br"],
  ["ro", "ae"], ["ae", "in"], ["in", "sg"], ["sg", "jp"], ["sg", "au"],
  ["de", "ae"], ["br", "za"], ["ae", "za"],
];

export function NetworkMap() {
  const getById = (id: string) => serverLocations.find(l => l.id === id);

  return (
    <div className="relative w-full aspect-[2/1] min-h-[300px] md:min-h-[420px] overflow-hidden rounded-xl bg-[#080c14]">
      {/* Background map */}
      <img
        src={networkMapBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        loading="lazy"
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      {/* Animated SVG overlay */}
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map(([fId, tId], i) => {
          const f = getById(fId);
          const t = getById(tId);
          if (!f || !t) return null;

          const dx = t.x - f.x;
          const dy = t.y - f.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const curve = Math.min(dist * 0.25, 6);
          const mx = (f.x + t.x) / 2;
          const my = (f.y + t.y) / 2 - curve;

          const pathD = `M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`;

          return (
            <g key={`${fId}-${tId}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.1"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: i * 0.06 }}
              />
              {/* Pulse traveling along line */}
              <circle r="0.2" fill="hsl(var(--primary))" opacity="0">
                <animateMotion dur={`${4 + (i % 4)}s`} repeatCount="indefinite" path={pathD} />
                <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${4 + (i % 4)}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Server nodes */}
        {serverLocations.map((loc, i) => (
          <g key={loc.id}>
            {/* Pulse rings for primary */}
            {loc.isPrimary && (
              <>
                <circle cx={loc.x} cy={loc.y} r="1" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.08">
                  <animate attributeName="r" values="0.8;2.5;0.8" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                </circle>
                <circle cx={loc.x} cy={loc.y} r="0.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.06">
                  <animate attributeName="r" values="0.5;1.8;0.5" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.4 + 0.5}s`} />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.4 + 0.5}s`} />
                </circle>
              </>
            )}
            {/* Glow */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 0.9 : 0.45}
              fill="hsl(var(--primary))"
              fillOpacity={loc.isPrimary ? 0.12 : 0.08}
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.04 }}
            />
            {/* Core */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 0.55 : 0.28}
              fill="hsl(var(--primary))"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
            />
            {/* White center */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 0.22 : 0.12}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
            />
          </g>
        ))}
      </svg>

      {/* Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {serverLocations.filter(l => l.isPrimary).map((loc, i) => (
          <motion.div
            key={loc.id}
            className="absolute -translate-x-1/2"
            style={{ left: `${loc.x}%`, top: `${loc.y + 3.5}%` }}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.12 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[8px] md:text-[11px] font-semibold text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.5)] whitespace-nowrap">
                {loc.name}
              </span>
              <span className="text-[6px] md:text-[9px] text-muted-foreground/70 whitespace-nowrap">
                {loc.country}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-2.5 left-3 md:bottom-4 md:left-5 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
          <span className="text-[9px] md:text-[11px] text-muted-foreground/70">Primary DC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span className="text-[9px] md:text-[11px] text-muted-foreground/70">Edge Node</span>
        </div>
      </motion.div>
    </div>
  );
}
