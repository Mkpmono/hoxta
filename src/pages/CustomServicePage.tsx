import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as LucideIcons from "lucide-react";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useCustomService } from "@/hooks/useCustomServices";
import { SEOHead } from "@/components/seo/SEOHead";
import NotFound from "@/pages/NotFound";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function getLocalized<T = any>(service: any, lang: string, field: string, fallback: T): T {
  const t = service?.translations?.[lang];
  if (t && t[field] !== undefined && t[field] !== null && t[field] !== "") return t[field] as T;
  return fallback;
}

function getLocalizedSections(service: any, lang: string) {
  const t = service?.translations?.[lang]?.sections;
  return t || service?.sections || {};
}

function ResolveIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon =
    (name && (LucideIcons as any)[name]) ||
    (LucideIcons as any).Sparkles ||
    Sparkles;
  return <Icon className={className} />;
}

export default function CustomServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const { service, loading, notFound } = useCustomService(slug);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">
          Loading…
        </div>
      </Layout>
    );
  }

  if (notFound || !service) return <NotFound />;

  const lang = i18n.language || "en";
  const name = getLocalized(service, lang, "name", service.name);
  const shortDesc = getLocalized(service, lang, "short_description", service.short_description || "");
  const sections = getLocalizedSections(service, lang);

  const hero = sections.hero || {};
  const features = sections.features || {};
  const plans = sections.plans || {};
  const content = sections.content || {};
  const faq = sections.faq || {};
  const cta = sections.cta || {};

  return (
    <Layout>
      <SEOHead
        title={`${name} | Hoxta`}
        description={shortDesc || hero.subtitle || ""}
      />

      {/* Hero */}
      {hero.enabled !== false && (
        <section className="relative pt-32 pb-20 overflow-hidden">
          {service.cover_image_url && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${service.cover_image_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary mb-6">
                <ResolveIcon name={service.menu_icon} className="w-3.5 h-3.5" />
                {service.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {hero.title || name}
              </h1>
              {(hero.subtitle || shortDesc) && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                  {hero.subtitle || shortDesc}
                </p>
              )}
              {hero.ctaLabel && (
                <Link
                  to={hero.ctaUrl || "/order"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(25,195,255,0.3)]"
                >
                  {hero.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.enabled !== false && features.items && features.items.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            {features.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                {features.title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.items.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <ResolveIcon name={f.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  {f.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plans */}
      {plans.enabled !== false && plans.items && plans.items.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            {plans.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                {plans.title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.items.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl bg-white/[0.02] border transition-all ${
                    p.popular
                      ? "border-primary/50 shadow-[0_0_40px_rgba(25,195,255,0.15)]"
                      : "border-white/[0.05] hover:border-primary/30"
                  }`}
                >
                  {p.popular && (
                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-4">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{p.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{p.price}</div>
                  {p.description && (
                    <p className="text-sm text-muted-foreground mb-6">{p.description}</p>
                  )}
                  {p.features && p.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {p.features.map((feat: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to={p.ctaUrl || "/order"}
                    className="block w-full text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                  >
                    Order Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content (markdown rendered as plain whitespace text) */}
      {content.enabled && content.markdown && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            {content.title && (
              <h2 className="text-3xl font-bold text-foreground mb-6">{content.title}</h2>
            )}
            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
              {content.markdown}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.enabled !== false && faq.items && faq.items.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            {faq.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                {faq.title}
              </h2>
            )}
            <Accordion type="single" collapsible className="space-y-3">
              {faq.items.map((q: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border border-white/[0.05] bg-white/[0.02] rounded-xl px-5"
                >
                  <AccordionTrigger className="text-foreground hover:no-underline">
                    {q.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {q.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta.enabled !== false && (cta.title || cta.ctaLabel) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto p-10 md:p-14 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {cta.title || "Ready to start?"}
              </h2>
              {cta.subtitle && (
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{cta.subtitle}</p>
              )}
              <Link
                to={cta.ctaUrl || "/order"}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(25,195,255,0.3)]"
              >
                {cta.ctaLabel || "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
