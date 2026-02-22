import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  Search, Globe, ShieldCheck, Zap, ArrowRight, Check, X,
  RefreshCw, Lock, Server, Headphones, Clock, Star, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { checkDomains } from "@/integrations/api/client";

const popularTLDs = [
  { ext: ".com", price: "€9.99", oldPrice: "€12.99", desc: "Cel mai popular", hot: true },
  { ext: ".ro", price: "€7.99", oldPrice: "€9.99", desc: "România", hot: true },
  { ext: ".eu", price: "€6.99", oldPrice: "€8.99", desc: "Europa", hot: false },
  { ext: ".net", price: "€11.99", oldPrice: "€14.99", desc: "Networking", hot: false },
  { ext: ".org", price: "€10.99", oldPrice: "€13.99", desc: "Organizații", hot: false },
  { ext: ".io", price: "€29.99", oldPrice: "€39.99", desc: "Tech & Startups", hot: true },
  { ext: ".dev", price: "€14.99", oldPrice: "€19.99", desc: "Dezvoltatori", hot: false },
  { ext: ".online", price: "€4.99", oldPrice: "€7.99", desc: "Prezență online", hot: false },
  { ext: ".store", price: "€5.99", oldPrice: "€9.99", desc: "E-commerce", hot: false },
  { ext: ".xyz", price: "€2.99", oldPrice: "€5.99", desc: "Creative", hot: false },
  { ext: ".info", price: "€3.99", oldPrice: "€6.99", desc: "Informativ", hot: false },
  { ext: ".tech", price: "€12.99", oldPrice: "€19.99", desc: "Tehnologie", hot: false },
];

const features = [
  { icon: ShieldCheck, title: "WHOIS Privacy Gratuit", desc: "Protejează-ți datele personale cu WHOIS privacy inclus gratuit la toate domeniile." },
  { icon: Zap, title: "DNS Management Avansat", desc: "Configurare DNS completă cu propagare rapidă și suport A, AAAA, CNAME, MX, TXT, SRV." },
  { icon: Globe, title: "Transfer Simplu", desc: "Transferă domenii de la alți registrari rapid și fără downtime. Suport complet EPP." },
  { icon: Lock, title: "SSL Gratuit", desc: "Certificat SSL Let's Encrypt gratuit cu fiecare domeniu pentru securitate maximă." },
  { icon: RefreshCw, title: "Reînnoire Automată", desc: "Nu mai pierde niciodată un domeniu. Reînnoire automată cu notificări în avans." },
  { icon: Headphones, title: "Suport 24/7", desc: "Echipa noastră de specialiști este disponibilă non-stop pentru asistență." },
];

const faqs = [
  { q: "Cum înregistrez un domeniu?", a: "Caută domeniul dorit în bara de căutare, selectează extensia preferată și finalizează comanda. Domeniul va fi activ în câteva minute." },
  { q: "Pot transfera un domeniu existent?", a: "Da! Oferim transfer gratuit de la orice registrar. Ai nevoie doar de codul EPP/Auth de la registrarul actual." },
  { q: "Ce este WHOIS Privacy?", a: "WHOIS Privacy protejează datele tale personale (nume, adresă, email) din baza de date publică WHOIS. Este inclus gratuit la toate domeniile." },
  { q: "Cât durează activarea unui domeniu?", a: "Domeniile noi sunt activate instant. Pentru transferuri, procesul poate dura 5-7 zile datorită procedurilor standard de transfer." },
  { q: "Pot folosi domeniul cu alt hosting?", a: "Absolut! Domeniul poate fi configurat cu orice provider de hosting prin DNS management-ul nostru avansat." },
];

const stats = [
  { value: "100K+", label: "Domenii Active" },
  { value: "500+", label: "Extensii Disponibile" },
  { value: "99.99%", label: "DNS Uptime" },
  { value: "24/7", label: "Suport Tehnic" },
];

export default function Domains() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ ext: string; price: string; available: boolean }[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setResults(null);
    setSearchError(null);

    // Extract the domain name (without extension if provided)
    const cleaned = searchQuery.replace(/\s+/g, "").toLowerCase();
    const baseName = cleaned.includes(".") ? cleaned.split(".")[0] : cleaned;
    const extensions = [".com", ".ro", ".eu", ".net", ".org", ".io", ".dev", ".online"];
    const domainsToCheck = extensions.map((ext) => `${baseName}${ext}`);

    try {
      const data = await checkDomains(domainsToCheck);

      if (data.results) {
        const priceMap: Record<string, string> = {};
        popularTLDs.forEach((t) => { priceMap[t.ext] = t.price; });

        setResults(
          data.results.map((r) => {
            const ext = "." + r.domain.split(".").slice(1).join(".");
            return {
              ext: r.domain,
              price: priceMap[ext] || "€9.99",
              available: r.status === "available",
            };
          })
        );
      } else {
        setSearchError("Eroare la verificare");
      }
    } catch {
      setSearchError("Nu s-a putut conecta la server. Încearcă din nou.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Domenii Web | Hoxta"
        description="Înregistrează domeniul tău web preferat. Prețuri competitive pentru .com, .ro, .eu și peste 500 de extensii populare."
      />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Globe className="w-4 h-4" />
              Domenii Web Premium
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Domeniul tău{" "}
              <span className="text-primary">perfect</span>
              <br />
              <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl">începe de aici</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Caută din peste 500 de extensii disponibile. WHOIS privacy gratuit, DNS management avansat și suport tehnic 24/7.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-2 p-2 rounded-2xl bg-card/80 border border-border/50 shadow-[0_0_40px_rgba(25,195,255,0.1)]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Caută domeniul dorit... (ex: numele-tau.com)"
                    className="pl-12 h-12 text-base bg-transparent border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(25,195,255,0.3)]"
                  disabled={searching}
                >
                  {searching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Caută
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Extensii populare: <span className="text-foreground/70">.com .ro .eu .net .io .dev .store .tech</span>
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border/30 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-2xl md:text-3xl font-bold text-primary">{s.value}</span>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Error */}
      {searchError && (
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {searchError}
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {results && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12"
          >
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Rezultate pentru „{searchQuery}"
              </h2>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <motion.div
                    key={r.ext}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      r.available
                        ? "bg-card/50 border-emerald-500/20 hover:border-emerald-500/40"
                        : "bg-card/30 border-border/30 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {r.available ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <X className="w-4 h-4 text-red-400" />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-foreground">{r.ext}</span>
                        <span className={cn(
                          "ml-2 text-xs px-2 py-0.5 rounded-full",
                          r.available ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        )}>
                          {r.available ? "Disponibil" : "Indisponibil"}
                        </span>
                      </div>
                    </div>
                    {r.available && (
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold text-lg">{r.price}<span className="text-muted-foreground text-sm font-normal">/an</span></span>
                        <Button size="sm" className="shadow-[0_0_15px_rgba(25,195,255,0.2)]">
                          Înregistrează <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Popular TLDs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Extensii <span className="text-primary">populare</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Alege din cele mai populare extensii de domenii la prețuri imbatabile.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {popularTLDs.map((tld, i) => (
              <motion.div
                key={tld.ext}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="relative p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all text-center group cursor-pointer hover:shadow-[0_0_30px_rgba(25,195,255,0.1)]"
              >
                {tld.hot && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5" /> HOT
                  </span>
                )}
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{tld.ext}</span>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{tld.desc}</p>
                <div>
                  <span className="text-xs text-muted-foreground line-through">{tld.oldPrice}</span>
                  <div>
                    <span className="text-primary font-bold text-lg">{tld.price}</span>
                    <span className="text-muted-foreground text-xs">/an</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/20 border-y border-border/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tot ce ai nevoie, <span className="text-primary">inclus</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fiecare domeniu vine cu un pachet complet de funcționalități premium.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              3 pași <span className="text-primary">simpli</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Caută Domeniul", desc: "Introdu numele dorit în bara de căutare și verifică disponibilitatea instant.", icon: Search },
              { step: "02", title: "Alege & Configurează", desc: "Selectează extensia preferată, adaugă opțiunile dorite și personalizează DNS-ul.", icon: Server },
              { step: "03", title: "Activare Instant", desc: "Finalizează plata și domeniul tău va fi activ în câteva secunde.", icon: Zap },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="text-6xl font-black text-primary/10 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card/20 border-y border-border/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Întrebări <span className="text-primary">frecvente</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-200",
                    openFaq === i && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-10 md:p-16 rounded-3xl bg-gradient-to-br from-primary/10 via-card/50 to-primary/5 border border-primary/20 shadow-[0_0_60px_rgba(25,195,255,0.1)]"
          >
            <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Începe acum cu domeniul tău
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Prețuri de la doar €2.99/an cu WHOIS privacy și SSL gratuit incluse.
            </p>
            <Button
              size="lg"
              className="px-10 h-14 text-base shadow-[0_0_30px_rgba(25,195,255,0.3)]"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Search className="w-5 h-5 mr-2" />
              Caută un domeniu
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
