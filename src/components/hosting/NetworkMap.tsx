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
  // Europe edge
  { id: "fr", x: 48.5, y: 31 },
  { id: "es", x: 46, y: 34 },
  { id: "it", x: 51, y: 33 },
  { id: "pl", x: 54, y: 26 },
  { id: "fi", x: 55, y: 20 },
  { id: "se", x: 52.5, y: 22 },
  { id: "no", x: 50.5, y: 21 },
  { id: "pt", x: 44, y: 34 },
  // North America — shifted inland
  { id: "us-east", x: 25, y: 32 },
  { id: "us-west", x: 14, y: 35 },
  { id: "us-mid", x: 19, y: 35 },
  { id: "us-chi", x: 21, y: 31 },
  { id: "us-mia", x: 23, y: 39 },
  { id: "ca", x: 22, y: 28 },
  // Central & South America — on land
  { id: "mx", x: 17, y: 42 },
  { id: "br", x: 34, y: 54 },
  { id: "cl", x: 30, y: 57 },
  // Middle East & Asia
  { id: "ae", x: 63, y: 37 },
  { id: "il", x: 58, y: 34 },
  { id: "in", x: 69, y: 41 },
  { id: "in2", x: 71, y: 46 },
  { id: "sg", x: 75, y: 49 },
  { id: "hk", x: 79, y: 39 },
  { id: "tw", x: 81, y: 37 },
  { id: "jp", x: 84, y: 30 },
  { id: "kr", x: 82, y: 30 },
  // Oceania — on land
  { id: "au", x: 86, y: 57 },
  { id: "nz", x: 92, y: 59 },
  // Africa — on continent
  { id: "ng", x: 50, y: 47 },
  { id: "ke", x: 58, y: 50 },
  { id: "za", x: 55, y: 59 },
];

const connections: [string, string][] = [
  // Europe mesh
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "es"],
  ["de", "pl"], ["pl", "fi"], ["nl", "fi"], ["fi", "se"], ["se", "no"],
  ["no", "uk"], ["fr", "it"], ["it", "de"], ["es", "pt"], ["pl", "ro"],
  ["ro", "il"], ["il", "ae"],
  // Transatlantic
  ["uk", "us-east"], ["pt", "us-east"],
  // North America mesh
  ["us-east", "us-west"], ["us-east", "us-mid"], ["us-east", "us-chi"],
  ["us-chi", "us-west"], ["us-east", "ca"], ["ca", "us-chi"],
  ["us-mid", "us-mia"], ["us-mia", "mx"], ["us-west", "mx"],
  // South America
  ["us-mia", "br"], ["mx", "br"], ["br", "cl"],
  // Africa
  ["es", "ng"], ["ng", "ke"], ["ke", "za"], ["br", "za"], ["br", "ng"],
  ["ae", "ke"], ["za", "cl"],
  // Middle East & Asia
  ["ae", "in"], ["in", "in2"], ["in", "sg"], ["in2", "sg"],
  ["sg", "hk"], ["hk", "tw"], ["tw", "jp"], ["jp", "kr"], ["hk", "jp"],
  ["de", "ae"], ["ro", "ae"],
  // Oceania
  ["sg", "au"], ["au", "nz"], ["nz", "au"],
  // Cross-continental long hauls
  ["us-west", "jp"], ["us-west", "hk"],
  ["ae", "za"], ["ke", "in"],
  ["au", "nz"], ["sg", "kr"],
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
