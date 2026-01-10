// Centralized brand configuration
export const brand = {
  name: "Hoxta",
  tagline: "Premium Game, Web, VPS & Server Hosting",
  description: "High-performance infrastructure for gamers, developers, and businesses.",
  accentColor: "#19c3ff",
  supportEmail: "support@hoxta.com",
  location: "Bucharest, RO",
  
  links: {
    home: "/",
    webHosting: "/web-hosting",
    resellerHosting: "/reseller-hosting",
    gameServers: "/game-servers",
    vps: "/vps",
    dedicated: "/dedicated",
    ddosProtection: "/ddos-protection",
    pricing: "/pricing",
    status: "/status",
    knowledgeBase: "/knowledge-base",
    about: "/about",
    contact: "/contact",
    blog: "/blog",
    terms: "/terms",
    privacy: "/privacy",
    panel: "/panel",
  },

  socials: {
    discord: "https://discord.gg/hoxta",
    twitter: "https://twitter.com/hoxta",
    github: "https://github.com/hoxta",
    youtube: "https://youtube.com/@hoxta",
    instagram: "https://instagram.com/hoxta",
  },

  features: {
    ddosCapacity: "400+ Gbps",
    uptime: "99.9%",
    networkSpeed: "4 Gbps",
    support: "24/7",
  },
} as const;

export type BrandConfig = typeof brand;
