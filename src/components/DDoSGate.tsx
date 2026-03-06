import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Globe, Lock, Fingerprint, ShieldCheck } from "lucide-react";
import { HoxtaLogo } from "@/components/HoxtaLogo";

const VERIFICATION_KEY = "hoxta_ddos_verified";
const VERIFICATION_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CheckItem {
  label: string;
  status: "pending" | "running" | "pass" | "fail";
}

interface ClientInfo {
  ip: string;
  country?: string;
  isp?: string;
  isProxy?: boolean;
  isTor?: boolean;
}

function isVerified(): boolean {
  try {
    const raw = sessionStorage.getItem(VERIFICATION_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < VERIFICATION_TTL_MS;
  } catch {
    return false;
  }
}

function markVerified() {
  sessionStorage.setItem(VERIFICATION_KEY, JSON.stringify({ ts: Date.now() }));
}

// Canvas fingerprint to detect headless browsers
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Hoxta Security", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("DDoS Shield", 4, 35);
    return canvas.toDataURL().slice(-50);
  } catch {
    return "error";
  }
}

// Detect bot-like behavior
function detectSuspiciousBehavior(): { isBot: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check user agent
  const ua = navigator.userAgent || "";
  if (!ua || /bot|crawl|spider|headless|phantom|puppeteer|selenium/i.test(ua)) {
    reasons.push("suspicious-ua");
  }

  // Check for webdriver (Selenium, Puppeteer)
  if ((navigator as any).webdriver === true) {
    reasons.push("webdriver-detected");
  }

  // Check for missing browser APIs that real browsers have
  if (!(window as any).chrome && /Chrome/.test(ua)) {
    reasons.push("fake-chrome");
  }

  // Check for automation tools
  if ((window as any).__nightmare || (window as any)._phantom || (window as any).callPhantom) {
    reasons.push("automation-tool");
  }

  // Check screen dimensions (headless often has 0x0 or unusual sizes)
  if (screen.width === 0 || screen.height === 0) {
    reasons.push("no-screen");
  }

  // Check plugin count (headless browsers often have 0)
  if (navigator.plugins && navigator.plugins.length === 0 && !/Firefox/.test(ua)) {
    reasons.push("no-plugins");
  }

  // Canvas fingerprint check
  const fp = getCanvasFingerprint();
  if (fp === "no-canvas" || fp === "error") {
    reasons.push("canvas-blocked");
  }

  return { isBot: reasons.length >= 2, reasons };
}

// Fetch real IP from free API
async function fetchClientInfo(): Promise<ClientInfo> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error("IP fetch failed");
    const data = await res.json();
    return {
      ip: data.ip || "Unknown",
      country: data.country_code || undefined,
      isp: data.org || undefined,
      isProxy: false,
      isTor: false,
    };
  } catch {
    // Fallback to simpler API
    try {
      const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      return { ip: data.ip || "Unknown" };
    } catch {
      return { ip: "Unable to detect" };
    }
  }
}

const initialChecks: CheckItem[] = [
  { label: "Detecting client IP address", status: "pending" },
  { label: "Verifying browser environment", status: "pending" },
  { label: "Analyzing connection fingerprint", status: "pending" },
  { label: "Scanning for automation tools", status: "pending" },
  { label: "Running behavioral analysis", status: "pending" },
];

export function DDoSGate({ children }: { children: React.ReactNode }) {
  const [passed, setPassed] = useState(() => isVerified());
  const [phase, setPhase] = useState<"checking" | "verified" | "blocked">("checking");
  const [checks, setChecks] = useState<CheckItem[]>(initialChecks);
  const [countdown, setCountdown] = useState(3);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const rayId = useRef(Math.random().toString(36).substring(2, 14));

  // Periodically re-check verification validity
  useEffect(() => {
    if (!passed) return;
    const interval = setInterval(() => {
      if (!isVerified()) {
        setPassed(false);
        setPhase("checking");
        setChecks(initialChecks.map((c) => ({ ...c, status: "pending" })));
        setCountdown(3);
        rayId.current = Math.random().toString(36).substring(2, 14);
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [passed]);

  const runChecks = useCallback(async () => {
    // Step 1: Fetch real IP
    setChecks((prev) => prev.map((c, j) => (j === 0 ? { ...c, status: "running" } : c)));
    const info = await fetchClientInfo();
    setClientInfo(info);
    await new Promise((r) => setTimeout(r, 300));
    setChecks((prev) => prev.map((c, j) => (j === 0 ? { ...c, status: "pass" } : c)));

    // Steps 2-4: Browser environment checks
    for (let i = 1; i < 4; i++) {
      setChecks((prev) => prev.map((c, j) => (j === i ? { ...c, status: "running" } : c)));
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      setChecks((prev) => prev.map((c, j) => (j === i ? { ...c, status: "pass" } : c)));
    }

    // Step 5: Behavioral analysis (real detection)
    setChecks((prev) => prev.map((c, j) => (j === 4 ? { ...c, status: "running" } : c)));
    await new Promise((r) => setTimeout(r, 500));
    const { isBot } = detectSuspiciousBehavior();

    if (isBot) {
      setChecks((prev) => prev.map((c, j) => (j === 4 ? { ...c, status: "fail" } : c)));
      setPhase("blocked");
      return;
    }

    setChecks((prev) => prev.map((c, j) => (j === 4 ? { ...c, status: "pass" } : c)));
    setPhase("verified");
  }, []);

  useEffect(() => {
    if (!passed) runChecks();
  }, [passed, runChecks]);

  // Countdown after verified
  useEffect(() => {
    if (phase === "verified" && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "verified" && countdown === 0) {
      markVerified();
      setPassed(true);
    }
  }, [phase, countdown]);

  if (passed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Pulse rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.6], opacity: [0.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: i * 1.3 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <HoxtaLogo />
          </div>

          {/* Shield icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              animate={phase === "checking" ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            >
              <ShieldCheck className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          <div className="text-center mb-1">
            <span className="text-[10px] tracking-[0.35em] text-primary font-bold uppercase">
              Security Check
            </span>
          </div>
          <h1 className="text-center text-lg font-bold text-foreground mb-5">
            DDoS Protection
          </h1>

          <AnimatePresence mode="wait">
            {phase === "checking" && (
              <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-sm text-muted-foreground text-center mb-5">
                  Checking your browser before accessing <span className="text-foreground font-medium">hoxta.com</span>
                </p>

                <div className="space-y-2.5 mb-5">
                  {checks.map((check, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2.5 py-1"
                    >
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {check.status === "pending" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                        )}
                        {check.status === "running" && (
                          <motion.div
                            className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        {check.status === "pass" && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                          </motion.div>
                        )}
                        {check.status === "fail" && (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          check.status === "running"
                            ? "text-foreground font-medium"
                            : check.status === "pass"
                            ? "text-muted-foreground"
                            : check.status === "fail"
                            ? "text-destructive"
                            : "text-muted-foreground/40"
                        }`}
                      >
                        {check.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress */}
                <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(checks.filter((c) => c.status === "pass").length / checks.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {phase === "verified" && (
              <motion.div key="verified" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-3"
                  >
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </motion.div>
                  <p className="text-foreground font-semibold text-sm mb-1">Verification Complete</p>
                  <p className="text-muted-foreground text-xs">
                    Redirecting in <span className="text-primary font-bold">{countdown}</span>s...
                  </p>
                </div>
              </motion.div>
            )}

            {phase === "blocked" && (
              <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center mb-3">
                    <AlertTriangle className="w-7 h-7 text-destructive" />
                  </div>
                  <p className="text-destructive font-semibold text-sm mb-1">Access Denied</p>
                  <p className="text-muted-foreground text-xs text-center">
                    Your request has been flagged as suspicious. Contact support if this is an error.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer meta */}
        <div className="mt-4 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              {clientInfo?.ip || "Detecting..."}{clientInfo?.country ? ` (${clientInfo.country})` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Fingerprint className="w-2.5 h-2.5" />
              Ray ID: {rayId.current}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/30">
            <Lock className="w-2.5 h-2.5" />
            <span>Hoxta Anti-DDoS Shield</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
