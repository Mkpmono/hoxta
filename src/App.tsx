import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import Index from "./pages/Index";
import WebHosting from "./pages/WebHosting";
import HostingPlanDetail from "./pages/HostingPlanDetail";
import ResellerHosting from "./pages/ResellerHosting";
import GameServers from "./pages/GameServers";
import GameServerDetail from "./pages/GameServerDetail";
import VPS from "./pages/VPS";
import Dedicated from "./pages/Dedicated";
import DDoSProtection from "./pages/DDoSProtection";
import DDoSChallenge from "./pages/DDoSChallenge";
import Pricing from "./pages/Pricing";
import Status from "./pages/Status";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailed from "./pages/CheckoutFailed";
import Colocation from "./pages/Colocation";
import TeamSpeak from "./pages/TeamSpeak";
import DiscordBot from "./pages/DiscordBot";
import KnowledgeBase from "./pages/KnowledgeBase";
import KBArticle from "./pages/KBArticle";
import KBAdmin from "./pages/KBAdmin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import StatusAdmin from "./pages/StatusAdmin";
import Domains from "./pages/Domains";
import VisitorLogs from "./pages/admin/VisitorLogs";
import GameServerAdmin from "./pages/admin/GameServerAdmin";
import TranslationsAdmin from "./pages/admin/TranslationsAdmin";
import WebHostingAdmin from "./pages/admin/hosting/WebHostingAdmin";
import ResellerAdmin from "./pages/admin/hosting/ResellerAdmin";
import VpsAdmin from "./pages/admin/hosting/VpsAdmin";
import DedicatedAdmin from "./pages/admin/hosting/DedicatedAdmin";
import DomainsAdmin from "./pages/admin/hosting/DomainsAdmin";
import DiscordBotAdmin from "./pages/admin/hosting/DiscordBotAdmin";
import TeamSpeakAdmin from "./pages/admin/hosting/TeamSpeakAdmin";
import ColocationAdmin from "./pages/admin/hosting/ColocationAdmin";
import SupportSettingsAdmin from "./pages/admin/SupportSettingsAdmin";
import CustomServicesAdmin from "./pages/admin/CustomServicesAdmin";
import CustomServicePage from "./pages/CustomServicePage";

import { ScrollToTop } from "@/components/ScrollToTop";
import { DiscountPopup } from "@/components/DiscountPopup";
import { DDoSGate } from "@/components/DDoSGate";
import { CookieConsent } from "@/components/CookieConsent";
import { LiveChatButton } from "@/components/LiveChatButton";
import { LiveChatScript } from "@/components/LiveChatScript";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DiscountPopup />
        <BrowserRouter>
        <CookieConsent />
        <LiveChatScript />
        <LiveChatButton />
        <ScrollToTop />
        <DDoSGate>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/web-hosting" element={<WebHosting />} />
            <Route path="/web-hosting/:slug" element={<HostingPlanDetail category="web-hosting" backHref="/web-hosting" backLabel="Back to Web Hosting" />} />
            <Route path="/reseller-hosting" element={<ResellerHosting />} />
            <Route path="/game-servers" element={<GameServers />} />
            <Route path="/game-servers/:gameSlug" element={<GameServerDetail />} />
            <Route path="/vps" element={<VPS />} />
            <Route path="/dedicated" element={<Dedicated />} />
            <Route path="/ddos-protection" element={<DDoSProtection />} />
            <Route path="/ddos-challenge" element={<DDoSChallenge />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/status" element={<Status />} />
            <Route path="/domains" element={<Domains />} />
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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            
            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Admin Panel (Protected) */}
            <Route path="/admin/content" element={<AdminProtectedRoute><KBAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/games" element={<AdminProtectedRoute><GameServerAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/translations" element={<AdminProtectedRoute><TranslationsAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/status" element={<AdminProtectedRoute><StatusAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/visitors" element={<AdminProtectedRoute><VisitorLogs /></AdminProtectedRoute>} />

            {/* Hosting Plans Admin */}
            <Route path="/admin/hosting/web" element={<AdminProtectedRoute><WebHostingAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/reseller" element={<AdminProtectedRoute><ResellerAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/vps" element={<AdminProtectedRoute><VpsAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/dedicated" element={<AdminProtectedRoute><DedicatedAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/domains" element={<AdminProtectedRoute><DomainsAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/discord-bot" element={<AdminProtectedRoute><DiscordBotAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/teamspeak" element={<AdminProtectedRoute><TeamSpeakAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/hosting/colocation" element={<AdminProtectedRoute><ColocationAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/support" element={<AdminProtectedRoute><SupportSettingsAdmin /></AdminProtectedRoute>} />
            <Route path="/admin/services" element={<AdminProtectedRoute><CustomServicesAdmin /></AdminProtectedRoute>} />

            {/* Dynamic Custom Service pages */}
            <Route path="/services/:slug" element={<CustomServicePage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </DDoSGate>
        </BrowserRouter>
      </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
