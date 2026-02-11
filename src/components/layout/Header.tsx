import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Server, Gamepad2, HardDrive, LifeBuoy, X, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HoxtaLogo } from "@/components/HoxtaLogo";

interface DropdownItem {
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
  href: string;
}

interface MenuItemProps {
  labelKey: string;
  items?: DropdownItem[];
  href?: string;
}

const menuItems: MenuItemProps[] = [
  { labelKey: "nav.home", href: "/" },
  {
    labelKey: "nav.web",
    items: [
      { titleKey: "nav.webHosting", subtitleKey: "nav.webHostingDesc", icon: <Globe className="w-5 h-5" />, href: "/web-hosting" },
      { titleKey: "nav.resellerHosting", subtitleKey: "nav.resellerHostingDesc", icon: <Server className="w-5 h-5" />, href: "/reseller-hosting" },
    ],
  },
  {
    labelKey: "nav.games",
    items: [
      { titleKey: "nav.allGames", subtitleKey: "nav.allGamesDesc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers" },
      { titleKey: "games.minecraft", subtitleKey: "games.minecraftDesc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/minecraft" },
      { titleKey: "games.fivem", subtitleKey: "games.fivemDesc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/fivem" },
      { titleKey: "games.cs2", subtitleKey: "games.cs2Desc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/cs2" },
      { titleKey: "games.rust", subtitleKey: "games.rustDesc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/rust" },
      { titleKey: "games.palworld", subtitleKey: "games.palworldDesc", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/palworld" },
    ],
  },
  {
    labelKey: "nav.server",
    items: [
      { titleKey: "nav.vpsHosting", subtitleKey: "nav.vpsHostingDesc", icon: <HardDrive className="w-5 h-5" />, href: "/vps" },
      { titleKey: "nav.dedicatedServer", subtitleKey: "nav.dedicatedServerDesc", icon: <Server className="w-5 h-5" />, href: "/dedicated" },
    ],
  },
  {
    labelKey: "nav.moreHosting",
    items: [
      { titleKey: "nav.discordBot", subtitleKey: "nav.discordBotDesc", icon: <Server className="w-5 h-5" />, href: "/discord-bot" },
      { titleKey: "nav.teamspeak", subtitleKey: "nav.teamspeakDesc", icon: <Server className="w-5 h-5" />, href: "/teamspeak" },
      { titleKey: "nav.colocation", subtitleKey: "nav.colocationDesc", icon: <HardDrive className="w-5 h-5" />, href: "/colocation" },
    ],
  },
  {
    labelKey: "nav.helpInfo",
    items: [
      { titleKey: "nav.aboutUs", subtitleKey: "nav.aboutUsDesc", icon: <LifeBuoy className="w-5 h-5" />, href: "/about" },
      { titleKey: "nav.contactUs", subtitleKey: "nav.contactUsDesc", icon: <LifeBuoy className="w-5 h-5" />, href: "/contact" },
      { titleKey: "nav.terms", subtitleKey: "nav.termsDesc", icon: <LifeBuoy className="w-5 h-5" />, href: "/terms" },
      { titleKey: "nav.privacy", subtitleKey: "nav.privacyDesc", icon: <LifeBuoy className="w-5 h-5" />, href: "/privacy" },
    ],
  },
];

export function Header() {
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getGridCols = (itemCount: number) => {
    if (itemCount === 2) return "grid-cols-2 max-w-2xl";
    if (itemCount === 3) return "grid-cols-3 max-w-4xl";
    if (itemCount >= 6) return "grid-cols-3 max-w-4xl";
    return "grid-cols-3 max-w-4xl";
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0a1628]/90 backdrop-blur-2xl border-b border-primary/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <HoxtaLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {menuItems.map((item) => (
              <div key={item.labelKey} className="relative">
                {item.items ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.labelKey ? null : item.labelKey)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeDropdown === item.labelKey
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.labelKey ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href || "/"}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Language switcher + Control Panel */}
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            
            <Link
              to="/panel"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(25,195,255,0.3)] hover:shadow-[0_0_30px_rgba(25,195,255,0.5)]"
            >
              {t("nav.controlPanel")}
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Dropdown - Centered */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 flex justify-center pt-2"
          >
            <div className={`mx-auto bg-[#0c1a2a]/95 backdrop-blur-2xl rounded-2xl border border-primary/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden`}>
              <div className="p-4">
                <div className={`grid gap-3 ${getGridCols(menuItems.find(m => m.labelKey === activeDropdown)?.items?.length || 0)}`}>
                  {menuItems
                    .find((m) => m.labelKey === activeDropdown)
                    ?.items?.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group min-w-[200px]"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                            {t(item.titleKey)}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t(item.subtitleKey)}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0c1a2a]/98 backdrop-blur-2xl border-b border-primary/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.labelKey}>
                  {item.items ? (
                    <details className="group">
                      <summary className="flex items-center justify-between px-4 py-3 text-foreground cursor-pointer rounded-lg hover:bg-white/5">
                        {t(item.labelKey)}
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 mt-2 space-y-1">
                        {item.items.map((subItem, idx) => (
                          <Link
                            key={idx}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
                          >
                            {t(subItem.titleKey)}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      to={item.href || "/"}
                      className="block px-4 py-3 text-foreground rounded-lg hover:bg-white/5"
                    >
                      {t(item.labelKey)}
                    </Link>
                  )}
                </div>
              ))}
              <Link to="/panel" className="block w-full btn-glow text-center mt-4">
                {t("nav.controlPanel")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
