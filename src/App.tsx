import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import WebHosting from "./pages/WebHosting";
import ResellerHosting from "./pages/ResellerHosting";
import GameServers from "./pages/GameServers";
import VPS from "./pages/VPS";
import Dedicated from "./pages/Dedicated";
import DDoSProtection from "./pages/DDoSProtection";
import Pricing from "./pages/Pricing";
import Status from "./pages/Status";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
// Panel Pages
import Login from "./pages/panel/Login";
import PanelDashboard from "./pages/panel/Dashboard";
import PanelServices from "./pages/panel/Services";
import ServiceDetail from "./pages/panel/ServiceDetail";
import ServiceUpgrade from "./pages/panel/ServiceUpgrade";
import PanelOrders from "./pages/panel/Orders";
import PanelInvoices from "./pages/panel/Invoices";
import InvoiceDetail from "./pages/panel/InvoiceDetail";
import PanelTickets from "./pages/panel/Tickets";
import NewTicket from "./pages/panel/NewTicket";
import TicketDetail from "./pages/panel/TicketDetail";
import PanelProfile from "./pages/panel/Profile";
import PanelAPI from "./pages/panel/APISettings";
// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminTickets from "./pages/admin/Tickets";
import AdminClients from "./pages/admin/Clients";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/web-hosting" element={<WebHosting />} />
            <Route path="/reseller-hosting" element={<ResellerHosting />} />
            <Route path="/game-servers" element={<GameServers />} />
            <Route path="/vps" element={<VPS />} />
            <Route path="/dedicated" element={<Dedicated />} />
            <Route path="/ddos-protection" element={<DDoSProtection />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/status" element={<Status />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Auth */}
            <Route path="/panel/login" element={<Login />} />
            
            {/* Client Panel (Protected) */}
            <Route path="/panel" element={<ProtectedRoute><PanelDashboard /></ProtectedRoute>} />
            <Route path="/panel/services" element={<ProtectedRoute><PanelServices /></ProtectedRoute>} />
            <Route path="/panel/services/:id" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
            <Route path="/panel/services/:id/upgrade" element={<ProtectedRoute><ServiceUpgrade /></ProtectedRoute>} />
            <Route path="/panel/orders" element={<ProtectedRoute><PanelOrders /></ProtectedRoute>} />
            <Route path="/panel/invoices" element={<ProtectedRoute><PanelInvoices /></ProtectedRoute>} />
            <Route path="/panel/invoices/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
            <Route path="/panel/tickets" element={<ProtectedRoute><PanelTickets /></ProtectedRoute>} />
            <Route path="/panel/tickets/new" element={<ProtectedRoute><NewTicket /></ProtectedRoute>} />
            <Route path="/panel/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
            <Route path="/panel/profile" element={<ProtectedRoute><PanelProfile /></ProtectedRoute>} />
            <Route path="/panel/api" element={<ProtectedRoute><PanelAPI /></ProtectedRoute>} />
            
            {/* Admin Panel (Protected - Admin Only) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTickets /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={["admin"]}><AdminClients /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
