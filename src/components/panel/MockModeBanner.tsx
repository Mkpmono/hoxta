import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { whmcsClient } from "@/services/whmcsClient";

export function MockModeBanner() {
  if (!whmcsClient.isMockMode()) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>Mock Mode – WHMCS not connected. Using demo data.</span>
      </div>
      <Link
        to="/panel/api"
        className="text-xs text-yellow-400 hover:text-yellow-300 underline"
      >
        Configure
      </Link>
    </div>
  );
}
