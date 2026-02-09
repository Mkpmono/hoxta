import { motion } from "framer-motion";
import networkMapBg from "@/assets/network-map-bg.png";

interface ServerLocation {
  id: string;
  name: string;
  country: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  { id: "uk", name: "London", country: "UK", x: 46.5, y: 25, isPrimary: true },
  { id: "nl", name: "Amsterdam", country: "Netherlands", x: 48.5, y: 23, isPrimary: true },
  { id: "de", name: "Frankfurt", country: "Germany", x: 50.5, y: 26, isPrimary: true },
  { id: "ro", name: "Bucharest", country: "Romania", x: 55, y: 30, isPrimary: true },
  { id: "fr", name: "Paris", country: "France", x: 47.5, y: 28 },
  { id: "us-east", name: "New York", country: "USA", x: 27, y: 32 },
  { id: "us-west", name: "Los Angeles", country: "USA", x: 14, y: 36 },
  { id: "sg", name: "Singapore", country: "Singapore", x: 76, y: 58 },
];

const connections = [
  { from: "uk", to: "nl" },
  { from: "nl", to: "de" },
  { from: "de", to: "ro" },
  { from: "uk", to: "fr" },
  { from: "fr", to: "de" },
  { from: "uk", to: "us-east" },
  { from: "us-east", to: "us-west" },
  { from: "de", to: "sg" },
  { from: "ro", to: "sg" },
];

export function NetworkMap() {
  const getLocationById = (id: string) => serverLocations.find(loc => loc.id === id);

  return (
    <div className="relative w-full aspect-[16/9] min-h-[300px] md:min-h-[450px] overflow-hidden rounded-lg">
      {/* Professional world map background */}
      <img
        src={networkMapBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        loading="lazy"
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      {/* SVG overlay for connections and nodes */}
      <svg
        viewBox="0 0 100 60"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map((conn, index) => {
          const from = getLocationById(conn.from);
          const to = getLocationById(conn.to);
          if (!from || !to) return null;

          const midX = (from.x + to.x) / 2;
          const midY = Math.min(from.y, to.y) - 2;

          return (
            <g key={`${conn.from}-${conn.to}`} filter="url(#lineGlow)">
              {/* Curved connection line */}
              <motion.path
                d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.12"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: index * 0.12 }}
              />
              {/* Traveling pulse */}
              <circle r="0.3" fill="hsl(var(--primary))" opacity="0.9">
                <animateMotion
                  dur={`${3 + index * 0.4}s`}
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  dur={`${3 + index * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="0.15;0.35;0.15"
                  dur={`${3 + index * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Server nodes */}
        {serverLocations.map((location, index) => (
          <g key={location.id}>
            {/* Outer pulse ring for primary */}
            {location.isPrimary && (
              <>
                <circle
                  cx={location.x}
                  cy={location.y}
                  r="1.5"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.08"
                >
                  <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" begin={`${index * 0.5}s`} />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" begin={`${index * 0.5}s`} />
                </circle>
                <circle
                  cx={location.x}
                  cy={location.y}
                  r="1"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.06"
                >
                  <animate attributeName="r" values="0.8;2;0.8" dur="3s" repeatCount="indefinite" begin={`${index * 0.5 + 0.5}s`} />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" begin={`${index * 0.5 + 0.5}s`} />
                </circle>
              </>
            )}

            {/* Node glow */}
            <motion.circle
              cx={location.x}
              cy={location.y}
              r={location.isPrimary ? 1.2 : 0.6}
              fill="hsl(var(--primary))"
              fillOpacity="0.15"
              filter="url(#nodeGlow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            />

            {/* Main node */}
            <motion.circle
              cx={location.x}
              cy={location.y}
              r={location.isPrimary ? 0.6 : 0.35}
              fill="hsl(var(--primary))"
              filter="url(#nodeGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            />

            {/* Bright core */}
            <motion.circle
              cx={location.x}
              cy={location.y}
              r={location.isPrimary ? 0.25 : 0.15}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            />
          </g>
        ))}
      </svg>

      {/* Location labels */}
      <div className="absolute inset-0 pointer-events-none">
        {serverLocations.filter(loc => loc.isPrimary).map((location, index) => (
          <motion.div
            key={location.id}
            className="absolute transform -translate-x-1/2"
            style={{
              left: `${location.x}%`,
              top: `${location.y + 5}%`,
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
          >
            <div className="flex flex-col items-center gap-0">
              <span className="text-[10px] md:text-xs font-bold text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)] whitespace-nowrap">
                {location.name}
              </span>
              <span className="text-[8px] md:text-[10px] text-muted-foreground/80 whitespace-nowrap">
                {location.country}
              </span>
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
