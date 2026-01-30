import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { brand } from "@/config/brand";
import { MapPin, Clock, MessageCircle, Twitter, Github, Youtube, Instagram } from "lucide-react";

// Payment method icons as SVG components for clean, themed display
const PaymentIcons = {
  Visa: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <path d="M19.5 11l-2.4 10h-2.6l2.4-10h2.6zm10.9 6.5l1.4-3.7.8 3.7h-2.2zm2.9 3.5h2.4l-2.1-10h-2.2c-.5 0-.9.3-1.1.7l-3.8 9.3h2.7l.5-1.5h3.3l.3 1.5zm-6.7-3.3c0-2.6-3.6-2.8-3.6-3.9 0-.4.3-.7 1.1-.8.4 0 1.4-.1 2.6.5l.5-2.1c-.6-.2-1.5-.5-2.5-.5-2.6 0-4.5 1.4-4.5 3.4 0 1.5 1.3 2.3 2.4 2.8 1 .5 1.4.9 1.4 1.3 0 .7-.8 1-1.6 1-.7 0-2.1-.3-2.7-.6l-.5 2.2c.6.3 1.8.5 3 .5 2.8 0 4.6-1.4 4.6-3.5l-.2-.3zm-11.1-6.7l-4.2 10h-2.8l-2.1-8c-.1-.5-.2-.7-.6-.9-.6-.4-1.7-.7-2.6-.9l.1-.5h4.4c.6 0 1.1.4 1.2 1l1.1 5.8 2.7-6.7h2.8v.2z" className="fill-foreground/80" />
    </svg>
  ),
  Mastercard: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <circle cx="19" cy="16" r="8" className="fill-red-500/70" />
      <circle cx="29" cy="16" r="8" className="fill-yellow-500/70" />
      <path d="M24 10.5a8 8 0 010 11" className="fill-orange-500/70" />
    </svg>
  ),
  Maestro: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <circle cx="19" cy="16" r="8" className="fill-red-500/60" />
      <circle cx="29" cy="16" r="8" className="fill-blue-500/60" />
    </svg>
  ),
  PayPal: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <path d="M19.5 8h5.3c3.5 0 5 1.8 4.6 4.5-.5 3.5-3 5.5-6.3 5.5h-1.4c-.5 0-.9.4-1 .9l-.7 4.1h-3.3l2.8-15zm4.4 7c1.5 0 2.8-1 3-2.5.2-1.3-.6-2-2-2h-1.8l-.8 4.5h1.6z" className="fill-blue-400/80" />
      <path d="M32 11h3.2c2.3 0 3.3 1.2 3 3-.4 2.3-2 3.6-4.2 3.6h-.9c-.3 0-.6.3-.7.6l-.4 2.7h-2.2l2.2-10zm2.9 4.6c1 0 1.8-.7 2-1.6.1-.9-.4-1.4-1.3-1.4h-1.2l-.5 3h1z" className="fill-blue-600/80" />
    </svg>
  ),
  ApplePay: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <path d="M16 10c.7-.8 1.2-2 1-3.2-1 0-2.2.7-2.9 1.5-.7.7-1.2 1.9-1.1 3 1.1.1 2.3-.5 3-1.3zm1 1.5c-1.7-.1-3.1 1-3.9 1s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.5 1-1.4 1.4-2.8 1.4-2.8-.1 0-2.7-1.1-2.8-4.2 0-2.6 2.1-3.9 2.2-4-1.2-1.8-3.1-2-3.7-2-.3 0-.2 0-.3 0z" className="fill-foreground/80" />
      <path d="M29 11v11h1.8v-4.2h2.5c2.3 0 3.9-1.6 3.9-3.9s-1.6-3.9-3.8-3.9H29zm1.8 1.5h2c1.6 0 2.5.9 2.5 2.4s-.9 2.4-2.5 2.4h-2v-4.8z" className="fill-foreground/80" />
    </svg>
  ),
  GooglePay: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <path d="M24 10.5c1.9 0 3.4 1.5 3.4 3.4 0 1.9-1.5 3.4-3.4 3.4s-3.4-1.5-3.4-3.4c0-1.9 1.5-3.4 3.4-3.4zm0 5.4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" className="fill-blue-500/80" />
      <path d="M15.5 13.9c0-.3.2-.5.5-.5h1.3c2.1 0 3.8 1.7 3.8 3.8v3.3c0 .3-.2.5-.5.5h-1.3v-3.8c0-1.3-1-2.3-2.3-2.3H16c-.3 0-.5-.2-.5-.5v-.5z" className="fill-red-500/80" />
      <path d="M32.5 13.9c0-.3-.2-.5-.5-.5h-1.3c-2.1 0-3.8 1.7-3.8 3.8v3.3c0 .3.2.5.5.5h1.3v-3.8c0-1.3 1-2.3 2.3-2.3H32c.3 0 .5-.2.5-.5v-.5z" className="fill-green-500/80" />
      <path d="M24 18.3c-1.1 0-2 .9-2 2v1.2c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-1.2c0-1.1-.9-2-2-2z" className="fill-yellow-500/80" />
    </svg>
  ),
  BankTransfer: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <path d="M24 6l-12 6v2h24v-2l-12-6zm0 2.2l7.5 3.8h-15l7.5-3.8zM14 16v6h3v-6h-3zm6 0v6h3v-6h-3zm6 0v6h3v-6h-3zm6 0v6h3v-6h-3zM12 24v2h24v-2H12z" className="fill-foreground/60" />
    </svg>
  ),
  Crypto: () => (
    <svg viewBox="0 0 48 32" className="w-12 h-8" fill="currentColor">
      <rect width="48" height="32" rx="4" className="fill-muted" />
      <circle cx="24" cy="16" r="9" className="fill-none stroke-yellow-500/70" strokeWidth="1.5" />
      <path d="M24 9v2m0 10v2M21 11h4.5c1.4 0 2.5 1.1 2.5 2.5S26.9 16 25.5 16H21m0 0h5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5H21m0-10v10" className="stroke-yellow-500/70 fill-none" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const paymentMethods = [
  { name: "Visa", Icon: PaymentIcons.Visa },
  { name: "Mastercard", Icon: PaymentIcons.Mastercard },
  { name: "Maestro", Icon: PaymentIcons.Maestro },
  { name: "PayPal", Icon: PaymentIcons.PayPal },
  { name: "Apple Pay", Icon: PaymentIcons.ApplePay },
  { name: "Google Pay", Icon: PaymentIcons.GooglePay },
  { name: "Bank Transfer", Icon: PaymentIcons.BankTransfer },
  { name: "Crypto", Icon: PaymentIcons.Crypto },
];

export function Footer() {
  const { t } = useTranslation();
  
  const footerLinks = {
    services: [
      { label: t("games.minecraft"), href: "/game-servers/minecraft" },
      { label: t("games.rust"), href: "/game-servers/rust" },
      { label: t("games.fivem"), href: "/game-servers/fivem" },
      { label: t("nav.vpsHosting"), href: "/vps" },
      { label: t("nav.webHosting"), href: "/web-hosting" },
      { label: t("common.ddosProtection"), href: "/ddos-protection" },
    ],
    usefulLinks: [
      { label: t("pages.pricing.title"), href: "/pricing" },
      { label: t("footer.status"), href: "/status" },
      { label: t("footer.knowledgeBase"), href: "/knowledge-base" },
      { label: t("footer.contact"), href: "/contact" },
      { label: t("footer.terms"), href: "/terms" },
      { label: t("footer.privacy"), href: "/privacy" },
    ],
    company: [
      { label: t("footer.aboutUs"), href: "/about" },
      { label: t("footer.careers"), href: "/careers" },
      { label: t("footer.blog"), href: "/blog" },
      { label: t("footer.contact"), href: "/contact" },
    ],
  };

  return (
    <footer className="relative bg-background-secondary border-t border-border/50">
      {/* TEMP DEBUG BUILD LABEL (remove after confirmation) */}
      <div className="absolute right-3 top-3 text-[10px] tracking-wider text-muted-foreground/70 select-none">
        BUILD: network-bg-removed-v2
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("sections.services")}</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("sections.usefulLinks")}</h4>
            <ul className="space-y-2">
              {footerLinks.usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("sections.company")}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-foreground">Ho</span>
              <span className="text-2xl font-bold text-primary">x</span>
              <span className="text-2xl font-bold text-foreground">ta</span>
            </Link>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{brand.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>{t("footer.support247")}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-foreground mb-3">{t("sections.paymentMethods")}</h5>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="group relative transition-all duration-200 hover:scale-105"
                    title={method.name}
                  >
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                      <method.Icon />
                    </div>
                    <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 blur-sm -z-10" />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={brand.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. {t("common.allRightsReserved")}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.terms")}
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link to="/status" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.status")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
