import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { apiClient } from "@/services/apiClient";
import { Loader2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Array<{ id: string; product: string; status: string; total: number; date: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await apiClient.getOrders();
        setOrders(result.orders || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">All Orders</h1>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30"><tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-mono text-primary">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.product}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${order.status === "completed" ? "bg-green-500/20 text-green-400" : order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>{order.status}</span></td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">${(order.total ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
