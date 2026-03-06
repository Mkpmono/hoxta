import { motion } from "framer-motion";

type Processor = "intel" | "amd";

interface ProcessorToggleProps {
  selected: Processor;
  onChange: (p: Processor) => void;
}

/* Intel logo SVG – simplified "arc + text" mark */
function IntelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} fill="currentColor">
      <path d="M5 16a11 11 0 0 1 11-11h0" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <text x="18" y="22" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif" fill="currentColor">intel</text>
      <circle cx="73" cy="7" r="2.5" fill="currentColor"/>
    </svg>
  );
}

/* AMD logo SVG – stylized arrow + text */
function AmdLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} fill="currentColor">
      <text x="4" y="23" fontSize="18" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1" fill="currentColor">AMD</text>
      <polygon points="68,4 80,16 68,28" fill="currentColor" opacity="0.8"/>
    </svg>
  );
}

const processors: { key: Processor; label: string; subtitle: string; Logo: typeof IntelLogo }[] = [
  { key: "intel", label: "Intel Xeon", subtitle: "Enterprise Grade", Logo: IntelLogo },
  { key: "amd", label: "AMD EPYC", subtitle: "High Performance", Logo: AmdLogo },
];

export function ProcessorToggle({ selected, onChange }: ProcessorToggleProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="inline-flex rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 p-1.5 gap-1.5 shadow-lg">
        {processors.map(({ key, label, subtitle, Logo }) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`relative px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 min-w-[180px] ${
                isActive
                  ? "text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="processor-pill"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Logo className={`w-14 h-6 ${isActive ? "opacity-100" : "opacity-50"}`} />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold tracking-wide">{label}</span>
                  <span className={`text-[10px] font-medium uppercase tracking-widest ${isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                    {subtitle}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
