import { motion } from "framer-motion";
import { Gamepad2, Server, Shield, Cpu } from "lucide-react";

const floatingItems = [
  { icon: Gamepad2, position: "top-10 left-10", delay: 0, color: "text-green-400" },
  { icon: Server, position: "top-20 right-16", delay: 0.5, color: "text-red-400" },
  { icon: Shield, position: "bottom-32 left-16", delay: 1, color: "text-blue-400" },
  { icon: Cpu, position: "bottom-20 right-10", delay: 1.5, color: "text-purple-400" },
];

export function FloatingIcons() {
  return (
    <>
      {floatingItems.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position} hidden lg:block`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: item.delay + 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className={`p-3 rounded-xl bg-card/50 backdrop-blur border border-border/50 ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="absolute inset-0 bg-current opacity-20 rounded-xl blur-xl -z-10" />
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
