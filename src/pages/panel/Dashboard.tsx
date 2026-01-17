import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, ShoppingCart, FileText, MessageSquare, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PanelLayout } from "@/components/panel/PanelLayout";
import { MockModeBanner } from "@/components/panel/MockModeBanner";
import { apiClient, Service, Order, Invoice, Ticket } from "@/services/apiClient";

interface DashboardData {
  services: Service[];
  orders: Order[];
  invoices: Invoice[];
  tickets: Ticket[];
}

export default function PanelDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, ordersRes, invoicesRes, ticketsRes] = await Promise.all([
          apiClient.getServices(),
          apiClient.getOrders(),
          apiClient.getInvoices(),
          apiClient.getTickets()
        ]);

        setData({
          services: servicesRes.data?.services || [],
          orders: ordersRes.data?.orders || [],
          invoices: invoicesRes.data?.invoices || [],
          tickets: ticketsRes.data?.tickets || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PanelLayout>
        <MockModeBanner />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PanelLayout>
    );
  }

  if (error) {
    return (
      <PanelLayout>
        <MockModeBanner />
        <div className="flex items-center justify-center h-64 text-destructive">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      </PanelLayout>
    );
  }

  const stats = [
    { 
      icon: Server, 
      label: "Active Services", 
      value: data?.services.filter(s => s.status === "active").length || 0, 
      color: "text-green-400" 
    },
    { 
      icon: ShoppingCart, 
      label: "Pending Orders", 
      value: data?.orders.filter(o => o.status === "pending").length || 0, 
      color: "text-yellow-400" 
    },
    { 
      icon: FileText, 
      label: "Unpaid Invoices", 
      value: data?.invoices.filter(i => i.status === "unpaid" || i.status === "overdue").length || 0, 
      color: "text-red-400" 
    },
    { 
      icon: MessageSquare, 
      label: "Open Tickets", 
      value: data?.tickets.filter(t => t.status === "open" || t.status === "customer-reply").length || 0, 
      color: "text-primary" 
    },
  ];

  return (
    <PanelLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <MockModeBanner />
        <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Services */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Your Services</h2>
              <Link to="/panel/services" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {data?.services.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Due: {service.nextDue}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.status === "active" ? "bg-green-500/20 text-green-400" :
                    service.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
              {(!data?.services || data.services.length === 0) && (
                <p className="text-muted-foreground text-sm text-center py-4">No services found</p>
              )}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Tickets</h2>
              <Link to="/panel/tickets" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {data?.tickets.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {ticket.status === "open" ? <AlertCircle className="w-4 h-4 text-yellow-400" /> :
                     ticket.status === "answered" ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                     <Clock className="w-4 h-4 text-muted-foreground" />}
                    <div>
                      <p className="font-medium text-foreground text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.department}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === "open" ? "bg-yellow-500/20 text-yellow-400" :
                    ticket.status === "answered" ? "bg-green-500/20 text-green-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
              {(!data?.tickets || data.tickets.length === 0) && (
                <p className="text-muted-foreground text-sm text-center py-4">No tickets found</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </PanelLayout>
  );
}
