import { motion } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  // Primary DCs
  { id: "uk", x: 47, y: 28, isPrimary: true },
  { id: "nl", x: 49.5, y: 26, isPrimary: true },
  { id: "de", x: 51.5, y: 29, isPrimary: true },
  { id: "ro", x: 57, y: 32, isPrimary: true },
  // Edge nodes — all clamped within 5-95 x, 5-75 y
  { id: "fr", x: 48, y: 31 },
  { id: "es", x: 45, y: 36 },
  { id: "it", x: 51, y: 33 },
  { id: "pl", x: 54, y: 26 },
  { id: "fi", x: 55, y: 19 },
  { id: "se", x: 52, y: 21 },
  { id: "no", x: 50, y: 21 },
  { id: "pt", x: 43, y: 36 },
  { id: "us-east", x: 26, y: 34 },
  { id: "us-west", x: 15, y: 38 },
  { id: "us-mid", x: 20, y: 38 },
  { id: "us-chi", x: 22, y: 32 },
  { id: "us-mia", x: 24, y: 42 },
  { id: "ca", x: 24, y: 30 },
  { id: "br", x: 31, y: 62 },
  { id: "cl", x: 27, y: 66 },
  { id: "mx", x: 18, y: 44 },
  { id: "sg", x: 76, y: 54 },
  { id: "jp", x: 84, y: 32 },
  { id: "kr", x: 82, y: 32 },
  { id: "au", x: 87, y: 68 },
  { id: "in", x: 69, y: 44 },
  { id: "in2", x: 71, y: 50 },
  { id: "za", x: 52, y: 68 },
  { id: "ng", x: 49, y: 50 },
  { id: "ke", x: 58, y: 54 },
  { id: "ae", x: 63, y: 40 },
  { id: "il", x: 58, y: 37 },
  { id: "hk", x: 80, y: 42 },
  { id: "tw", x: 82, y: 40 },
  { id: "nz", x: 90, y: 70 },
];

const connections: [string, string][] = [
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "es"],
  ["de", "pl"], ["pl", "fi"], ["nl", "fi"], ["fi", "se"], ["se", "no"],
  ["no", "uk"], ["fr", "it"], ["it", "de"], ["es", "pt"], ["pl", "ro"],
  ["ro", "il"], ["il", "ae"],
  ["uk", "us-east"], ["us-east", "us-west"], ["us-east", "us-mid"],
  ["us-east", "us-chi"], ["us-chi", "us-west"], ["us-east", "ca"],
  ["us-mid", "us-mia"], ["us-mia", "mx"], ["us-west", "mx"],
  ["us-mia", "br"], ["br", "cl"], ["mx", "br"],
  ["br", "za"], ["es", "ng"], ["ng", "ke"], ["ke", "za"], ["ae", "ke"],
  ["ae", "in"], ["in", "in2"], ["in", "sg"], ["sg", "hk"],
  ["hk", "tw"], ["tw", "jp"], ["jp", "kr"], ["hk", "jp"],
  ["sg", "au"], ["au", "nz"],
  ["de", "ae"], ["ro", "ae"], ["us-west", "jp"],
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
          <clipPath id="mapClip">
            <rect x="0" y="0" width="100" height="80" />
          </clipPath>
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

        <g clipPath="url(#mapClip)">
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
              <motion.circle
                cx={loc.x} cy={loc.y}
                r={loc.isPrimary ? 1.2 : 0.5}
                fill="url(#nodeGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.03 }}
              />
              <motion.circle
                cx={loc.x} cy={loc.y}
                r={loc.isPrimary ? 0.4 : 0.18}
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.03 }}
              />
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
        </g>
      </svg>
    </div>
  );
}
