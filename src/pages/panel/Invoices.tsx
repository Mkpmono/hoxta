import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { mockInvoices } from "@/lib/mockData";

export default function PanelInvoices() {
  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Invoices</h1>
        
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-primary">{invoice.id}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === "paid" ? "bg-green-500/20 text-green-400" :
                        invoice.status === "unpaid" ? "bg-yellow-500/20 text-yellow-400" :
                        invoice.status === "overdue" ? "bg-red-500/20 text-red-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right font-medium">${invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {(invoice.status === "unpaid" || invoice.status === "overdue") && (
                          <button className="px-3 py-1 text-xs font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}
