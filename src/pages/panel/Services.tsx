import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Server, ExternalLink, Settings } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { MockModeBanner } from "@/components/panel/MockModeBanner";
import { ServiceCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient, Service } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";

export default function PanelServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await whmcsClient.getServices();
        setServices(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    suspended: "bg-red-500/20 text-red-400",
    cancelled: "bg-muted text-muted-foreground",
    terminated: "bg-muted text-muted-foreground",
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <MockModeBanner />
        <h1 className="text-2xl font-bold text-foreground mb-6">My Services</h1>
        
        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          ) : services.length === 0 ? (
            <div className="glass-card p-12 text-center text-muted-foreground">No services found</div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="glass-card p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <Server className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.ip ? <span className="font-mono">{service.ip}</span> : <span>No IP assigned</span>}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>ID: {service.id}</span>
                        <span>Due: {service.nextDue}</span>
                        <span>${service.price.toFixed(2)}/mo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[service.status] || statusColors.cancelled}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                    <Link to={`/panel/services/${service.id}`} className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Settings className="w-4 h-4" />
                    </Link>
                    <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </PanelLayout>
  );
}
