import { motion } from "framer-motion";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { mockClients } from "@/lib/mockData";

export default function AdminClients() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Clients</h1>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30"><tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Services</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total Spent</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/20 cursor-pointer">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${client.status === "active" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>{client.status}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.services}</td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">${client.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
