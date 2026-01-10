import { motion } from "framer-motion";
import { AlertTriangle, Server, Palette, Key } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        
        <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Security Notice:</span> These settings are placeholders. 
              Never store real WHMCS/API credentials in the frontend. Use server-side environment variables.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4"><Server className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">WHMCS Integration</h2></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">WHMCS URL</label><input type="text" placeholder="https://billing.yourdomain.com" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground" disabled /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">API Identifier</label><input type="text" placeholder="Configured server-side" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground" disabled /></div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4"><Key className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">License Settings</h2></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">License Key</label><input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground" disabled /></div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4"><Palette className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Brand Settings</h2></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Brand Name</label><input type="text" defaultValue="Hoxta" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Accent Color</label><input type="text" defaultValue="#19c3ff" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground" /></div>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
