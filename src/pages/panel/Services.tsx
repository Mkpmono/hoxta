import { motion } from "framer-motion";
import { Server, ExternalLink, Settings } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { mockServices } from "@/lib/mockData";

export default function PanelServices() {
  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">My Services</h1>
        
        <div className="grid gap-4">
          {mockServices.map((service) => (
            <div key={service.id} className="glass-card p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.ip && <span className="font-mono">{service.ip}</span>}
                      {!service.ip && <span>No IP assigned</span>}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>ID: {service.id}</span>
                      <span>Due: {service.nextDue}</span>
                      <span>${service.price.toFixed(2)}/mo</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    service.status === "active" ? "bg-green-500/20 text-green-400" :
                    service.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    service.status === "suspended" ? "bg-red-500/20 text-red-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                  <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </PanelLayout>
  );
}
