import { motion } from "framer-motion";

interface ServerLocation {
  id: string;
  name: string;
  country: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  { id: "uk", name: "London", country: "UK", x: 47, y: 28, isPrimary: true },
  { id: "nl", name: "Amsterdam", country: "Netherlands", x: 49, y: 26, isPrimary: true },
  { id: "de", name: "Frankfurt", country: "Germany", x: 51, y: 29, isPrimary: true },
  { id: "ro", name: "Bucharest", country: "Romania", x: 57, y: 33, isPrimary: true },
  { id: "fr", name: "Paris", country: "France", x: 48, y: 31 },
  { id: "us-east", name: "New York", country: "USA", x: 25, y: 35 },
  { id: "us-west", name: "Los Angeles", country: "USA", x: 12, y: 38 },
  { id: "sg", name: "Singapore", country: "Singapore", x: 77, y: 58 },
];

// Connection lines between data centers
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
    <div className="relative w-full aspect-[2/1] min-h-[300px] md:min-h-[400px]">
      {/* Background world map outline */}
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glow filter for nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Gradient for connection lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>

          {/* Animated dash pattern */}
          <pattern id="movingDash" patternUnits="userSpaceOnUse" width="4" height="1">
            <line x1="0" y1="0.5" x2="2" y2="0.5" stroke="hsl(var(--primary))" strokeWidth="0.3" strokeOpacity="0.8">
              <animate attributeName="x1" from="0" to="4" dur="1s" repeatCount="indefinite" />
              <animate attributeName="x2" from="2" to="6" dur="1s" repeatCount="indefinite" />
            </line>
          </pattern>
        </defs>

        {/* Simplified world map background */}
        <g className="opacity-20">
          {/* Europe */}
          <ellipse cx="50" cy="30" rx="12" ry="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" />
          {/* North America */}
          <ellipse cx="20" cy="32" rx="15" ry="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" />
          {/* Asia */}
          <ellipse cx="75" cy="40" rx="18" ry="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" />
        </g>

        {/* Connection lines with animation */}
        {connections.map((conn, index) => {
          const from = getLocationById(conn.from);
          const to = getLocationById(conn.to);
          if (!from || !to) return null;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Base line */}
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="hsl(var(--primary))"
                strokeWidth="0.15"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
              />
              {/* Animated pulse along line */}
              <circle r="0.4" fill="hsl(var(--primary))">
                <animateMotion
                  dur={`${2 + index * 0.3}s`}
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${2 + index * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Server location nodes */}
        {serverLocations.map((location, index) => (
          <g key={location.id} filter="url(#glow)">
            {/* Outer pulse ring for primary locations */}
            {location.isPrimary && (
              <circle
                cx={location.x}
                cy={location.y}
                r="1.5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.2"
              >
                <animate
                  attributeName="r"
                  values="1;2.5;1"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3}s`}
                />
              </circle>
            )}
            
            {/* Main node */}
            <motion.circle
              cx={location.x}
              cy={location.y}
              r={location.isPrimary ? 0.8 : 0.5}
              fill="hsl(var(--primary))"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            />
            
            {/* Inner bright core */}
            <circle
              cx={location.x}
              cy={location.y}
              r={location.isPrimary ? 0.4 : 0.25}
              fill="white"
              opacity="0.8"
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
              top: `${location.y + 4}%`,
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-semibold text-primary whitespace-nowrap">
                {location.name}
              </span>
              <span className="text-[8px] md:text-[10px] text-muted-foreground whitespace-nowrap">
                {location.country}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-2 left-2 md:bottom-4 md:left-4 flex items-center gap-4 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
          <span className="text-[10px] md:text-xs">Primary DC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span className="text-[10px] md:text-xs">Edge Node</span>
        </div>
      </motion.div>
    </div>
  );
}
