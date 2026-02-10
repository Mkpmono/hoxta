import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <div className="glass-card p-8 space-y-6">
              <p className="text-muted-foreground mb-2">Last updated: 10 February 2026</p>
              <p className="text-muted-foreground">
                This Privacy Policy describes how Hoxta ("Company", "we", "us", "our") collects, uses, stores, and protects personal data when you ("User", "Client", "you") use our website or services.
              </p>
              <p className="text-muted-foreground">We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Data Controller</h2>
              <p className="text-muted-foreground">Hoxta is the data controller responsible for processing your personal data.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Data We Collect</h2>
              <p className="text-muted-foreground">We may collect and process the following personal data:</p>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">a) Account & Billing Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Name / company name</li>
                <li>Email address</li>
                <li>Billing address</li>
                <li>VAT number (if applicable)</li>
                <li>Payment status (no full card data)</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">b) Technical Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Access logs</li>
                <li>Date and time of access</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">c) Service Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Hosted content (controlled entirely by you)</li>
                <li>Service usage data (CPU, RAM, bandwidth)</li>
                <li>Support communications</li>
              </ul>
              <p className="text-muted-foreground font-semibold mt-2">⚠️ We do NOT inspect or monitor hosted content unless legally required.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Purpose of Data Processing</h2>
              <p className="text-muted-foreground">Your data is processed for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Service provisioning and administration</li>
                <li>Billing and payment processing</li>
                <li>Security, abuse prevention, and fraud detection</li>
                <li>Legal compliance</li>
                <li>Customer support and communication</li>
              </ul>
              <p className="text-muted-foreground font-semibold mt-2">We do NOT sell, rent, or trade your personal data.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Legal Basis for Processing</h2>
              <p className="text-muted-foreground">We process personal data based on:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Contractual necessity (service delivery)</li>
                <li>Legal obligations (accounting, law enforcement)</li>
                <li>Legitimate interest (security, abuse prevention)</li>
                <li>Consent, where explicitly required</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground">We retain personal data only as long as necessary:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Active accounts → duration of service</li>
                <li>Billing records → as required by law</li>
                <li>Logs → limited retention for security purposes</li>
              </ul>
              <p className="text-muted-foreground mt-2">After termination, data may be permanently deleted without notice.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Data Sharing & Third Parties</h2>
              <p className="text-muted-foreground">We may share limited data with:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Payment processors</li>
                <li>Infrastructure providers (datacenters, network providers)</li>
                <li>Legal authorities, if required by law</li>
              </ul>
              <p className="text-muted-foreground mt-2">All third parties are required to comply with GDPR.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. International Data Transfers</h2>
              <p className="text-muted-foreground">Your data may be processed in data centers located within or outside the EU.</p>
              <p className="text-muted-foreground">When data is transferred outside the EU, we ensure appropriate safeguards are in place.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Cookies</h2>
              <p className="text-muted-foreground">We use essential cookies only, necessary for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Authentication</li>
                <li>Security</li>
                <li>Session management</li>
              </ul>
              <p className="text-muted-foreground mt-2">We do NOT use tracking or advertising cookies by default.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">9. Data Security</h2>
              <p className="text-muted-foreground">We implement appropriate technical and organizational measures, including:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Access controls</li>
                <li>Secure infrastructure</li>
                <li>Encrypted communications (SSL/TLS)</li>
              </ul>
              <p className="text-muted-foreground font-semibold mt-2">⚠️ No system is 100% secure. We cannot guarantee absolute security.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">10. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion ("right to be forgotten")</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="text-muted-foreground mt-2">Requests must be sent to: <a href="mailto:support@hoxta.com" className="text-primary hover:underline">support@hoxta.com</a></p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">11. User Responsibilities</h2>
              <p className="text-muted-foreground">You are responsible for ensuring that any personal data you host or process through our services complies with applicable data protection laws.</p>
              <p className="text-muted-foreground">Hoxta acts as a data processor for hosted content.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">12. Limitation of Liability</h2>
              <p className="text-muted-foreground">To the maximum extent permitted by law, Hoxta shall not be liable for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Data loss caused by user actions</li>
                <li>Security incidents beyond reasonable control</li>
                <li>Content hosted by clients</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">13. Changes to This Policy</h2>
              <p className="text-muted-foreground">We reserve the right to update this Privacy Policy at any time.</p>
              <p className="text-muted-foreground">Continued use of our services constitutes acceptance of the updated policy.</p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">14. Contact</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries:<br /><br />
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
