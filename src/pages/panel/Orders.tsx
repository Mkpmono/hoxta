import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient } from "@/services/whmcsClient";
import { toast } from "sonner";

interface Order {
  id: string;
  date: string;
  product: string;
  status: string;
  total: number;
}

export default function PanelOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await whmcsClient.getOrders();
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      completed: "bg-green-500/20 text-green-400",
      active: "bg-primary/20 text-primary",
      pending: "bg-yellow-500/20 text-yellow-400",
      cancelled: "bg-red-500/20 text-red-400",
      fraud: "bg-red-500/20 text-red-400",
    };
    return statusClasses[status] || "bg-muted text-muted-foreground";
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>{orders.length} orders</span>
          </div>
        </div>
        
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <>
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                  </>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-primary">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{order.product}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">
                        ${(order.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}