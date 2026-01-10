import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { ChooseGameSection } from "@/components/home/ChooseGameSection";
import { AntiDDoSSection } from "@/components/home/AntiDDoSSection";
import { TrustSection } from "@/components/home/TrustSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyChooseSection />
      <ChooseGameSection />
      <AntiDDoSSection />
      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
