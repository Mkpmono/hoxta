import { Link } from "react-router-dom";

interface HoxtaLogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
}

export function HoxtaLogo({ size = "md", linked = true }: HoxtaLogoProps) {
  const sizes = {
    sm: { text: "text-lg", icon: 28, gap: "gap-2" },
    md: { text: "text-2xl", icon: 34, gap: "gap-2.5" },
    lg: { text: "text-3xl", icon: 40, gap: "gap-3" },
  };

  const s = sizes[size];

  const content = (
    <span className={`flex items-center ${s.gap} group`}>
      {/* Icon mark */}
      <span className="relative flex items-center justify-center">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(195 100% 70%)" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer hexagon */}
          <path
            d="M20 2L35.32 10.5V27.5L20 36L4.68 27.5V10.5L20 2Z"
            fill="url(#hexGrad)"
            stroke="url(#strokeGrad)"
            strokeWidth="0.75"
          />

          {/* Inner hexagon accent */}
          <path
            d="M20 8L30 13.5V24.5L20 30L10 24.5V13.5L20 8Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.4"
            strokeOpacity="0.15"
          />

          {/* X letterform with glow */}
          <g filter="url(#glow)">
            <path
              d="M13 13L20 20.5L27 13"
              stroke="url(#xGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 27L20 19.5L27 27"
              stroke="url(#xGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Center diamond */}
          <path
            d="M20 17.5L22 20L20 22.5L18 20Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.9"
          />

          {/* Corner accents */}
          <circle cx="20" cy="2" r="1" fill="hsl(var(--primary))" fillOpacity="0.4" />
          <circle cx="35.32" cy="10.5" r="0.8" fill="hsl(var(--primary))" fillOpacity="0.25" />
          <circle cx="35.32" cy="27.5" r="0.8" fill="hsl(var(--primary))" fillOpacity="0.25" />
          <circle cx="20" cy="36" r="1" fill="hsl(var(--primary))" fillOpacity="0.4" />
          <circle cx="4.68" cy="27.5" r="0.8" fill="hsl(var(--primary))" fillOpacity="0.25" />
          <circle cx="4.68" cy="10.5" r="0.8" fill="hsl(var(--primary))" fillOpacity="0.25" />
        </svg>

        {/* Ambient glow */}
        <span className="absolute inset-[-4px] rounded-full bg-primary/15 blur-lg opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
      </span>

      {/* Wordmark */}
      <span className={`${s.text} font-extrabold tracking-tight font-display`}>
        <span className="text-foreground">Ho</span>
        <span className="relative">
          <span className="text-primary">x</span>
          <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </span>
        <span className="text-foreground">ta</span>
      </span>
    </span>
  );

  if (!linked) return content;

  return (
    <Link to="/" className="flex items-center" aria-label="Hoxta Home">
      {content}
    </Link>
  );
}
