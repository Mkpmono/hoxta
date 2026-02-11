import { Link } from "react-router-dom";

interface HoxtaLogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
}

export function HoxtaLogo({ size = "md", linked = true }: HoxtaLogoProps) {
  const sizes = {
    sm: { text: "text-lg", icon: 20, gap: "gap-1.5" },
    md: { text: "text-2xl", icon: 26, gap: "gap-2" },
    lg: { text: "text-3xl", icon: 32, gap: "gap-2.5" },
  };

  const s = sizes[size];

  const content = (
    <span className={`flex items-center ${s.gap} group`}>
      {/* Icon mark */}
      <span className="relative flex items-center justify-center">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Hexagon background */}
          <path
            d="M16 2L28.66 9V23L16 30L3.34 23V9L16 2Z"
            className="fill-primary/15 stroke-primary/40"
            strokeWidth="0.8"
          />
          {/* X letterform */}
          <path
            d="M10.5 10L16 16.5L21.5 10"
            className="stroke-primary"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 22L16 15.5L21.5 22"
            className="stroke-primary"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center dot */}
          <circle cx="16" cy="16" r="1.5" className="fill-primary" />
        </svg>
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </span>

      {/* Wordmark */}
      <span className={`${s.text} font-extrabold tracking-tight font-display`}>
        <span className="text-foreground">Ho</span>
        <span className="text-primary">x</span>
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
