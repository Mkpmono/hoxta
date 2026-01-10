import { motion } from "framer-motion";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { mockTickets } from "@/lib/mockData";

export default function AdminTickets() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">All Tickets</h1>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30"><tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Priority</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/20 cursor-pointer">
                  <td className="px-4 py-3 text-sm font-mono text-primary">{ticket.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{ticket.clientName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.subject}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${ticket.status === "open" ? "bg-yellow-500/20 text-yellow-400" : ticket.status === "answered" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>{ticket.status}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${ticket.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-muted text-muted-foreground"}`}>{ticket.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
