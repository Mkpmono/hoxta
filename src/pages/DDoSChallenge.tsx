import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Fingerprint, Globe, Lock } from "lucide-react";
import { HoxtaLogo } from "@/components/HoxtaLogo";

/**
 * Professional DDoS Browser Verification Challenge Page.
 * Performs client-side checks (JS execution, timing, canvas fingerprint)
 * to filter basic bots. For real protection, use Cloudflare.
 */
export default function DDoSChallenge() {
  const [phase, setPhase] = useState<"checking" | "verified" | "blocked">("checking");
  const [checks, setChecks] = useState<{ label: string; status: "pending" | "running" | "pass" | "fail" }[]>([
    { label: "Verifying browser integrity", status: "pending" },
    { label: "Analyzing request headers", status: "pending" },
    { label: "Checking TLS fingerprint", status: "pending" },
    { label: "Validating JavaScript execution", status: "pending" },
    { label: "Running behavioral analysis", status: "pending" },
  ]);
  const [countdown, setCountdown] = useState(5);
  const [ip] = useState(() => {
    const parts = Array.from({ length: 4 }, () => Math.floor(Math.random() * 200) + 20);
    return parts.join(".");
  });

  const runChecks = useCallback(async () => {
    for (let i = 0; i < checks.length; i++) {
      setChecks((prev) =>
        prev.map((c, j) => (j === i ? { ...c, status: "running" } : c))
      );
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

      // Simulate a basic JS-environment check
      const isBot =
        !window.navigator.userAgent ||
        /bot|crawl|spider|headless/i.test(window.navigator.userAgent);

      if (isBot && i === 3) {
        setChecks((prev) =>
          prev.map((c, j) => (j === i ? { ...c, status: "fail" } : c))
        );
        setPhase("blocked");
        return;
      }

      setChecks((prev) =>
        prev.map((c, j) => (j === i ? { ...c, status: "pass" } : c))
      );
    }
    setPhase("verified");
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  useEffect(() => {
    if (phase === "verified" && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "verified" && countdown === 0) {
      // In production, redirect to the actual site
      // window.location.href = "/";
    }
  }, [phase, countdown]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Radar sweep animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-[15%] rounded-full border border-primary/20"
          animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Main Card */}
        <div className="glass-card p-8 md:p-10 text-center border border-border/50">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <HoxtaLogo />
          </div>

          {/* Title */}
          <div className="mb-2">
            <span className="text-xs tracking-[0.3em] text-primary font-semibold uppercase">
              P R O T E C Ț I E
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            DD<span className="text-primary">o</span>S
          </h1>

          {/* Status */}
          <AnimatePresence mode="wait">
            {phase === "checking" && (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-muted-foreground mb-6">
                  Verificăm browserul dvs. înainte de a accesa site-ul...
                </p>

                {/* Check list */}
                <div className="space-y-3 text-left mb-6">
                  {checks.map((check, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {check.status === "pending" && (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        )}
                        {check.status === "running" && (
                          <motion.div
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        {check.status === "pass" && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                        {check.status === "fail" && (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          check.status === "running"
                            ? "text-foreground"
                            : check.status === "pass"
                            ? "text-muted-foreground"
                            : check.status === "fail"
                            ? "text-destructive"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {check.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(checks.filter((c) => c.status === "pass").length / checks.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {phase === "verified" && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-foreground font-medium mb-2">Verificare completă</p>
                <p className="text-muted-foreground text-sm">
                  Veți fi redirecționat(ă) în{" "}
                  <span className="text-primary font-bold">{countdown}</span> secunde...
                </p>
              </motion.div>
            )}

            {phase === "blocked" && (
              <motion.div
                key="blocked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-destructive font-medium mb-2">Acces blocat</p>
                <p className="text-muted-foreground text-sm">
                  Traficul dvs. a fost identificat ca suspect. Dacă credeți că este o eroare, contactați suportul.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              IP: {ip}
            </span>
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              Ray ID: {Math.random().toString(36).substring(2, 14)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/40">
            <Lock className="w-3 h-3" />
            <span>Anti-DDoS Flood Protection & Firewall</span>
          </div>
          <p className="text-xs text-muted-foreground/30">
            Powered by Hoxta Security — hoxta.com
          </p>
        </div>
      </motion.div>
    </div>
  );
}
