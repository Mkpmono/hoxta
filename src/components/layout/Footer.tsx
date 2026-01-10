import { Link } from "react-router-dom";
import { brand } from "@/config/brand";
import { MapPin, Clock, Mail, MessageCircle, Twitter, Github, Youtube, Instagram } from "lucide-react";

const footerLinks = {
  services: [
    { label: "MC Hosting", href: "/game-servers?game=minecraft" },
    { label: "Rust", href: "/game-servers?game=rust" },
    { label: "FiveM", href: "/game-servers?game=fivem" },
    { label: "RedM", href: "/game-servers?game=redm" },
    { label: "VPS", href: "/vps" },
    { label: "Web Hosting", href: "/web-hosting" },
    { label: "DDoS Protection", href: "/ddos-protection" },
  ],
  usefulLinks: [
    { label: "Pricing", href: "/pricing" },
    { label: "Status", href: "/status" },
    { label: "Knowledge Base", href: "/knowledge-base" },
    { label: "Community", href: brand.socials.discord },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-background-secondary border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
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
            <h4 className="font-semibold text-foreground mb-4">Useful Links</h4>
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
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
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
                <span>24/7 Support</span>
              </div>
            </div>

            <h5 className="text-sm font-medium text-foreground mb-3">Payment Methods</h5>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 bg-muted rounded text-xs text-muted-foreground">Visa</div>
              <div className="px-3 py-1.5 bg-muted rounded text-xs text-muted-foreground">Mastercard</div>
              <div className="px-3 py-1.5 bg-muted rounded text-xs text-muted-foreground">PayPal</div>
              <div className="px-3 py-1.5 bg-muted rounded text-xs text-muted-foreground">Crypto</div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={brand.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/status" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
