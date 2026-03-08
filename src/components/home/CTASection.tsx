import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare, Book, Mail, ArrowRight, Zap, Headphones } from "lucide-react";

// REMOVED: The animated canvas network background has been removed.
function StaticBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
    </div>
  );
}

export function CTASection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const disableCta = params?.get("disableCta") === "1";
  if (disableCta) return null;

  const ctaCards = [
    {
      icon: Headphones,
      title: t("common.support247"),
      description: t("sections.ctaSupport247Desc"),
      link: "/contact",
      linkText: t("sections.ctaOpenTicket"),
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      icon: Book,
      title: t("footer.knowledgeBase"),
      description: t("sections.ctaKbDesc"),
      link: "/knowledge-base",
      linkText: t("sections.ctaBrowseArticles"),
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Mail,
      title: t("sections.ctaCustomTitle"),
      description: t("sections.ctaCustomDesc"),
      link: "/contact",
      linkText: t("buttons.contactSales"),
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <StaticBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("buttons.getStarted")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("sections.readyToLevelUp")} <span className="text-primary">{t("sections.levelUp")}</span> {t("sections.readyToLevelUpSuffix")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("sections.readyToLevelUpDesc")}
          </p>
        </motion.div>

        {/* CTA Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {ctaCards.map((card, index) => (
            <div key={card.title}>
              <Link
                to={card.link}
                className="group block h-full p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {card.description}
                </p>
                
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  {card.linkText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/game-servers"
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(25,195,255,0.3)] hover:shadow-[0_0_40px_rgba(25,195,255,0.4)] flex items-center gap-2"
            >
              {t("buttons.browseGames")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl border border-border/50 hover:border-primary/50 text-foreground font-semibold text-lg hover:text-primary transition-all duration-200 flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              {t("buttons.talkToSales")}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            {t("sections.noCardRequired")}
          </p>
        </div>
      </div>
    </section>
  );
}
