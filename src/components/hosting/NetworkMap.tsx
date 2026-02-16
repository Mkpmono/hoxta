import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";

interface ServerLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  isPrimary?: boolean;
}

const serverLocations: ServerLocation[] = [
  { id: "us-east", name: "New York", x: 28, y: 38, isPrimary: true },
  { id: "eu-west", name: "Amsterdam", x: 49.5, y: 28, isPrimary: true },
  { id: "eu-central", name: "Frankfurt", x: 51, y: 30, isPrimary: true },
  { id: "au", name: "Sydney", x: 85, y: 72, isPrimary: true },
  { id: "ro", name: "Bucharest", x: 55, y: 32 },
  { id: "uk", name: "London", x: 47.5, y: 29 },
  { id: "us-west", name: "Los Angeles", x: 15, y: 40 },
  { id: "sg", name: "Singapore", x: 76, y: 55 },
];

export function NetworkMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleTap = useCallback(
    (id: string) => {
      if (isMobile) setHovered((prev) => (prev === id ? null : id));
    },
    [isMobile]
  );

  const getById = (id: string) => serverLocations.find((l) => l.id === id);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#0c1524]">
      {/* SVG world map silhouette */}
      <svg
        viewBox="0 0 100 50"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* Simplified continent shapes — stylised fills */}
        <defs>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Continents as simplified paths (lighter navy fill on dark bg) */}
        <g fill="#1a2744" stroke="none">
          {/* North America */}
          <path d="M5,12 L8,8 L12,6 L18,5 L22,7 L28,6 L32,8 L34,12 L33,18 L30,22 L28,28 L25,32 L22,35 L20,38 L18,42 L15,44 L14,40 L12,36 L10,30 L8,24 L6,18 Z" />
          {/* Central America */}
          <path d="M18,42 L20,43 L22,45 L20,46 L18,45 Z" />
          {/* South America */}
          <path d="M24,46 L28,44 L32,46 L35,50 L36,56 L38,62 L37,68 L34,74 L30,78 L26,76 L24,70 L22,64 L22,58 L23,52 Z" opacity="0.9" />
          {/* Europe */}
          <path d="M44,14 L46,10 L48,8 L50,10 L52,8 L54,10 L56,12 L58,14 L56,18 L54,22 L52,26 L50,30 L48,32 L46,30 L44,26 L42,22 L42,18 Z" />
          {/* Africa */}
          <path d="M44,34 L48,32 L52,34 L56,36 L58,40 L60,46 L58,54 L56,60 L54,66 L50,70 L46,68 L44,62 L42,56 L42,48 L42,42 Z" />
          {/* Asia */}
          <path d="M56,6 L60,4 L66,6 L72,4 L78,6 L82,8 L86,10 L88,14 L86,18 L84,22 L80,26 L76,30 L72,34 L68,36 L64,34 L60,30 L58,26 L56,22 L54,18 L54,14 L56,10 Z" />
          {/* India subcontinent */}
          <path d="M68,36 L72,34 L74,38 L72,44 L70,48 L68,44 L66,40 Z" />
          {/* Southeast Asia / Indonesia */}
          <path d="M74,44 L76,42 L80,44 L82,46 L80,48 L76,48 L74,46 Z" />
          {/* Australia */}
          <path d="M80,58 L84,56 L90,58 L92,62 L90,68 L86,70 L82,68 L80,64 Z" />
          {/* Greenland */}
          <path d="M30,2 L34,2 L36,4 L34,8 L30,8 L28,6 Z" opacity="0.8" />
          {/* UK/Ireland */}
          <path d="M44.5,16 L46,15 L46.5,18 L45,19 Z" />
        </g>

        {/* Animated dots for each location */}
        {serverLocations.map((loc, i) => (
          <g key={loc.id}>
            {/* Pulse ring */}
            <circle cx={loc.x} cy={loc.y} r="0.8" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" opacity="0">
              <animate attributeName="r" values="0.4;2.5;0.4" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>

            {/* Glow */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r={loc.isPrimary ? 1.8 : 1.2}
              fill="url(#dotGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            />

            {/* Main dot */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r={loc.isPrimary ? 0.7 : 0.45}
              fill="hsl(var(--primary))"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            />

            {/* White center */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r={loc.isPrimary ? 0.25 : 0.15}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            />

            {/* Hit area */}
            <circle
              cx={loc.x}
              cy={loc.y}
              r={2.5}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => !isMobile && setHovered(loc.id)}
              onMouseLeave={() => !isMobile && setHovered(null)}
              onClick={(e) => { e.stopPropagation(); handleTap(loc.id); }}
            />
          </g>
        ))}
      </svg>

      {/* Tooltips */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hovered && (() => {
            const loc = getById(hovered);
            if (!loc) return null;
            return (
              <motion.div
                key={loc.id}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${loc.x}%`, top: `${(loc.y / 50) * 100 - 4}%` }}
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
                    <span className="text-[8px] md:text-[10px] text-muted-foreground ml-1.5">DC</span>
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
