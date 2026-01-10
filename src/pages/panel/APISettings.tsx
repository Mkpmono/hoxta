import { motion } from "framer-motion";
import { Key, AlertTriangle, Copy, RefreshCw } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";

export default function PanelAPI() {
  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">API Settings</h1>
        
        {/* Warning Notice */}
        <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Placeholder Only</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This API settings page is a placeholder. In production, API credentials should be managed 
                securely on the server-side. Never expose real API keys in the frontend.
              </p>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">API Access Key</h2>
              <p className="text-sm text-muted-foreground">Use this key to authenticate API requests</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value="demo_api_key_xxxxxxxxxxxxxxxxxxxxxxxx"
              readOnly
              className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground font-mono text-sm"
            />
            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Documentation */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-foreground mb-4">API Documentation</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-mono text-primary mb-2">GET /api/v1/services</p>
              <p className="text-muted-foreground">List all your active services</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-mono text-primary mb-2">GET /api/v1/invoices</p>
              <p className="text-muted-foreground">List all invoices</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-mono text-primary mb-2">POST /api/v1/tickets</p>
              <p className="text-muted-foreground">Create a new support ticket</p>
            </div>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}
