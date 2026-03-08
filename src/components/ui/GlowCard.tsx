import { useRef, useState, useCallback, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tilt?: boolean;
}

/**
 * Premium glass card with cursor-following glow and subtle tilt effect
 */
export function GlowCard({ children, className, glowColor = "hsl(195 100% 55%)", tilt = true }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
    
    if (tilt) {
      const tiltX = ((y - 50) / 50) * -3;
      const tiltY = ((x - 50) / 50) * 3;
      setTiltStyle({ rotateX: tiltX, rotateY: tiltY });
    }
  }, [tilt]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-2xl overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltStyle.rotateX,
        rotateY: tiltStyle.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      {/* Cursor-following glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor.replace(")", " / 0.12)")}, transparent 60%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 0 0 1px ${glowColor.replace(")", " / 0.2)")}, 0 0 30px ${glowColor.replace(")", " / 0.08)")}`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
