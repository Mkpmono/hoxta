import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <div className="glass-card p-8 prose prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") constitute a legally binding agreement between Hoxta ("Company", "we", "us", "our") and any individual or entity ("Client", "you") using our services.
              </p>
              <p className="text-muted-foreground">
                By accessing, ordering, or using any Hoxta service, you confirm that you have read, understood, and agreed to these Terms in full.
              </p>
              <p className="text-muted-foreground font-semibold">
                If you do not agree, you must immediately discontinue use of our services.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Services</h2>
              <p className="text-muted-foreground">Hoxta provides web hosting, VPS, dedicated servers, domains, and related infrastructure services ("Services").</p>
              <p className="text-muted-foreground">All Services are provided "as is" and "as available", without warranties of any kind, unless explicitly stated in writing.</p>
              <p className="text-muted-foreground">Hoxta reserves the exclusive right to modify, upgrade, suspend, or discontinue any Service at any time.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Eligibility</h2>
              <p className="text-muted-foreground">You must be at least 18 years old and legally capable of entering into a binding agreement.</p>
              <p className="text-muted-foreground">You are solely responsible for ensuring that your use of the Services complies with all applicable local, national, and international laws.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Client Responsibilities</h2>
              <p className="text-muted-foreground">You agree that you will <strong>NOT</strong> use Hoxta Services for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Any illegal activity</li>
                <li>Malware, ransomware, botnets, phishing, fraud, hacking</li>
                <li>Copyright or trademark infringement</li>
                <li>Spam or unsolicited bulk messaging</li>
                <li>Abuse of system resources</li>
                <li>Activities that may damage Hoxta's infrastructure, reputation, or other clients</li>
              </ul>
              <p className="text-muted-foreground mt-4">You are fully and exclusively responsible for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All content hosted on your account</li>
                <li>All actions performed through your services</li>
                <li>Account security and credentials</li>
                <li>Compliance with laws and regulations</li>
                <li>Maintaining independent backups of your data</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Resource Usage & Fair Use</h2>
              <p className="text-muted-foreground">All Services include defined resource limits (CPU, RAM, disk, bandwidth, inodes, etc.).</p>
              <p className="text-muted-foreground">If your usage exceeds allocated limits, impacts server stability, or affects other clients, Hoxta may restrict, throttle, suspend, or terminate the service immediately and without prior notice.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Backups & Data</h2>
              <p className="text-muted-foreground">Hoxta may provide backups as a courtesy only.</p>
              <p className="text-muted-foreground font-semibold">⚠️ Backups are NOT guaranteed. You acknowledge that Hoxta is not responsible for data loss under any circumstances.</p>
              <p className="text-muted-foreground">The Client remains solely responsible for maintaining independent backups.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Payments & Billing</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All services are billed in advance</li>
                <li>Prices may change at any time</li>
                <li>Late or failed payments may result in automatic suspension</li>
                <li>Hoxta reserves the right to terminate unpaid services</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Refund Policy</h3>
              <p className="text-muted-foreground">Unless explicitly stated otherwise:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All payments are non-refundable</li>
                <li>Partial periods are not refunded</li>
                <li>Abuse-related suspensions are never refundable</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Suspension & Termination</h2>
              <p className="text-muted-foreground">Hoxta reserves the right to immediately suspend or terminate services, without notice, if:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>These Terms are violated</li>
                <li>Abuse or illegal activity is detected</li>
                <li>Payment obligations are not met</li>
                <li>Required by law or authorities</li>
                <li>Infrastructure or security is at risk</li>
              </ul>
              <p className="text-muted-foreground mt-4">Upon termination:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All data may be permanently deleted</li>
                <li>Hoxta has no obligation to provide data recovery</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">To the maximum extent permitted by law, Hoxta shall NOT be liable for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Data loss</li>
                <li>Downtime or service interruptions</li>
                <li>Loss of revenue, profit, or business</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
              <p className="text-muted-foreground mt-4">If liability is established, total liability shall not exceed the amount paid by the Client in the last 30 days.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">9. No Service Level Agreement (SLA)</h2>
              <p className="text-muted-foreground">Unless a written SLA is explicitly agreed upon:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>No uptime guarantee is provided</li>
                <li>Scheduled or emergency maintenance is acceptable</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">10. Indemnification</h2>
              <p className="text-muted-foreground">You agree to fully indemnify and hold harmless Hoxta, its owners, employees, and partners from any claims, damages, losses, or legal expenses arising from:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Your use of the Services</li>
                <li>Your hosted content</li>
                <li>Violations of law or third-party rights</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">11. Intellectual Property</h2>
              <p className="text-muted-foreground">All Hoxta infrastructure, software, branding, and configurations remain the exclusive property of Hoxta.</p>
              <p className="text-muted-foreground">You may not copy, resell, or reverse-engineer any part of the Services.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">12. Third-Party Services</h2>
              <p className="text-muted-foreground">Hoxta may rely on third-party providers.</p>
              <p className="text-muted-foreground">Hoxta is not responsible for failures, changes, or interruptions caused by third parties.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">13. Governing Law & Jurisdiction</h2>
              <p className="text-muted-foreground">These Terms are governed by the laws of the European Union and the laws of the country in which Hoxta operates.</p>
              <p className="text-muted-foreground">Any disputes shall be resolved exclusively in the competent courts of that jurisdiction.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">14. Changes to Terms</h2>
              <p className="text-muted-foreground">Hoxta may update these Terms at any time.</p>
              <p className="text-muted-foreground">Continued use of the Services constitutes binding acceptance of the updated Terms.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">15. Contact</h2>
              <p className="text-muted-foreground">
                Hoxta<br />
                📧 Email: <a href="mailto:support@hoxta.com" className="text-primary hover:underline">support@hoxta.com</a><br />
                🌐 Website: <a href="https://hoxta.com" className="text-primary hover:underline">https://hoxta.com</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
