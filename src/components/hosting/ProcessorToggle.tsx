import { motion } from "framer-motion";

type Processor = "intel" | "amd";

interface ProcessorToggleProps {
  selected: Processor;
  onChange: (p: Processor) => void;
}

export function ProcessorToggle({ selected, onChange }: ProcessorToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex rounded-xl bg-card/60 border border-border/50 p-1 gap-1">
        {(["intel", "amd"] as const).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              selected === p
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {selected === p && (
              <motion.div
                layoutId="processor-bg"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {p === "intel" ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor">i</text>
                  </svg>
                  Intel Xeon
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <text x="12" y="15" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">A</text>
                  </svg>
                  AMD EPYC
                </>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
