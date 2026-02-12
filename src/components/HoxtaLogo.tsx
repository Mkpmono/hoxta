import { Link } from "react-router-dom";

interface HoxtaLogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
}

export function HoxtaLogo({ size = "md", linked = true }: HoxtaLogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const content = (
    <span className={`${sizes[size]} font-extrabold tracking-tight font-display group`}>
      <span className="text-foreground">Ho</span>
      <span className="relative">
        <span className="text-primary">x</span>
        <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </span>
      <span className="text-foreground">ta</span>
    </span>
  );

  if (!linked) return content;

  return (
    <Link to="/" className="flex items-center" aria-label="Hoxta Home">
      {content}
    </Link>
  );
}
