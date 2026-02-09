import { motion } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  name: string;
  country: string;
  left: number;
  top: number;
  isPrimary?: boolean;
}

// Positions as % of container — calibrated to the background map image
const serverLocations: ServerLocation[] = [
  // Primary DCs in Europe
  { id: "uk", name: "London", country: "UK", left: 46.5, top: 25, isPrimary: true },
  { id: "nl", name: "Amsterdam", country: "Netherlands", left: 48.8, top: 23, isPrimary: true },
  { id: "de", name: "Frankfurt", country: "Germany", left: 50.5, top: 26, isPrimary: true },
  { id: "ro", name: "Bucharest", country: "Romania", left: 55.5, top: 28, isPrimary: true },
  // Edge nodes — global coverage
  { id: "fr", name: "Paris", country: "France", left: 47.5, top: 28 },
  { id: "es", name: "Madrid", country: "Spain", left: 44.5, top: 33 },
  { id: "pl", name: "Warsaw", country: "Poland", left: 53, top: 23 },
  { id: "fi", name: "Helsinki", country: "Finland", left: 54, top: 16 },
  { id: "us-east", name: "New York", country: "USA", left: 27, top: 31 },
  { id: "us-west", name: "Los Angeles", country: "USA", left: 15, top: 34 },
  { id: "us-mid", name: "Dallas", country: "USA", left: 21, top: 34 },
  { id: "br", name: "São Paulo", country: "Brazil", left: 31, top: 62 },
  { id: "sg", name: "Singapore", country: "Singapore", left: 76, top: 52 },
  { id: "jp", name: "Tokyo", country: "Japan", left: 84, top: 30 },
  { id: "au", name: "Sydney", country: "Australia", left: 87, top: 68 },
  { id: "in", name: "Mumbai", country: "India", left: 69, top: 40 },
  { id: "za", name: "Johannesburg", country: "S. Africa", left: 56, top: 65 },
  { id: "ae", name: "Dubai", country: "UAE", left: 63, top: 36 },
];

const connections: [string, string][] = [
  // European mesh
  ["uk", "nl"], ["nl", "de"], ["de", "ro"], ["uk", "fr"], ["fr", "de"],
  ["fr", "es"], ["de", "pl"], ["pl", "fi"], ["nl", "fi"],
  // Transatlantic
  ["uk", "us-east"], ["us-east", "us-west"], ["us-east", "us-mid"],
  // South America
  ["us-east", "br"],
  // Middle East & Asia
  ["ro", "ae"], ["ae", "in"], ["in", "sg"], ["sg", "jp"], ["sg", "au"],
  ["de", "ae"],
  // Africa
  ["ae", "za"], ["br", "za"],
];

function ConnectionLine({ from, to, index }: { from: ServerLocation; to: ServerLocation; index: number }) {
  // Use CSS percentages — the SVG sits in the same container
  const dx = to.left - from.left;
  const dy = to.top - from.top;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(dist * 0.3, 8);
  // Perpendicular offset for curve
  const mx = (from.left + to.left) / 2;
  const my = (from.top + to.top) / 2 - curvature;

  return (
    <g>
      <motion.path
        d={`M${from.left},${from.top} Q${mx},${my} ${to.left},${to.top}`}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.15"
        strokeOpacity="0.35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: index * 0.08 }}
      />
      {/* Traveling pulse */}
      <circle r="0.25" fill="hsl(var(--primary))">
        <animateMotion
          dur={`${3 + (index % 5) * 0.6}s`}
          repeatCount="indefinite"
          path={`M${from.left},${from.top} Q${mx},${my} ${to.left},${to.top}`}
        />
        <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${3 + (index % 5) * 0.6}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export function NetworkMap() {
  const getById = (id: string) => serverLocations.find(l => l.id === id);

  return (
    <div className="relative w-full aspect-[16/9] min-h-[300px] md:min-h-[450px] overflow-hidden rounded-lg">
      {/* Background map */}
      <img src={networkMapBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />

      {/* SVG overlay — viewBox matches percentage space */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map(([fId, tId], i) => {
          const f = getById(fId);
          const t = getById(tId);
          if (!f || !t) return null;
          return <ConnectionLine key={`${fId}-${tId}`} from={f} to={t} index={i} />;
        })}

        {/* Nodes */}
        {serverLocations.map((loc, i) => (
          <g key={loc.id} filter="url(#nodeGlow)">
            {loc.isPrimary && (
              <>
                <circle cx={loc.left} cy={loc.top} r="2" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.12">
                  <animate attributeName="r" values="1.2;3.5;1.2" dur="3s" repeatCount="indefinite" begin={`${i * 0.6}s`} />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.6}s`} />
                </circle>
                <circle cx={loc.left} cy={loc.top} r="1.2" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.08">
                  <animate attributeName="r" values="0.8;2.5;0.8" dur="3s" repeatCount="indefinite" begin={`${i * 0.6 + 0.6}s`} />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.6 + 0.6}s`} />
                </circle>
              </>
            )}
            <motion.circle
              cx={loc.left} cy={loc.top}
              r={loc.isPrimary ? 0.8 : 0.4}
              fill="hsl(var(--primary))"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
            />
            <motion.circle
              cx={loc.left} cy={loc.top}
              r={loc.isPrimary ? 0.35 : 0.18}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
            />
          </g>
        ))}
      </svg>

      {/* Labels — using absolute CSS positioning (matches % exactly) */}
      <div className="absolute inset-0 pointer-events-none">
        {serverLocations.filter(l => l.isPrimary).map((loc, i) => (
          <motion.div
            key={loc.id}
            className="absolute -translate-x-1/2"
            style={{ left: `${loc.left}%`, top: `${loc.top + 4}%` }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[9px] md:text-xs font-bold text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)] whitespace-nowrap">{loc.name}</span>
              <span className="text-[7px] md:text-[10px] text-muted-foreground/80 whitespace-nowrap">{loc.country}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-3 left-3 md:bottom-5 md:left-5 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
          <span className="text-[10px] md:text-xs text-muted-foreground">Primary DC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span className="text-[10px] md:text-xs text-muted-foreground">Edge Node</span>
        </div>
      </motion.div>
    </div>
  );
}
