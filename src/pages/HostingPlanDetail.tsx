import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Check, ArrowLeft, Cpu, MemoryStick, HardDrive, Wifi, Globe2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/seo";
import type { HostingPlanRow } from "@/hooks/useHostingPlans";

interface Props {
  category: string;
  backHref: string;
  backLabel: string;
}

export default function HostingPlanDetail({ category, backHref, backLabel }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<HostingPlanRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("hosting_plans")
      .select("*")
      .eq("category", category)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPlan((data as HostingPlanRow) || null);
        setLoading(false);
      });
  }, [slug, category]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="h-8 w-64 bg-muted/40 rounded animate-pulse mb-6" />
          <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Plan not found</h1>
          <button onClick={() => navigate(backHref)} className="text-primary hover:underline">
            ← {backLabel}
          </button>
        </div>
      </Layout>
    );
  }

  const orderHref = plan.order_url || `/order?product=${plan.slug}&billing=monthly`;
  const isExternalOrder = !!plan.order_url && /^https?:\/\//i.test(plan.order_url);
  const specs = [
    { icon: Cpu, label: "CPU", value: plan.cpu },
    { icon: MemoryStick, label: "RAM", value: plan.ram },
    { icon: HardDrive, label: "Storage", value: plan.storage },
    { icon: Wifi, label: "Bandwidth", value: plan.bandwidth },
    { icon: Globe2, label: "OS", value: plan.os },
  ].filter((s) => s.value);

  const faqs = (Array.isArray(plan.faqs) ? plan.faqs : []) as { question: string; answer: string }[];

  return (
    <Layout>
      <SEOHead
        title={`${plan.name} - ${plan.short_description || "Hosting Plan"} | Hoxta`}
        description={plan.short_description || plan.full_description.slice(0, 155)}
      />

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <Link to={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <header>
              {plan.tags && plan.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{plan.name}</h1>
              {plan.short_description && (
                <p className="text-lg text-muted-foreground">{plan.short_description}</p>
              )}
            </header>

            {plan.hero_points && plan.hero_points.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-3">
                {plan.hero_points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            {plan.full_description && (
              <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown>{plan.full_description}</ReactMarkdown>
              </article>
            )}

            {plan.features && plan.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">What's included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">FAQ</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24 space-y-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${Number(plan.price_value).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {plan.pricing_display && plan.pricing_display !== `$${Number(plan.price_value).toFixed(2)}/mo` && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.pricing_display}</p>
                )}
              </div>

              {specs.length > 0 && (
                <ul className="space-y-3 border-t border-border/40 pt-4">
                  {specs.map((s) => (
                    <li key={s.label} className="flex items-center gap-3 text-sm">
                      <s.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="ml-auto text-foreground font-medium">{s.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.locations && plan.locations.length > 0 && (
                <div className="border-t border-border/40 pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Locations</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.locations.map((l) => (
                      <span key={l} className="text-xs px-2 py-1 rounded bg-muted/50 text-foreground">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isExternalOrder ? (
                <a
                  href={orderHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow block w-full py-3 text-center font-semibold"
                >
                  Order Now
                </a>
              ) : (
                <Link to={orderHref} className="btn-glow block w-full py-3 text-center font-semibold">
                  Order Now
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
