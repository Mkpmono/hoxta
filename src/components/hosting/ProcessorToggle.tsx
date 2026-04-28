import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

type Processor = "intel" | "amd";

interface ProcessorToggleProps {
  selected: Processor;
  onChange: (p: Processor) => void;
}

const processors = [
  { key: "intel" as const, label: "Intel Xeon", subtitle: "Enterprise Grade", logo: intelLogo },
  { key: "amd" as const, label: "AMD EPYC", subtitle: "High Performance", logo: amdLogo },
];

export function ProcessorToggle({ selected, onChange }: ProcessorToggleProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="inline-flex rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 p-1.5 gap-1.5 shadow-lg">
        {processors.map(({ key, label, subtitle, logo }) => {
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
                <img
                  src={logo}
                  alt={label}
                  className={`h-6 w-auto object-contain transition-opacity duration-200 [filter:brightness(0)_invert(1)] ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold tracking-wide">{label}</span>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-widest ${
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                    }`}
                  >
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
