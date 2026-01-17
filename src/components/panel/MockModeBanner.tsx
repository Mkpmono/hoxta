import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function MockModeBanner() {
  const { isMockMode } = useAuth();
  
  if (!isMockMode) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>Mock Mode – WHMCS not connected. Using demo data.</span>
      </div>
      <span className="text-xs text-yellow-400/70">
        Demo: client@demo.hoxta / Demo1234!
      </span>
    </div>
  );
}
