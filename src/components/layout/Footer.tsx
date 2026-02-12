import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { brand } from "@/config/brand";
import { HoxtaLogo } from "@/components/HoxtaLogo";
import { MapPin, Clock, MessageCircle, Twitter, Github, Youtube, Instagram } from "lucide-react";

// Payment icon images
import visaSvg from "@/assets/payments/visa.svg";
import mastercardSvg from "@/assets/payments/mastercard.svg";
import maestroSvg from "@/assets/payments/maestro.svg";
import paypalSvg from "@/assets/payments/paypal.svg";

const paymentCategories = [
  {
    label: "Cards",
    methods: [
      { name: "Visa", src: visaSvg },
      { name: "Mastercard", src: mastercardSvg },
      { name: "Maestro", src: maestroSvg },
      {
        name: "Amex",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="#006FCF" />
            <text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
          </svg>
        ),
      },
      {
        name: "Discover",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <text x="24" y="18" textAnchor="middle" fill="#1A1A1A" fontSize="7" fontWeight="bold" fontFamily="Arial">DISCOVER</text>
            <circle cx="36" cy="16" r="5" fill="#FF6600" opacity="0.8" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Digital Wallets",
    methods: [
      { name: "PayPal", src: paypalSvg },
      {
        name: "Apple Pay",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="#1A1A1A" />
            <text x="24" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="Arial"> Pay</text>
          </svg>
        ),
      },
      {
        name: "Google Pay",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <text x="24" y="19" textAnchor="middle" fill="#5F6368" fontSize="7" fontWeight="600" fontFamily="Arial">G Pay</text>
          </svg>
        ),
      },
      {
        name: "Skrill",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <text x="24" y="19" textAnchor="middle" fill="#862165" fontSize="8" fontWeight="bold" fontFamily="Arial">Skrill</text>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Crypto",
    methods: [
      {
        name: "Bitcoin",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <circle cx="24" cy="16" r="10" fill="#F7931A" />
            <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">₿</text>
          </svg>
        ),
      },
      {
        name: "Ethereum",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <polygon points="24,5 32,17 24,22 16,17" fill="#627EEA" opacity="0.9" />
            <polygon points="24,22 32,17 24,27 16,17" fill="#627EEA" opacity="0.6" />
          </svg>
        ),
      },
      {
        name: "Litecoin",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <circle cx="24" cy="16" r="10" fill="#A6A9AA" />
            <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">Ł</text>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Other",
    methods: [
      {
        name: "Stripe",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="#635BFF" />
            <text x="24" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">stripe</text>
          </svg>
        ),
      },
      {
        name: "Klarna",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="#FFB3C7" />
            <text x="24" y="19" textAnchor="middle" fill="#1A1A1A" fontSize="7" fontWeight="bold" fontFamily="Arial">Klarna.</text>
          </svg>
        ),
      },
      {
        name: "Bank Transfer",
        svg: (
          <svg viewBox="0 0 48 32" className="w-full h-full">
            <rect width="48" height="32" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
            <path d="M24 7l-12 6v2h24v-2L24 7zm-10 10v6h4v-6h-4zm8 0v6h4v-6h-4zm8 0v6h4v-6h-4zM12 25v2h24v-2H12z" fill="#6B7280" />
          </svg>
        ),
      },
    ],
  },
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
            <div className="mb-4">
              <HoxtaLogo size="lg" />
            </div>
            
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

            {/* Payment Methods by Category */}
            <div className="mb-6 space-y-3">
              <h5 className="text-sm font-medium text-foreground">{t("sections.paymentMethods")}</h5>
              {paymentCategories.map((category) => (
                <div key={category.label}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5">{category.label}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {category.methods.map((method) => (
                      <div
                        key={method.name}
                        className="group relative w-11 h-7 transition-all duration-200 hover:scale-110"
                        title={method.name}
                      >
                        <div className="opacity-75 group-hover:opacity-100 transition-opacity w-full h-full">
                          {'src' in method && method.src ? (
                            <img src={method.src} alt={method.name} className="w-full h-full rounded" />
                          ) : 'svg' in method && method.svg ? (
                            <div className="w-full h-full">{method.svg}</div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
