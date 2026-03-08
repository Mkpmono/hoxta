import { Layout } from "@/components/layout/Layout";
import { Users, Award, Globe, Zap, Shield, Server, HeartHandshake, Cpu, Clock, MapPin, Headphones, Rocket, ChevronRight, Target, Eye, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: "10,000+", label: t("pages.about.activeCustomers"), color: "from-cyan-500/20 to-blue-500/20" },
    { icon: Award, value: "99.9%", label: t("pages.about.uptimeSla"), color: "from-emerald-500/20 to-cyan-500/20" },
    { icon: Globe, value: "5", label: t("pages.about.dataCenters"), color: "from-blue-500/20 to-indigo-500/20" },
    { icon: Zap, value: "24/7", label: t("pages.about.expertSupport"), color: "from-amber-500/20 to-orange-500/20" },
  ];

  const timeline = [
    { year: "2022", title: t("pages.about.founded"), desc: t("pages.about.foundedDesc") },
    { year: "2023", title: t("pages.about.thousandClients"), desc: t("pages.about.thousandClientsDesc") },
    { year: "2024", title: t("pages.about.europeanExpansion"), desc: t("pages.about.europeanExpansionDesc") },
    { year: "2025", title: t("pages.about.tenThousandClients"), desc: t("pages.about.tenThousandClientsDesc") },
    { year: "2026", title: t("pages.about.nextChapter"), desc: t("pages.about.nextChapterDesc") },
  ];

  const values = [
    { icon: Shield, title: t("pages.about.securityFirst"), desc: t("pages.about.securityFirstDesc") },
    { icon: Cpu, title: t("pages.about.highPerformance"), desc: t("pages.about.highPerformanceDesc") },
    { icon: HeartHandshake, title: t("pages.about.clientFocused"), desc: t("pages.about.clientFocusedDesc") },
    { icon: Clock, title: t("pages.about.instantDeployment"), desc: t("pages.about.instantDeploymentDesc") },
    { icon: Headphones, title: t("pages.about.expertSupportValue"), desc: t("pages.about.expertSupportValueDesc") },
    { icon: Rocket, title: t("pages.about.alwaysInnovating"), desc: t("pages.about.alwaysInnovatingDesc") },
  ];

  const teamHighlights = [
    { icon: MapPin, label: t("pages.about.basedIn") },
    { icon: Globe, label: t("pages.about.servingClients") },
    { icon: Server, label: t("pages.about.managingDC") },
    { icon: Headphones, label: t("pages.about.multilingualSupport") },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
              {t("pages.about.title")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("pages.about.premiumHosting")}<br />
              <span className="text-gradient">{t("pages.about.builtForPerformance")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("pages.about.heroDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="relative group glass-card p-6 md:p-8 text-center overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
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
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t("pages.about.ourMission")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("pages.about.missionText")}</p>
              </div>
            </div>
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t("pages.about.ourVision")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("pages.about.visionText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("pages.about.whatDrivesUs")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("pages.about.whatDrivesUsDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="glass-card p-6 md:p-7 group hover:border-primary/30 transition-all duration-300">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("pages.about.ourJourney")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("pages.about.ourJourneyDesc")}</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:-translate-x-px" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1.5 md:-translate-x-1.5 top-1 z-10 shadow-[0_0_10px_rgba(25,195,255,0.5)]" />
                  <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
                      <span className="text-primary font-bold text-sm">{item.year}</span>
                      <h3 className="text-lg font-semibold text-foreground mt-1 mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team / Company Info */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Gem className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("pages.about.whoWeAre")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{t("pages.about.whoWeAreDesc1")}</p>
                <p className="text-muted-foreground leading-relaxed">{t("pages.about.whoWeAreDesc2")}</p>
              </div>
              <div className="space-y-4">
                {teamHighlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <h.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("pages.about.readyToGetStarted")}</h2>
            <p className="text-muted-foreground mb-8">{t("pages.about.joinThousands")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/game-servers" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(25,195,255,0.3)] hover:shadow-[0_0_30px_rgba(25,195,255,0.5)]">
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
