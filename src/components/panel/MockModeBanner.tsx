import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export function MockModeBanner() {
  const { t } = useTranslation();
  const { isMockMode } = useAuth();
  
  if (!isMockMode) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>{t("mockMode.banner")}</span>
      </div>
      <span className="text-xs text-yellow-400/70">
        {t("mockMode.demoCredentials")}
      </span>
    </div>
  );
}
