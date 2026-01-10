import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Server, Gamepad2, HardDrive, LifeBuoy, X, Menu } from "lucide-react";

interface DropdownItem {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
}

interface MenuItemProps {
  label: string;
  items?: DropdownItem[];
  href?: string;
}

const menuItems: MenuItemProps[] = [
  { label: "Home", href: "/" },
  {
    label: "Web",
    items: [
      { title: "Web Hosting", subtitle: "Fast & reliable hosting for your websites", icon: <Globe className="w-5 h-5" />, href: "/web-hosting" },
      { title: "Reseller Hosting", subtitle: "Start your own hosting business", icon: <Server className="w-5 h-5" />, href: "/reseller-hosting" },
    ],
  },
  {
    label: "Game Servers",
    items: [
      { title: "All Games", subtitle: "Browse all game servers", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers" },
      { title: "Minecraft", subtitle: "Java & Bedrock servers", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/minecraft" },
      { title: "FiveM", subtitle: "GTA V roleplay servers", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/fivem" },
      { title: "Counter-Strike 2", subtitle: "Competitive CS2 servers", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/cs2" },
      { title: "Rust", subtitle: "Survival game servers", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/rust" },
      { title: "Palworld", subtitle: "Monster-catching survival", icon: <Gamepad2 className="w-5 h-5" />, href: "/game-servers/palworld" },
    ],
  },
  {
    label: "Server",
    items: [
      { title: "VPS Hosting", subtitle: "Virtual private servers with full control", icon: <HardDrive className="w-5 h-5" />, href: "/vps" },
      { title: "Dedicated Server", subtitle: "Enterprise-grade bare metal servers", icon: <Server className="w-5 h-5" />, href: "/dedicated" },
    ],
  },
  {
    label: "More Hosting",
    items: [
      { title: "Discord Bot", subtitle: "Host your Discord bots 24/7", icon: <Server className="w-5 h-5" />, href: "/discord-bot" },
      { title: "TeamSpeak Hosting", subtitle: "Crystal-clear voice servers", icon: <Server className="w-5 h-5" />, href: "/teamspeak" },
      { title: "Colocation", subtitle: "Colocate your hardware", icon: <HardDrive className="w-5 h-5" />, href: "/colocation" },
    ],
  },
  {
    label: "Help & Info",
    items: [
      { title: "About Us", subtitle: "Learn about Hoxta", icon: <LifeBuoy className="w-5 h-5" />, href: "/about" },
      { title: "Contact Us", subtitle: "Get in touch with our team", icon: <LifeBuoy className="w-5 h-5" />, href: "/contact" },
      { title: "Blog", subtitle: "News and updates", icon: <LifeBuoy className="w-5 h-5" />, href: "/blog" },
      { title: "Terms of Service", subtitle: "Our terms and conditions", icon: <LifeBuoy className="w-5 h-5" />, href: "/terms" },
      { title: "Privacy Policy", subtitle: "How we protect your data", icon: <LifeBuoy className="w-5 h-5" />, href: "/privacy" },
    ],
  },
];

export function Header() {
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
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-xl md:text-2xl font-bold text-foreground">Ho</span>
            <span className="text-xl md:text-2xl font-bold text-primary">x</span>
            <span className="text-xl md:text-2xl font-bold text-foreground">ta</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.items ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeDropdown === item.label
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
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
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Control Panel Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/panel"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(25,195,255,0.3)] hover:shadow-[0_0_30px_rgba(25,195,255,0.5)]"
            >
              Control Panel
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
                <div className={`grid gap-3 ${getGridCols(menuItems.find(m => m.label === activeDropdown)?.items?.length || 0)}`}>
                  {menuItems
                    .find((m) => m.label === activeDropdown)
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
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.subtitle}</p>
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
                <div key={item.label}>
                  {item.items ? (
                    <details className="group">
                      <summary className="flex items-center justify-between px-4 py-3 text-foreground cursor-pointer rounded-lg hover:bg-white/5">
                        {item.label}
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 mt-2 space-y-1">
                        {item.items.map((subItem, idx) => (
                          <Link
                            key={idx}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      to={item.href || "/"}
                      className="block px-4 py-3 text-foreground rounded-lg hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link to="/panel" className="block w-full btn-glow text-center mt-4">
                Control Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
