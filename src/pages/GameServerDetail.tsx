import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap, Globe, Settings, HardDrive, Clock, Check, Server } from "lucide-react";
import { gameServers } from "@/data/gameServersData";
import { getProductBySlug, getPlanPrice } from "@/data/products";
import { useGameServerBySlug } from "@/hooks/useGameServers";
import {
  HostingHero,
  TrustBar,
  PricingPlans,
  FeatureGrid,
  HowItWorks,
  GlobalInfrastructure,
  FAQAccordion,
  FinalCTA,
  CrossSellBlock,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

export default function GameServerDetail() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const { t } = useTranslation();
  const { game: dbGame, loading: dbLoading } = useGameServerBySlug(gameSlug);

  // Try DB first, fallback to static
  const staticGame = gameServers.find((g) => g.slug === gameSlug);

  if (dbLoading) {
    return <Layout><section className="pt-32 pb-20"><div className="container mx-auto px-4 text-center"><p className="text-muted-foreground">Loading...</p></div></section></Layout>;
  }

  // Build a unified game object from DB or static
  const game = dbGame ? {
    id: dbGame.slug,
    slug: dbGame.slug,
    title: dbGame.title,
    coverImage: dbGame.cover_image_url || "",
    pricingDisplay: dbGame.pricing_display,
    priceValue: Number(dbGame.price_value),
    pricingUnit: dbGame.pricing_unit as any,
    shortDescription: dbGame.short_description,
    fullDescription: dbGame.full_description,
    tags: dbGame.tags || [],
    category: dbGame.category as any,
    os: dbGame.os as any,
    popular: dbGame.popular,
    features: dbGame.features || [],
    plans: dbGame.plans || [],
    faqs: dbGame.faqs || [],
    heroPoints: dbGame.hero_points || [],
  } : staticGame;

  if (!game) {
    return <Navigate to="/game-servers" replace />;
  }

  // Try products.ts for checkout-compatible plans, fallback to game's own plans
  const product = getProductBySlug(game.slug);
  
  const plans = product
    ? product.plans.map((p) => ({
        id: p.id,
        productSlug: product.slug,
        name: p.name,
        description: p.description,
        monthlyPrice: getPlanPrice(p, "monthly"),
        yearlyPrice: getPlanPrice(p, "annually"),
        popular: p.popular || false,
        features: p.features.map((f) => ({
          label: f.label,
          value: typeof f.value === "boolean" ? f.value : String(f.value),
        })),
      }))
    : (game.plans || []).map((p: any, i: number) => ({
        id: `${game.slug}-plan-${i}`,
        productSlug: game.slug,
        name: p.name || `Plan ${i + 1}`,
        description: p.ram ? `${p.ram} RAM` : undefined,
        monthlyPrice: p.price || 0,
        yearlyPrice: (p.price || 0) * 10,
        popular: p.popular || false,
        features: (p.features || []).map((f: string) => ({ label: f, value: true })),
      }));

  // Build feature grid from game features
  const featureIcons = [Settings, Shield, HardDrive, Clock, Zap, Globe, Server, Check];
  const features = game.features.slice(0, 8).map((feature, index) => ({
    icon: featureIcons[index % featureIcons.length],
    title: feature,
    description: `Professional ${feature.toLowerCase()} included with your ${game.title} server.`,
  }));

  return (
    <Layout>
      {/* SEO */}
      <SEOHead
        title={`${game.title} Server Hosting - Instant Setup | Hoxta`}
        description={`${game.fullDescription.slice(0, 150)}... Starting at $${game.plans[0]?.price || game.priceValue}/month.`}
        canonicalUrl={`https://hoxta.com/game-servers/${game.slug}`}
      />
      <ServiceSchema
        name={`Hoxta ${game.title} Server Hosting`}
        description={game.fullDescription}
        priceRange={`$${game.plans[0]?.price || game.priceValue} - $${game.plans[game.plans.length - 1]?.price || game.priceValue * 10}`}
      />
      <FAQSchema faqs={game.faqs} />
      <OrganizationSchema />

      {/* Hero */}
      <HostingHero
        badge={`${game.title} Servers`}
        headline={
          <>
            {game.title}{" "}
            <span className="text-gradient">Server Hosting</span>
          </>
        }
        description={game.fullDescription}
        primaryCTA={{ text: t("buttons.getStarted"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.viewPlans"), href: "#features" }}
      />

      {/* Key Benefits */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {game.heroPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Pricing Plans - Pass productSlug for billing toggle URL generation */}
      <div id="pricing">
        <PricingPlans
          title={`${game.title} Server Plans`}
          subtitle={`Choose the perfect ${game.title} server plan for your community.`}
          plans={plans}
          productSlug={game.slug}
          category="games"
        />
      </div>

      {/* Feature Grid */}
      <div id="features">
        <FeatureGrid
          title={`${game.title} Server Features`}
          subtitle={`Everything you need for the ultimate ${game.title} experience.`}
          features={features}
        />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Tags Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Infrastructure */}
      <GlobalInfrastructure />

      {/* Cross-sell */}
      <CrossSellBlock
        headline="Need More Power?"
        description={`Running a large ${game.title} community? Consider upgrading to a VPS for dedicated resources and unlimited customization.`}
        benefits={["Dedicated CPU & RAM", "Full root access", "Custom configurations"]}
        ctaText="Explore VPS Options"
        ctaHref="/vps"
        icon={Server}
      />

      {/* FAQ */}
      <FAQAccordion
        title={`${game.title} Server FAQ`}
        subtitle={`Common questions about ${game.title} server hosting.`}
        items={game.faqs}
      />

      {/* Final CTA */}
      <FinalCTA
        title={`Ready to Play ${game.title}?`}
        subtitle={`Deploy your ${game.title} server in minutes with instant setup and 24/7 support.`}
      />
    </Layout>
  );
}
