import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, X, Send } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { mockTickets, Ticket } from "@/lib/mockData";

export default function PanelTickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const clientTickets = mockTickets.filter(t => t.clientId === "1");

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <button
            onClick={() => setShowNewTicket(true)}
            className="btn-glow flex items-center gap-2 text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
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
                {clientTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-primary">{ticket.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{ticket.subject}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === "open" ? "bg-yellow-500/20 text-yellow-400" :
                        ticket.status === "answered" ? "bg-green-500/20 text-green-400" :
                        ticket.status === "customer-reply" ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === "high" ? "bg-red-500/20 text-red-400" :
                        ticket.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.lastReply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTicket(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[80vh] overflow-hidden glass-card"
              >
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedTicket.subject}</h2>
                    <p className="text-sm text-muted-foreground">{selectedTicket.id} • {selectedTicket.department}</p>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                  {selectedTicket.messages?.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-lg ${msg.sender === "Support Team" ? "bg-primary/10 ml-8" : "bg-muted/50 mr-8"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground"
                    />
                    <button className="btn-glow px-4 py-2">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewTicket(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg glass-card p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">New Support Ticket</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground">
                      <option>Technical Support</option>
                      <option>Sales</option>
                      <option>Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                    <textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none text-foreground resize-none" />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowNewTicket(false)} className="btn-outline py-2 px-4">Cancel</button>
                    <button className="btn-glow py-2 px-4">Submit Ticket</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PanelLayout>
  );
}
