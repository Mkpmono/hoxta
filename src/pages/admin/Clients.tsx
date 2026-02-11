import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { apiClient } from "@/services/apiClient";
import { Loader2 } from "lucide-react";

export default function AdminClients() {
  // Note: WHMCS doesn't have a direct "list all clients" API accessible from client-side.
  // This page will show a placeholder until admin-specific endpoints are implemented.
  
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-6">Clients</h1>
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">Client management is available through the WHMCS admin panel.</p>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
