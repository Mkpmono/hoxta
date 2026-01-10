import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
