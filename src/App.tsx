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
import GameServerDetail from "./pages/GameServerDetail";
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
// Order Flow Pages
import Order from "./pages/Order";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailed from "./pages/CheckoutFailed";
// More Hosting Pages
import Colocation from "./pages/Colocation";
import TeamSpeak from "./pages/TeamSpeak";
import DiscordBot from "./pages/DiscordBot";
import KnowledgeBase from "./pages/KnowledgeBase";
import KBArticle from "./pages/KBArticle";
import KBAdmin from "./pages/KBAdmin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
// Panel Pages
import Login from "./pages/panel/Login";
import Register from "./pages/panel/Register";
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
            <Route path="/game-servers/:gameSlug" element={<GameServerDetail />} />
            <Route path="/vps" element={<VPS />} />
            <Route path="/dedicated" element={<Dedicated />} />
            <Route path="/ddos-protection" element={<DDoSProtection />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/status" element={<Status />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* Order Flow */}
            <Route path="/order" element={<Order />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failed" element={<CheckoutFailed />} />
            {/* More Hosting Routes */}
            <Route path="/colocation" element={<Colocation />} />
            <Route path="/teamspeak" element={<TeamSpeak />} />
            <Route path="/discord-bot" element={<DiscordBot />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/:categorySlug" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/article/:articleSlug" element={<KBArticle />} />
            <Route path="/kb-admin" element={<KBAdmin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            
            {/* Auth */}
            <Route path="/panel/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Client Panel (Protected) */}
            <Route path="/panel" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelDashboard /></ProtectedRoute>} />
            <Route path="/panel/services" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelServices /></ProtectedRoute>} />
            <Route path="/panel/services/:id" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><ServiceDetail /></ProtectedRoute>} />
            <Route path="/panel/services/:id/upgrade" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><ServiceUpgrade /></ProtectedRoute>} />
            <Route path="/panel/orders" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelOrders /></ProtectedRoute>} />
            <Route path="/panel/invoices" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelInvoices /></ProtectedRoute>} />
            <Route path="/panel/invoices/:id" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><InvoiceDetail /></ProtectedRoute>} />
            <Route path="/panel/tickets" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelTickets /></ProtectedRoute>} />
            <Route path="/panel/tickets/new" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><NewTicket /></ProtectedRoute>} />
            <Route path="/panel/tickets/:id" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><TicketDetail /></ProtectedRoute>} />
            <Route path="/panel/profile" element={<ProtectedRoute allowedRoles={["client", "admin", "owner"]}><PanelProfile /></ProtectedRoute>} />
            {/* API Settings - Owner only, dev mode only (enforced in ProtectedRoute) */}
            <Route path="/panel/api" element={<ProtectedRoute allowedRoles={["owner"]} requireOwner><PanelAPI /></ProtectedRoute>} />
            
            {/* Admin Panel (Protected - Admin & Owner) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AdminTickets /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AdminClients /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AdminSettings /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
