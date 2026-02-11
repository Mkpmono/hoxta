import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";

import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { apiClient, Invoice } from "@/services/apiClient";
import { toast } from "@/hooks/use-toast";

export default function PanelInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const result = await apiClient.getInvoices();
        if (result.error) {
          toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
          setInvoices(result.data?.invoices || []);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load invoices", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const handlePayNow = async (invoiceId: string) => {
    try {
      const result = await apiClient.getInvoicePayLink(invoiceId);
      if (result.data?.url) window.open(result.data.url, "_blank");
      else toast({ title: "Error", description: "Failed to get payment link", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to get payment link", variant: "destructive" });
    }
  };

  const statusColors = {
    paid: "bg-green-500/20 text-green-400",
    unpaid: "bg-yellow-500/20 text-yellow-400",
    overdue: "bg-red-500/20 text-red-400",
    cancelled: "bg-muted text-muted-foreground",
    refunded: "bg-blue-500/20 text-blue-400",
  };

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
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                ) : invoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No invoices found</td></tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-primary">
                        <Link to={`/panel/invoices/${invoice.id}`} className="hover:underline">{invoice.id}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.date}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[invoice.status] || statusColors.cancelled}`}>{invoice.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right font-medium">${invoice.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/panel/invoices/${invoice.id}`} className="p-1.5 rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-1.5 rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          {(invoice.status === "unpaid" || invoice.status === "overdue") && (
                            <button onClick={() => handlePayNow(invoice.id)} className="px-3 py-1 text-xs font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                              Pay Now
                            </button>
                          )}
                        </div>
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
