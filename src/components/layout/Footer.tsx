import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { brand } from "@/config/brand";
import { HoxtaLogo } from "@/components/HoxtaLogo";
import { useSupportSettings } from "@/hooks/useSupportSettings";
import { MapPin, Clock, MessageCircle, Twitter, Github, Youtube, Instagram } from "lucide-react";

import visaSvg from "@/assets/payments/visa.svg";
import mastercardSvg from "@/assets/payments/mastercard.svg";
import maestroSvg from "@/assets/payments/maestro.svg";
import paypalSvg from "@/assets/payments/paypal.svg";

const paymentMethods = [
  { name: "Visa", src: visaSvg },
  { name: "Mastercard", src: mastercardSvg },
  { name: "Maestro", src: maestroSvg },
  { name: "PayPal", src: paypalSvg },
];

export const Footer = forwardRef<HTMLElement>(function Footer(_props, ref) {
  const { t } = useTranslation();
  const { data: supportSettings } = useSupportSettings();
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <HoxtaLogo size="md" />
            <p className="max-w-md text-sm text-muted-foreground">
              {brand.description}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{brand.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{t("footer.support247")}</span>
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium text-foreground">{t("sections.paymentMethods")}</h5>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.map((method) => (
                  <img
                    key={method.name}
                    src={method.src}
                    alt={method.name}
                    loading="lazy"
                    className="h-7 w-10 rounded-sm opacity-80 transition-opacity hover:opacity-100"
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("footer.company")}
            </h4>
            <div className="space-y-3 text-sm">
              <Link to="/about" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.aboutUs")}</Link>
              <Link to="/contact" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.contact")}</Link>
              <Link to="/blog" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.blog")}</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("footer.hosting")}
            </h4>
            <div className="space-y-3 text-sm">
              <Link to="/web-hosting" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.webHosting")}</Link>
              <Link to="/vps" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.vpsHosting")}</Link>
              <Link to="/dedicated" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.dedicated")}</Link>
              <Link to="/game-servers" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.gameServers")}</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("footer.support")}
            </h4>
            <div className="space-y-3 text-sm">
              <Link to="/knowledge-base" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.knowledgeBase")}</Link>
              <Link to="/status" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.serverStatus")}</Link>
              <Link to="/terms" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.termsOfService")}</Link>
              <Link to="/privacy" className="block text-muted-foreground transition-colors hover:text-primary">{t("footer.privacyPolicy")}</Link>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={supportSettings?.discord_url || brand.socials.discord}
                target="_blank"
                className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={brand.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={brand.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={brand.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright", { year })}</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="transition-colors hover:text-primary">{t("footer.terms")}</Link>
            <Link to="/privacy" className="transition-colors hover:text-primary">{t("footer.privacy")}</Link>
            <Link to="/status" className="transition-colors hover:text-primary">{t("footer.status")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
