import { useState } from "react";
import { motion } from "framer-motion";
import { Key, AlertTriangle, Shield, Server, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { whmcsClient } from "@/services/whmcsClient";
import { toast } from "sonner";

export default function PanelAPI() {
  const [baseUrl, setBaseUrl] = useState("https://billing.yourdomain.com/includes/api.php");
  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState("");
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  

  const handleTestConnection = async () => {
    if (!baseUrl || !identifier || !secret) {
      toast.error("Please fill in all WHMCS credentials");
      return;
    }

    setTesting(true);
    setConnectionStatus("idle");

    try {
      // Note: This would call the server-side proxy in production
      // For now, we simulate the test since we don't have a server-side proxy
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would be:
      // const result = await whmcsClient.testConnection({ baseUrl, identifier, secret });
      
      // Simulated response - always fails because we don't store credentials
      toast.error("Connection test requires server-side configuration", {
        description: "WHMCS credentials must be stored securely on the server, not in the browser."
      });
      setConnectionStatus("error");
    } catch (error) {
      toast.error("Connection test failed");
      setConnectionStatus("error");
    } finally {
      setTesting(false);
    }
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">API Settings</h1>
        
        {/* Security Warning */}
        <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Security Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Important:</strong> WHMCS API credentials (Identifier and Secret) must be stored 
                securely on the server, not in the browser. This configuration UI is for reference only. 
                Actual credentials should be set via environment variables or server-side configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Info */}
        <div className="glass-card p-4 mb-6 border-border/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Secure Architecture</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All WHMCS API calls are routed through internal proxy endpoints (<code className="text-primary">/api/whmcs/*</code>). 
                The frontend never communicates directly with WHMCS. When properly configured, the server-side 
                proxy handles authentication and forwards requests securely.
              </p>
            </div>
          </div>
        </div>

        {/* WHMCS Configuration (UI Only) */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">WHMCS Connection</h2>
              <p className="text-sm text-muted-foreground">Configure your WHMCS API credentials (server-side required)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">WHMCS API URL</label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://billing.yourdomain.com/includes/api.php"
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">The full URL to your WHMCS API endpoint</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">API Identifier</label>
              <input
                type="password"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter API Identifier"
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your WHMCS API Identifier (Setup → Staff Management → API Credentials)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">API Secret</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter API Secret"
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your WHMCS API Secret key
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="btn-glow flex items-center gap-2 py-2 px-4 disabled:opacity-50"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : connectionStatus === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : connectionStatus === "error" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Server className="w-4 h-4" />
                )}
                {testing ? "Testing..." : "Test Connection"}
              </button>
              
              {connectionStatus === "success" && (
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Connection successful
                </span>
              )}
              {connectionStatus === "error" && (
                <span className="text-sm text-red-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Connection failed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* API Endpoints Reference */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Internal API Endpoints</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These endpoints are used internally by the panel. When WHMCS is configured on the server, 
            they proxy requests to the WHMCS API.
          </p>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-green-400">GET</span>
              <span className="text-foreground ml-2">/api/whmcs/services</span>
              <span className="text-muted-foreground ml-2">- List client services</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-green-400">GET</span>
              <span className="text-foreground ml-2">/api/whmcs/invoices</span>
              <span className="text-muted-foreground ml-2">- List client invoices</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-blue-400">POST</span>
              <span className="text-foreground ml-2">/api/whmcs/invoices/:id/paylink</span>
              <span className="text-muted-foreground ml-2">- Generate payment link</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-green-400">GET</span>
              <span className="text-foreground ml-2">/api/whmcs/tickets</span>
              <span className="text-muted-foreground ml-2">- List support tickets</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-blue-400">POST</span>
              <span className="text-foreground ml-2">/api/whmcs/tickets</span>
              <span className="text-muted-foreground ml-2">- Create new ticket</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 font-mono">
              <span className="text-blue-400">POST</span>
              <span className="text-foreground ml-2">/api/whmcs/test-connection</span>
              <span className="text-muted-foreground ml-2">- Test WHMCS connection</span>
            </div>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}