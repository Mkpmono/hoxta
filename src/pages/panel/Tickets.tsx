import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { PanelLayout } from "@/components/panel/PanelLayout";

import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { apiClient, Ticket } from "@/services/apiClient";
import { toast } from "sonner";

export default function PanelTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getTickets();
      setTickets(result.tickets || []);
    } catch (error) {
      toast.error("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery || 
      (ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       ticket.id?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      open: "bg-yellow-500/20 text-yellow-400",
      answered: "bg-green-500/20 text-green-400",
      "customer-reply": "bg-primary/20 text-primary",
      closed: "bg-muted text-muted-foreground",
    };
    return statusClasses[status] || "bg-muted text-muted-foreground";
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses: Record<string, string> = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-muted text-muted-foreground",
    };
    return priorityClasses[priority] || "bg-muted text-muted-foreground";
  };

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <Link to="/panel/tickets/new" className="btn-glow flex items-center gap-2 text-sm py-2">
            <Plus className="w-4 h-4" />
            New Ticket
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="answered">Answered</option>
              <option value="customer-reply">Customer Reply</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Reply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <>
                    <TableRowSkeleton columns={6} />
                    <TableRowSkeleton columns={6} />
                    <TableRowSkeleton columns={6} />
                  </>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <Link to={`/panel/tickets/${ticket.id}`} className="text-sm font-mono text-primary hover:underline">
                          {ticket.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/panel/tickets/${ticket.id}`} className="text-sm text-foreground hover:text-primary">
                          {ticket.subject}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.lastReply}</td>
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
