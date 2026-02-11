import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { PanelLayout } from "@/components/panel/PanelLayout";

import { InvoiceDetailSkeleton } from "@/components/ui/LoadingSkeleton";
import { whmcsClient, Invoice } from "@/services/whmcsClient";
import { toast } from "@/hooks/use-toast";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    async function fetchInvoice() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await whmcsClient.getInvoice(id);
        setInvoice(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load invoice details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [id]);

  const handlePayNow = async () => {
    if (!id) return;
    try {
      setPaymentLoading(true);
      const result = await whmcsClient.getInvoicePayLink(id);
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get payment link",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const statusConfig = {
    paid: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20" },
    unpaid: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    overdue: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/20" },
    cancelled: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
    refunded: { icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/20" },
  };

  const StatusIcon = invoice ? statusConfig[invoice.status]?.icon || FileText : FileText;

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/panel/invoices")}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Invoice {id}</h1>
            <p className="text-sm text-muted-foreground">View invoice details</p>
          </div>
          {invoice && (invoice.status === "unpaid" || invoice.status === "overdue") && (
            <button
              onClick={handlePayNow}
              disabled={paymentLoading}
              className="btn-glow flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {paymentLoading ? "Loading..." : "Pay Now"}
            </button>
          )}
        </div>

        {loading ? (
          <InvoiceDetailSkeleton />
        ) : invoice ? (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${statusConfig[invoice.status]?.bg || "bg-muted"}`}>
                    <StatusIcon className={`w-6 h-6 ${statusConfig[invoice.status]?.color || "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Invoice #{invoice.id}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig[invoice.status]?.bg || "bg-muted"} ${statusConfig[invoice.status]?.color || "text-muted-foreground"}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">${invoice.total.toFixed(2)}</p>
                  {invoice.status === "paid" && invoice.datePaid && (
                    <p className="text-sm text-green-400 mt-1">Paid on {invoice.datePaid}</p>
                  )}
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Invoice Date</span>
                  </div>
                  <p className="text-foreground font-medium">{invoice.date}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Due Date</span>
                  </div>
                  <p className={`font-medium ${invoice.status === "overdue" ? "text-red-400" : "text-foreground"}`}>
                    {invoice.dueDate}
                  </p>
                </div>
                {invoice.paymentMethod && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs">Payment Method</span>
                    </div>
                    <p className="text-foreground font-medium">{invoice.paymentMethod}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Items */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Invoice Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm text-foreground">{item.description}</td>
                        <td className="px-4 py-4 text-sm text-foreground text-right font-medium">
                          ${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="p-4 bg-muted/20 border-t border-border/50">
                <div className="max-w-xs ml-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">${invoice.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.credit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credit Applied</span>
                      <span className="text-green-400">-${invoice.credit.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-border/50" />
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-foreground">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn-outline py-2 px-4 flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                {(invoice.status === "unpaid" || invoice.status === "overdue") && (
                  <button
                    onClick={handlePayNow}
                    disabled={paymentLoading}
                    className="btn-glow py-2 px-4 flex items-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {paymentLoading ? "Loading..." : "Pay Online"}
                  </button>
                )}
                <Link
                  to="/panel/tickets/new"
                  className="btn-outline py-2 px-4 flex items-center gap-2 text-sm"
                >
                  Billing Question?
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Invoice not found</p>
            <Link to="/panel/invoices" className="text-primary hover:underline text-sm mt-2 inline-block">
              Back to Invoices
            </Link>
          </div>
        )}
      </motion.div>
    </PanelLayout>
  );
}
