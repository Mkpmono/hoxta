import { motion } from "framer-motion";
import { ShoppingCart, MessageSquare, Users, DollarSign } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { mockOrders, mockTickets, mockClients, mockInvoices } from "@/lib/mockData";

const stats = [
  { icon: ShoppingCart, label: "Total Orders", value: mockOrders.length, color: "text-primary" },
  { icon: MessageSquare, label: "Open Tickets", value: mockTickets.filter(t => t.status !== "closed").length, color: "text-yellow-400" },
  { icon: Users, label: "Total Clients", value: mockClients.length, color: "text-green-400" },
  { icon: DollarSign, label: "Revenue", value: "$" + mockInvoices.filter(i => i.status === "paid").reduce((a, b) => a + b.total, 0).toFixed(2), color: "text-primary" },
];

export default function AdminDashboard() {
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
