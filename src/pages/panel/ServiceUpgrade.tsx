import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpCircle, Check, AlertCircle } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";

import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient, ServiceDetails, UpgradeOption } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";

export default function ServiceUpgradePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [upgrades, setUpgrades] = useState<UpgradeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        const [serviceData, upgradeData] = await Promise.all([
          whmcsClient.getServiceDetails(id),
          whmcsClient.getAvailableUpgrades(id),
        ]);
        setService(serviceData);
        setUpgrades(upgradeData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load upgrade options",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpgrade = async () => {
    if (!id || !selectedUpgrade) return;

    try {
      setSubmitting(true);
      const result = await whmcsClient.createUpgrade(id, selectedUpgrade);
      if (result.success) {
        toast({
          title: "Upgrade Initiated",
          description: `Your upgrade order has been created. Order ID: ${result.orderId}`,
        });
        navigate(`/panel/services/${id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process upgrade",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOption = upgrades.find((u) => u.id === selectedUpgrade);

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/panel/services/${id}`)}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upgrade Service</h1>
            <p className="text-sm text-muted-foreground">Choose a new plan for your service</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Service */}
            {service && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.packageName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${service.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">/ {service.billingCycle}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Options */}
            {upgrades.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Available Upgrades</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {upgrades.map((upgrade) => (
                    <button
                      key={upgrade.id}
                      onClick={() => setSelectedUpgrade(upgrade.id)}
                      className={`glass-card p-6 text-left transition-all ${
                        selectedUpgrade === upgrade.id
                          ? "border-primary/50 shadow-glow"
                          : "hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{upgrade.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{upgrade.description}</p>
                        </div>
                        {selectedUpgrade === upgrade.id && (
                          <div className="p-1 rounded-full bg-primary">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">${upgrade.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">/ {upgrade.billingCycle}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-primary font-medium">
                            +${upgrade.priceDifference.toFixed(2)}/mo
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upgrade options available for this service</p>
              </div>
            )}

            {/* Upgrade Summary */}
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-foreground mb-4">Upgrade Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="text-foreground">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Plan</span>
                    <span className="text-foreground">{selectedOption.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Difference</span>
                    <span className="text-primary font-medium">+${selectedOption.priceDifference.toFixed(2)}/mo</span>
                  </div>
                  <hr className="border-border/50" />
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-foreground">New Monthly Price</span>
                    <span className="font-bold text-foreground">${selectedOption.price.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  The price difference will be prorated for the remaining billing period.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/panel/services/${id}`)}
                    className="btn-outline py-2 px-4 flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgrade}
                    disabled={submitting}
                    className="btn-glow py-2 px-4 flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    {submitting ? "Processing..." : "Confirm Upgrade"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </PanelLayout>
  );
}
