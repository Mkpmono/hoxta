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

// Inline SVGs for icons not available in the library
const ApplePayIcon = () => (
  <svg viewBox="0 0 750 471" className="w-full h-full">
    <rect width="750" height="471" rx="40" className="fill-muted" />
    <path d="M196.8 172.1c-8.1 9.5-21.1 16.9-34 15.8-1.6-12.9 4.7-26.7 12.1-35.2 8.1-9.8 22.2-16.6 33.7-17.1 1.4 13.2-3.9 26.2-11.8 36.5zm11.6 18.5c-18.8-1.1-34.8 10.7-43.8 10.7s-22.7-10.1-37.5-9.8c-19.3.3-37.1 11.2-47.1 28.5-20.1 34.7-5.3 86.1 14.3 114.3 9.5 13.9 20.9 29.4 35.9 28.8 14.3-.6 19.8-9.2 37.2-9.2s22.3 9.2 37.5 8.9c15.5-.3 25.2-13.9 34.7-27.8 10.7-15.8 15.1-31.2 15.4-32-.3-.3-29.6-11.5-29.9-45.4-.3-28.4 23.2-42 24.3-42.8-13.2-19.5-33.8-21.7-41-22.2zM375 159.4v252.7h38.9V324h53.9c49.2 0 83.8-33.8 83.8-82.5s-34-82.1-82.7-82.1H375zm38.9 33.2h44.8c33.8 0 53.1 18 53.1 49.5S492.5 291.8 458.4 291.8h-44.5V192.6z" className="fill-foreground/80" />
  </svg>
);

const GooglePayIcon = () => (
  <svg viewBox="0 0 750 471" className="w-full h-full">
    <rect width="750" height="471" rx="40" className="fill-muted" />
    <path d="M360.1 236.5v68.8h-22V141h58.3c14 0 25.9 4.7 35.8 14.2 10.1 9.5 15.1 21 15.1 34.5 0 13.8-5 25.3-15.1 34.6-9.8 9.3-21.7 14-35.8 14h-36.3v-1.8zm0-74.8v53h36.7c8.2 0 15.1-2.8 20.8-8.5 5.7-5.7 8.6-12.5 8.6-20.5 0-7.8-2.9-14.5-8.6-20.2-5.6-5.8-12.5-8.6-20.8-8.6h-36.7v4.8z" className="fill-[#4285F4]" />
    <path d="M497.2 201.3c16.1 0 28.8 4.3 38 12.9s13.8 20.4 13.8 35.2v71.2h-21.1v-16.1h-1c-9 13.2-20.9 19.8-35.8 19.8-12.8 0-23.4-3.8-31.9-11.3-8.5-7.5-12.8-16.9-12.8-28.2 0-11.9 4.5-21.4 13.5-28.5 9-7.1 21.1-10.6 36.1-10.6 12.8 0 23.4 2.4 31.7 7.1V247c0-8.5-3.3-15.5-10-21.2-6.7-5.7-14.5-8.5-23.5-8.5-13.6 0-24.4 5.7-32.3 17.2l-19.5-12.2c11.4-17 28.2-25.5 50.4-25.5v4.5zm-28.1 83.5c0 6.4 2.8 11.7 8.3 16.1 5.5 4.3 11.8 6.5 18.9 6.5 10.2 0 19.2-3.9 26.8-11.6 7.7-7.7 11.5-16.6 11.5-26.7-6.9-5.4-16.4-8.1-28.7-8.1-8.9 0-16.4 2.2-22.3 6.5-5.9 4.3-8.9 9.6-8.9 15.8l-5.6 1.5z" className="fill-[#4285F4]" />
    <path d="M633.3 204.9l-74 170.3h-22.8l27.5-59.6-48.7-110.7h24l35.1 84.6h.5l34.1-84.6h24.3z" className="fill-[#4285F4]" />
    <path d="M262.3 235.5c0-5.2-.4-10.2-1.3-15h-82.8v28.4h47.4c-2 11-8.2 20.3-17.5 26.5v22h28.3c16.6-15.2 26.1-37.7 26.1-61.9h-.2z" className="fill-[#4285F4]" />
    <path d="M178.2 299.4c23.7 0 43.6-7.8 58.1-21.3l-28.3-22c-7.9 5.3-17.9 8.4-29.8 8.4-22.9 0-42.3-15.5-49.3-36.3H99.7v22.7c14.4 28.6 44 48.5 78.5 48.5z" className="fill-[#34A853]" />
    <path d="M128.9 228.2c-1.8-5.3-2.8-11-2.8-16.9s1-11.5 2.8-16.9v-22.7H99.7c-6.1 12.1-9.5 25.7-9.5 39.6s3.4 27.5 9.5 39.6l29.2-22.7z" className="fill-[#FABB05]" />
    <path d="M178.2 158.1c12.9 0 24.5 4.4 33.6 13.2l25.2-25.2c-15.2-14.2-35.1-22.9-58.8-22.9-34.5 0-64.1 19.9-78.5 48.5l29.2 22.7c7-20.8 26.4-36.3 49.3-36.3z" className="fill-[#E94235]" />
  </svg>
);

const BankTransferIcon = () => (
  <svg viewBox="0 0 750 471" className="w-full h-full">
    <rect width="750" height="471" rx="40" className="fill-muted" />
    <path d="M375 100l-200 100v30h400v-30L375 100zm0 25l140 70H235l140-70zM195 260v120h50V260h-50zm105 0v120h50V260h-50zm105 0v120h50V260h-50zm105 0v120h50V260h-50zM175 400v30h400v-30H175z" className="fill-foreground/60" />
  </svg>
);

const CryptoIcon = () => (
  <svg viewBox="0 0 750 471" className="w-full h-full">
    <rect width="750" height="471" rx="40" className="fill-muted" />
    <circle cx="375" cy="235" r="130" className="fill-none stroke-yellow-500/70" strokeWidth="12" />
    <path d="M375 130v30m0 150v30M310 165h80c20 0 35 15 35 35s-15 35-35 35H310m0 0h90c20 0 35 15 35 35s-15 35-35 35H310m0-140v140" className="stroke-yellow-500/70 fill-none" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const paymentMethods = [
  { name: "Visa", src: visaSvg },
  { name: "Mastercard", src: mastercardSvg },
  { name: "Maestro", src: maestroSvg },
  { name: "PayPal", src: paypalSvg },
  { name: "Apple Pay", Component: ApplePayIcon },
  { name: "Google Pay", Component: GooglePayIcon },
  { name: "Bank Transfer", Component: BankTransferIcon },
  { name: "Crypto", Component: CryptoIcon },
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

            {/* Payment Methods */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-foreground mb-3">{t("sections.paymentMethods")}</h5>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="group relative w-12 h-8 transition-all duration-200 hover:scale-105"
                    title={method.name}
                  >
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity w-full h-full">
                      {'src' in method && method.src ? (
                        <img src={method.src} alt={method.name} className="w-full h-full rounded" />
                      ) : 'Component' in method && method.Component ? (
                        <method.Component />
                      ) : null}
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
