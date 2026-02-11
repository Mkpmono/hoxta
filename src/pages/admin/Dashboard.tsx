import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, MessageSquare, Users, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { apiClient } from "@/services/apiClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { icon: ShoppingCart, label: "Total Orders", value: "0", color: "text-primary" },
    { icon: MessageSquare, label: "Open Tickets", value: "0", color: "text-yellow-400" },
    { icon: Users, label: "Active Services", value: "0", color: "text-green-400" },
    { icon: DollarSign, label: "Unpaid Invoices", value: "0", color: "text-primary" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, ticketsRes, servicesRes, invoicesRes] = await Promise.all([
          apiClient.getOrders(),
          apiClient.getTickets(),
          apiClient.getServices(),
          apiClient.getInvoices(),
        ]);

        setStats([
          { icon: ShoppingCart, label: "Total Orders", value: String(ordersRes.data?.orders?.length || 0), color: "text-primary" },
          { icon: MessageSquare, label: "Open Tickets", value: String(ticketsRes.data?.tickets?.filter((t: { status: string }) => t.status !== "closed").length || 0), color: "text-yellow-400" },
          { icon: Users, label: "Active Services", value: String(servicesRes.data?.services?.filter((s: { status: string }) => s.status === "active").length || 0), color: "text-green-400" },
          { icon: DollarSign, label: "Unpaid Invoices", value: String(invoicesRes.data?.invoices?.filter((i: { status: string }) => i.status === "unpaid" || i.status === "overdue").length || 0), color: "text-primary" },
        ]);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg bg-muted/50 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card p-6"><h2 className="font-semibold text-foreground mb-4">Recent Activity</h2><p className="text-muted-foreground text-sm">Admin activity log will appear here...</p></div>
      </motion.div>
    </AdminLayout>
  );
}
