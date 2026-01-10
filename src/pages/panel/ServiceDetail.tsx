import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Server, 
  ArrowLeft, 
  Settings, 
  ArrowUpCircle, 
  XCircle, 
  Globe, 
  HardDrive,
  Calendar,
  DollarSign,
  Cpu,
  AlertTriangle
} from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { MockModeBanner } from "@/components/panel/MockModeBanner";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient, ServiceDetails } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelType, setCancelType] = useState<"immediate" | "end_of_billing">("end_of_billing");
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchService() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await whmcsClient.getServiceDetails(id);
        setService(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  const handleCancellation = async () => {
    if (!id || !cancelReason.trim()) return;
    
    try {
      setSubmitting(true);
      await whmcsClient.requestCancellation(id, {
        type: cancelType,
        reason: cancelReason,
      });
      toast({
        title: "Cancellation Requested",
        description: "Your cancellation request has been submitted. A support ticket has been created.",
      });
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit cancellation request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/panel/services")}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Details</h1>
            <p className="text-sm text-muted-foreground">Manage your service</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          </div>
        ) : service ? (
          <div className="space-y-6">
            {/* Service Info Card */}
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{service.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[service.status] || statusColors.cancelled}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">ID: {service.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/panel/services/${id}/upgrade`}
                    className="btn-outline py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Upgrade
                  </Link>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="py-2 px-4 text-sm rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {service.domain && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs">Domain</span>
                    </div>
                    <p className="text-foreground font-medium">{service.domain}</p>
                  </div>
                )}
                {service.ip && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <HardDrive className="w-4 h-4" />
                      <span className="text-xs">IP Address</span>
                    </div>
                    <p className="text-foreground font-mono font-medium">{service.ip}</p>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Next Due Date</span>
                  </div>
                  <p className="text-foreground font-medium">{service.nextDue}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Price</span>
                  </div>
                  <p className="text-foreground font-medium">${service.price.toFixed(2)} / {service.billingCycle}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Product Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package</span>
                    <span className="text-foreground">{service.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="text-foreground">{service.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">{service.createdAt}</span>
                  </div>
                  {service.serverName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server</span>
                      <span className="text-foreground">{service.serverName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    View Control Panel
                  </button>
                  <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    Manage DNS
                  </button>
                  <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    View Logs
                  </button>
                  <Link
                    to="/panel/tickets/new"
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Get Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Service not found</p>
            <Link to="/panel/services" className="text-primary hover:underline text-sm mt-2 inline-block">
              Back to Services
            </Link>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Request Cancellation</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to cancel this service? This action cannot be undone.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cancellation Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="radio"
                        name="cancelType"
                        value="end_of_billing"
                        checked={cancelType === "end_of_billing"}
                        onChange={() => setCancelType("end_of_billing")}
                        className="text-primary"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">End of Billing Period</p>
                        <p className="text-xs text-muted-foreground">Service remains active until {service?.nextDue}</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="radio"
                        name="cancelType"
                        value="immediate"
                        checked={cancelType === "immediate"}
                        onChange={() => setCancelType("immediate")}
                        className="text-primary"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">Immediate</p>
                        <p className="text-xs text-muted-foreground">Cancel immediately (no refund)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Reason for Cancellation</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    placeholder="Please tell us why you're cancelling..."
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="btn-outline py-2 px-4"
                    disabled={submitting}
                  >
                    Keep Service
                  </button>
                  <button
                    onClick={handleCancellation}
                    disabled={!cancelReason.trim() || submitting}
                    className="py-2 px-4 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Confirm Cancellation"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </PanelLayout>
  );
}
