import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { Link } from "react-router-dom";
import { ChevronRight, Target, Eye } from "lucide-react";
import { useEditablePage } from "@/hooks/useEditablePage";
import { DEFAULT_ABOUT, PageIcon } from "@/data/editablePagesDefaults";
import { useTranslation } from "react-i18next";

export default function About() {
  const c = useEditablePage("about", DEFAULT_ABOUT);
  const { t } = useTranslation();

  return (
    <Layout>
      <SEOHead
        title={`${c.titlePart1} — ${c.titlePart2} | Hoxta Hosting`}
        description={c.subtitle}
        canonicalUrl="/about"
      />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
              {c.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {c.titlePart1}<br />
              <span className="text-gradient">{c.titlePart2}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {c.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {c.stats.map((stat, i) => (
              <div key={i} className="relative group glass-card p-6 md:p-8 text-center overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <PageIcon name={stat.icon} className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8 md:p-10 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{c.missionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{c.missionText}</p>
            </div>
            <div className="glass-card p-8 md:p-10 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{c.visionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{c.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{c.valuesTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{c.valuesSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.values.map((v, i) => (
              <div key={i} className="glass-card p-6 md:p-7 group hover:border-primary/30 transition-all duration-300">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <PageIcon name={v.icon} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{c.timelineTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{c.timelineSubtitle}</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:-translate-x-px" />
            <div className="space-y-10">
              {c.timeline.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1.5 md:-translate-x-1.5 top-1 z-10 shadow-[0_0_10px_rgba(25,195,255,0.5)]" />
                  <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
                      <span className="text-primary font-bold text-sm">{item.year}</span>
                      <h3 className="text-lg font-semibold text-foreground mt-1 mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/game-servers" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">
                {t("buttons.exploreServices")}
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-200">
                {t("nav.contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
