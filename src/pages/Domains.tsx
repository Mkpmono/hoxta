import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Search, Globe, ShieldCheck, Zap, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const popularTLDs = [
  { ext: ".com", price: "€9.99", desc: "Cel mai popular" },
  { ext: ".ro", price: "€7.99", desc: "România" },
  { ext: ".eu", price: "€6.99", desc: "Europa" },
  { ext: ".net", price: "€11.99", desc: "Networking" },
  { ext: ".org", price: "€10.99", desc: "Organizații" },
  { ext: ".io", price: "€29.99", desc: "Tech & Startups" },
  { ext: ".dev", price: "€14.99", desc: "Dezvoltatori" },
  { ext: ".online", price: "€4.99", desc: "Prezență online" },
];

const features = [
  { icon: ShieldCheck, title: "WHOIS Privacy Gratuit", desc: "Protejează-ți datele personale cu WHOIS privacy inclus gratuit." },
  { icon: Zap, title: "DNS Management", desc: "Configurare DNS completă cu propagare rapidă și suport pentru toate tipurile de înregistrări." },
  { icon: Globe, title: "Transfer Ușor", desc: "Transferă domenii de la alți registrari rapid și fără downtime." },
];

export default function Domains() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<typeof popularTLDs | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    // Simulate search results
    setTimeout(() => {
      const domain = searchQuery.replace(/\s+/g, "").toLowerCase().split(".")[0];
      setResults(
        popularTLDs.map((tld) => ({
          ...tld,
          ext: `${domain}${tld.ext}`,
        }))
      );
      setSearching(false);
    }, 800);
  };

  return (
    <Layout>
      <SEOHead
        title="Domenii Web | Hoxta"
        description="Înregistrează domeniul tău web preferat. Prețuri competitive pentru .com, .ro, .eu și alte extensii populare."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              Domenii Web
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Găsește domeniul{" "}
              <span className="text-primary">perfect</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Caută și înregistrează domeniul ideal pentru proiectul tău. Prețuri competitive, WHOIS privacy gratuit și management DNS complet.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Caută domeniul dorit... (ex: numele-tau)"
                  className="pl-12 h-14 text-base bg-card/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 shadow-[0_0_20px_rgba(25,195,255,0.3)]"
                disabled={searching}
              >
                {searching ? "Se caută..." : "Caută"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {results && (
        <section className="pb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Rezultate disponibile</h2>
            <div className="space-y-3">
              {results.map((r, i) => (
                <motion.div
                  key={r.ext}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium text-foreground">{r.ext}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">{r.price}<span className="text-muted-foreground text-sm font-normal">/an</span></span>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      Adaugă <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular TLDs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Extensii <span className="text-primary">populare</span>
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Alege din cele mai populare extensii de domenii la prețuri competitive.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {popularTLDs.map((tld, i) => (
              <motion.div
                key={tld.ext}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all text-center group cursor-pointer"
              >
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{tld.ext}</span>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{tld.desc}</p>
                <span className="text-primary font-bold text-lg">{tld.price}</span>
                <span className="text-muted-foreground text-xs">/an</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card/50 border border-border/50 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
