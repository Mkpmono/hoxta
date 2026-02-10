import { motion } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  // Primary DCs
  { id: "uk", name: "London", x: 47, y: 26, isPrimary: true },
  { id: "nl", name: "Amsterdam", x: 49.5, y: 24, isPrimary: true },
  { id: "de", name: "Frankfurt", x: 51.5, y: 27, isPrimary: true },
  { id: "ro", name: "Bucharest", x: 57, y: 30, isPrimary: true },
  // Edge nodes — dense global coverage
  { id: "fr", name: "Paris", x: 48, y: 29 },
  { id: "es", name: "Madrid", x: 45, y: 34 },
  { id: "it", name: "Milan", x: 51, y: 31 },
  { id: "pl", name: "Warsaw", x: 54, y: 24 },
  { id: "fi", name: "Helsinki", x: 55, y: 17 },
  { id: "se", name: "Stockholm", x: 52, y: 19 },
  { id: "no", name: "Oslo", x: 50, y: 19 },
  { id: "pt", name: "Lisbon", x: 43, y: 34 },
  { id: "us-east", name: "New York", x: 26, y: 32 },
  { id: "us-west", name: "Los Angeles", x: 14, y: 36 },
  { id: "us-mid", name: "Dallas", x: 20, y: 36 },
  { id: "us-chi", name: "Chicago", x: 22, y: 30 },
  { id: "us-mia", name: "Miami", x: 24, y: 40 },
  { id: "ca", name: "Toronto", x: 24, y: 28 },
  { id: "br", name: "São Paulo", x: 31, y: 64 },
  { id: "cl", name: "Santiago", x: 27, y: 68 },
  { id: "mx", name: "Mexico City", x: 18, y: 42 },
  { id: "sg", name: "Singapore", x: 76, y: 54 },
  { id: "jp", name: "Tokyo", x: 85, y: 30 },
  { id: "kr", name: "Seoul", x: 83, y: 30 },
  { id: "au", name: "Sydney", x: 88, y: 70 },
  { id: "in", name: "Mumbai", x: 69, y: 42 },
  { id: "in2", name: "Chennai", x: 71, y: 48 },
  { id: "za", name: "Cape Town", x: 52, y: 70 },
  { id: "ng", name: "Lagos", x: 49, y: 50 },
  { id: "ke", name: "Nairobi", x: 58, y: 54 },
  { id: "ae", name: "Dubai", x: 63, y: 38 },
  { id: "il", name: "Tel Aviv", x: 58, y: 35 },
  { id: "hk", name: "Hong Kong", x: 80, y: 40 },
  { id: "tw", name: "Taipei", x: 82, y: 38 },
  { id: "nz", name: "Auckland", x: 93, y: 72 },
];

const connections: [string, string][] = [
  // Europe mesh
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "es"],
  ["de", "pl"], ["pl", "fi"], ["nl", "fi"], ["fi", "se"], ["se", "no"],
  ["no", "uk"], ["fr", "it"], ["it", "de"], ["es", "pt"], ["pl", "ro"],
  ["ro", "il"], ["il", "ae"],
  // North America mesh
  ["uk", "us-east"], ["us-east", "us-west"], ["us-east", "us-mid"],
  ["us-east", "us-chi"], ["us-chi", "us-west"], ["us-east", "ca"],
  ["us-mid", "us-mia"], ["us-mia", "mx"], ["us-west", "mx"],
  // South America
  ["us-mia", "br"], ["br", "cl"], ["mx", "br"],
  // Africa
  ["br", "za"], ["es", "ng"], ["ng", "ke"], ["ke", "za"], ["ae", "ke"],
  // Middle East & Asia
  ["ae", "in"], ["in", "in2"], ["in", "sg"], ["sg", "hk"],
  ["hk", "tw"], ["tw", "jp"], ["jp", "kr"], ["hk", "jp"],
  ["sg", "au"], ["au", "nz"],
  // Cross-continental
  ["de", "ae"], ["ro", "ae"], ["us-west", "jp"], ["us-west", "au"],
  ["ae", "za"], ["sg", "in2"],
];

export function NetworkMap() {
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
        viewBox="0 0 100 80"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.35" result="b" />
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

        {/* Connection lines */}
        {connections.map(([fId, tId], i) => {
          const f = getById(fId);
          const t = getById(tId);
          if (!f || !t) return null;

          const dx = t.x - f.x;
          const dy = t.y - f.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const curve = Math.min(dist * 0.2, 5);
          const mx = (f.x + t.x) / 2;
          const my = (f.y + t.y) / 2 - curve;
          const pathD = `M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`;

          return (
            <g key={`${fId}-${tId}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.08"
                strokeOpacity="0.18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.04 }}
              />
              <circle r="0.15" fill="hsl(var(--primary))" opacity="0">
                <animateMotion dur={`${3 + (i % 5)}s`} repeatCount="indefinite" path={pathD} />
                <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Nodes */}
        {serverLocations.map((loc, i) => (
          <g key={loc.id}>
            {loc.isPrimary && (
              <>
                <circle cx={loc.x} cy={loc.y} r="1" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.06">
                  <animate attributeName="r" values="0.6;2;0.6" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                </circle>
                <circle cx={loc.x} cy={loc.y} r="0.4" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.04">
                  <animate attributeName="r" values="0.4;1.4;0.4" dur="3s" repeatCount="indefinite" begin={`${i * 0.5 + 0.6}s`} />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.5 + 0.6}s`} />
                </circle>
              </>
            )}
            {/* Ambient glow */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 1.2 : 0.5}
              fill="url(#nodeGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.03 }}
            />
            {/* Core dot */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 0.4 : 0.18}
              fill="hsl(var(--primary))"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.03 }}
            />
            {/* Bright center */}
            <motion.circle
              cx={loc.x} cy={loc.y}
              r={loc.isPrimary ? 0.16 : 0.07}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.03 }}
            />
          </g>
        ))}
      </svg>

      {/* Only city name labels for primary DCs — no country */}
      <div className="absolute inset-0 pointer-events-none">
        {serverLocations.filter(l => l.isPrimary).map((loc, i) => (
          <motion.div
            key={loc.id}
            className="absolute -translate-x-1/2"
            style={{ left: `${loc.x}%`, top: `${loc.y + 3.2}%` }}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.12 }}
          >
            <span className="text-[7px] md:text-[10px] font-medium text-primary/80 drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)] whitespace-nowrap">
              {loc.name}
            </span>
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
          <span className="text-[9px] md:text-[11px] text-muted-foreground/60">Primary DC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-primary/60" />
          <span className="text-[9px] md:text-[11px] text-muted-foreground/60">Edge Node</span>
        </div>
      </motion.div>
    </div>
  );
}
