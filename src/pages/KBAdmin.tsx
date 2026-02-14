import { Layout } from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function KBAdmin() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="glass-card p-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground mb-6">
              Knowledge Base and Blog management is available through your WHMCS admin panel or cPanel.
            </p>
            <Link to="/knowledge-base">
              <Button variant="outline">← Back to Knowledge Base</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
