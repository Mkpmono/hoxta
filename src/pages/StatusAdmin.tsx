import { Layout } from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StatusAdmin() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="glass-card p-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Status Admin</h1>
            <p className="text-muted-foreground mb-6">
              Status monitor management is available through your server admin panel.
            </p>
            <Link to="/status">
              <Button variant="outline">← Back to Status Page</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
