// Game Server Catalog Data

export interface GameServer {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  pricingDisplay: string;
  priceValue: number;
  pricingUnit: "slot" | "GB" | "month";
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  category: "fps" | "survival" | "sandbox" | "roleplay" | "mmo" | "other";
  os: "windows" | "linux" | "both";
  popular: boolean;
  features: string[];
  plans: GamePlan[];
  faqs: GameFAQ[];
  heroPoints: string[];
}

export interface GamePlan {
  name: string;
  slots?: number | string;
  ram?: string;
  cpu?: string;
  storage?: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export interface GameFAQ {
  question: string;
  answer: string;
}

export const gameServers: GameServer[] = [
  {
    id: "minecraft",
    slug: "minecraft",
    title: "Minecraft",
    coverImage: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&h=300&fit=crop",
    pricingDisplay: "$0.50/GB",
    priceValue: 0.50,
    pricingUnit: "GB",
    shortDescription: "Java & Bedrock Edition servers",
    fullDescription: "Host your perfect Minecraft world with our premium server hosting. Whether you're running a small survival server for friends or a massive network with thousands of players, we have the resources and expertise to keep your world running smoothly.",
    tags: ["Mods", "Plugins", "DDoS Protection", "Instant Setup"],
    category: "sandbox",
    os: "both",
    popular: true,
    heroPoints: [
      "One-click modpack installation",
      "Java & Bedrock crossplay support",
      "Unlimited player slots available",
      "Free MySQL database included"
    ],
    features: [
      "Full FTP & SFTP access",
      "One-click modpack installer",
      "Bukkit, Spigot, Paper support",
      "Automatic backups",
      "Custom JAR support",
      "Sub-user management",
      "Scheduled tasks",
      "Console access 24/7"
    ],
    plans: [
      { name: "Starter", ram: "2GB", storage: "10GB NVMe", price: 3.00, features: ["Up to 10 players", "Basic mod support", "Daily backups"] },
      { name: "Standard", ram: "4GB", storage: "25GB NVMe", price: 6.00, popular: true, features: ["Up to 30 players", "Full mod support", "Hourly backups", "Free subdomain"] },
      { name: "Premium", ram: "8GB", storage: "50GB NVMe", price: 12.00, features: ["Up to 100 players", "Priority support", "Custom domain", "MySQL database"] },
      { name: "Enterprise", ram: "16GB", storage: "100GB NVMe", price: 24.00, features: ["Unlimited players", "Dedicated resources", "Premium support", "All features included"] }
    ],
    faqs: [
      { question: "Can I install modpacks like FTB or Tekkit?", answer: "Yes! Our one-click installer supports all major modpacks including Feed The Beast, Tekkit, SkyFactory, All The Mods, and hundreds more. You can also upload custom modpacks via FTP." },
      { question: "Do you support both Java and Bedrock?", answer: "Absolutely! We support Java Edition, Bedrock Edition, and even crossplay between both using GeyserMC. This is included free with all plans." },
      { question: "Can I upgrade my RAM later?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes are applied instantly without losing any data." },
      { question: "How many plugins can I install?", answer: "There's no limit on plugins! Install as many Bukkit, Spigot, or Paper plugins as your server can handle." },
      { question: "Do you offer DDoS protection?", answer: "Yes, enterprise-grade DDoS protection is included free with all Minecraft server plans." }
    ]
  },
  {
    id: "fivem",
    slug: "fivem",
    title: "FiveM",
    coverImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop",
    pricingDisplay: "$1.40/slot",
    priceValue: 1.40,
    pricingUnit: "slot",
    shortDescription: "GTA V roleplay servers",
    tags: ["Roleplay", "Custom Scripts", "High Performance", "ESX/QBCore"],
    category: "roleplay",
    os: "windows",
    popular: true,
    fullDescription: "Launch your own GTA V roleplay community with our high-performance FiveM servers. We provide the resources and stability needed for complex RP frameworks like ESX, QBCore, and custom scripts.",
    heroPoints: [
      "Pre-installed ESX & QBCore frameworks",
      "OneSync Infinity support",
      "Custom resource installation",
      "txAdmin control panel included"
    ],
    features: [
      "txAdmin panel included",
      "OneSync Infinity support",
      "Pre-configured frameworks",
      "Custom resource support",
      "MySQL database included",
      "Automatic restarts",
      "Full root access",
      "Discord integration"
    ],
    plans: [
      { name: "Starter", slots: 32, cpu: "2 vCores", ram: "4GB", storage: "30GB NVMe", price: 19.00, features: ["32 player slots", "Basic scripts", "Daily backups"] },
      { name: "Standard", slots: 64, cpu: "4 vCores", ram: "8GB", storage: "60GB NVMe", price: 35.00, popular: true, features: ["64 player slots", "ESX/QBCore ready", "Hourly backups", "Priority support"] },
      { name: "Premium", slots: 128, cpu: "6 vCores", ram: "16GB", storage: "120GB NVMe", price: 65.00, features: ["128 player slots", "Full framework support", "Custom scripts", "Dedicated resources"] },
      { name: "Enterprise", slots: "Unlimited", cpu: "8 vCores", ram: "32GB", storage: "250GB NVMe", price: 120.00, features: ["Unlimited slots", "Maximum performance", "24/7 priority support", "Custom configurations"] }
    ],
    faqs: [
      { question: "Which RP frameworks do you support?", answer: "We support all major frameworks including ESX, QBCore, vRP, and custom frameworks. Many come pre-installed for easy setup." },
      { question: "Can I use OneSync Infinity?", answer: "Yes! All our FiveM servers support OneSync Infinity for high player counts with no additional fees." },
      { question: "Do you include txAdmin?", answer: "Absolutely. txAdmin comes pre-installed on all FiveM servers for easy server management, player monitoring, and automated restarts." },
      { question: "Can I install custom scripts and MLOs?", answer: "Yes, you have full access to install any custom resources, scripts, vehicles, and MLOs via FTP or our file manager." },
      { question: "Is a database included?", answer: "Yes, every FiveM server includes a free MySQL database with unlimited storage and easy phpMyAdmin access." }
    ]
  },
  {
    id: "cs2",
    slug: "cs2",
    title: "Counter-Strike 2",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    pricingDisplay: "$0.80/slot",
    priceValue: 0.80,
    pricingUnit: "slot",
    shortDescription: "Competitive CS2 servers",
    tags: ["Competitive", "128 Tick", "Low Latency", "Custom Maps"],
    category: "fps",
    os: "linux",
    popular: true,
    fullDescription: "Host competitive Counter-Strike 2 servers with premium 128-tick performance. Perfect for scrims, leagues, community servers, and custom game modes.",
    heroPoints: [
      "128-tick servers by default",
      "Workshop map support",
      "Custom game mode configs",
      "Anti-cheat integration ready"
    ],
    features: [
      "128-tick performance",
      "Steam Workshop integration",
      "RCON access",
      "Custom configurations",
      "SourceMod support",
      "Match recording",
      "Automatic updates",
      "Low-latency network"
    ],
    plans: [
      { name: "5v5 Scrim", slots: 12, cpu: "2 vCores", storage: "20GB NVMe", price: 8.00, features: ["12 slots", "128-tick", "Perfect for scrims"] },
      { name: "Community", slots: 24, cpu: "3 vCores", storage: "40GB NVMe", price: 15.00, popular: true, features: ["24 slots", "Workshop maps", "SourceMod ready"] },
      { name: "League", slots: 32, cpu: "4 vCores", storage: "60GB NVMe", price: 22.00, features: ["32 slots", "Match recording", "Priority support"] },
      { name: "Tournament", slots: 64, cpu: "6 vCores", storage: "100GB NVMe", price: 40.00, features: ["64 slots", "Multiple servers", "Dedicated resources", "Custom configs"] }
    ],
    faqs: [
      { question: "Are your servers 128-tick?", answer: "Yes! All our CS2 servers run at 128-tick by default for the best competitive experience." },
      { question: "Can I install custom maps from the Workshop?", answer: "Absolutely. Steam Workshop integration is included, making it easy to add any custom map." },
      { question: "Do you support SourceMod and plugins?", answer: "Yes, SourceMod and MetaMod are fully supported for custom plugins and server modifications." },
      { question: "Can I use this for league matches?", answer: "Yes! Our servers are configured for competitive play with options for match recording and anti-cheat integration." }
    ]
  },
  {
    id: "rust",
    slug: "rust",
    title: "Rust",
    coverImage: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=300&fit=crop",
    pricingDisplay: "$1.00/slot",
    priceValue: 1.00,
    pricingUnit: "slot",
    shortDescription: "Survival game servers",
    tags: ["Survival", "Oxide/uMod", "Custom Maps", "High Performance"],
    category: "survival",
    os: "linux",
    popular: true,
    fullDescription: "Build, raid, and survive on your own Rust server. Our high-performance hosting handles the demanding resource requirements of Rust, even with large maps and high player counts.",
    heroPoints: [
      "Oxide/uMod pre-installed",
      "Custom map support",
      "Automatic wipe scheduling",
      "RustEdit compatible"
    ],
    features: [
      "Oxide/uMod support",
      "Custom map uploads",
      "Automatic wipe scheduler",
      "RCON access",
      "Plugin marketplace",
      "Automatic updates",
      "Backup management",
      "Performance monitoring"
    ],
    plans: [
      { name: "Starter", slots: 50, cpu: "3 vCores", ram: "6GB", storage: "50GB NVMe", price: 20.00, features: ["50 slots", "3500 map size", "Basic plugins"] },
      { name: "Standard", slots: 100, cpu: "4 vCores", ram: "10GB", storage: "80GB NVMe", price: 35.00, popular: true, features: ["100 slots", "4500 map size", "Full plugin support", "Wipe scheduler"] },
      { name: "Premium", slots: 200, cpu: "6 vCores", ram: "16GB", storage: "150GB NVMe", price: 60.00, features: ["200 slots", "Custom maps", "Priority support", "All features"] },
      { name: "Enterprise", slots: 500, cpu: "8 vCores", ram: "32GB", storage: "300GB NVMe", price: 100.00, features: ["500 slots", "Maximum performance", "Dedicated resources", "Custom configurations"] }
    ],
    faqs: [
      { question: "Can I install Oxide plugins?", answer: "Yes! Oxide/uMod comes pre-installed and you can install plugins directly from our control panel or manually via FTP." },
      { question: "Do you support custom maps?", answer: "Absolutely. You can upload custom procedural or RustEdit maps via FTP. We support all map sizes." },
      { question: "How do wipes work?", answer: "You can schedule automatic wipes through our control panel or perform manual wipes. We offer forced wipe synchronization with official Rust updates." },
      { question: "What about RCON?", answer: "Full RCON access is included. Use any RCON tool or manage directly from our web-based console." }
    ]
  },
  {
    id: "ark",
    slug: "ark",
    title: "ARK: Survival Evolved",
    coverImage: "https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=400&h=300&fit=crop",
    pricingDisplay: "$1.20/slot",
    priceValue: 1.20,
    pricingUnit: "slot",
    shortDescription: "Dinosaur survival servers",
    tags: ["Survival", "Mods", "Clusters", "Custom Maps"],
    category: "survival",
    os: "both",
    popular: false,
    fullDescription: "Tame dinosaurs and build empires on your own ARK server. We handle the intensive resource requirements so you can focus on surviving.",
    heroPoints: [
      "All official maps included",
      "Full mod support via Steam Workshop",
      "Cluster server linking",
      "Cross-platform play support"
    ],
    features: [
      "All DLC maps available",
      "Steam Workshop mods",
      "Cluster support",
      "Automatic updates",
      "Scheduled restarts",
      "Wild dino wipes",
      "Backup management",
      "S+ and other popular mods"
    ],
    plans: [
      { name: "Starter", slots: 20, ram: "8GB", storage: "50GB NVMe", price: 18.00, features: ["20 slots", "Any official map", "Basic mods"] },
      { name: "Standard", slots: 50, ram: "12GB", storage: "100GB NVMe", price: 35.00, popular: true, features: ["50 slots", "Full mod support", "Cluster ready"] },
      { name: "Premium", slots: 100, ram: "20GB", storage: "200GB NVMe", price: 65.00, features: ["100 slots", "Multiple maps", "Priority support"] },
      { name: "Cluster", slots: "Unlimited", ram: "32GB+", storage: "500GB NVMe", price: 120.00, features: ["Full cluster setup", "All maps", "Premium support", "Custom configs"] }
    ],
    faqs: [
      { question: "Can I run multiple maps in a cluster?", answer: "Yes! We support full cluster configurations allowing players to transfer between maps. Contact us for multi-server cluster setup." },
      { question: "Which mods are supported?", answer: "We support all Steam Workshop mods including Structures Plus, Dino Storage, and thousands of others." },
      { question: "Do you support all DLC maps?", answer: "Yes, all DLC maps are available at no extra cost including Aberration, Extinction, Genesis, and more." },
      { question: "How much RAM do I need for ARK?", answer: "ARK is resource-intensive. We recommend at least 8GB RAM for a small server, and 12GB+ for modded servers." }
    ]
  },
  {
    id: "arma3",
    slug: "arma3",
    title: "Arma 3",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop",
    pricingDisplay: "$1.50/slot",
    priceValue: 1.50,
    pricingUnit: "slot",
    shortDescription: "Military simulation servers",
    tags: ["MilSim", "Mods", "Large Scale", "Custom Missions"],
    category: "fps",
    os: "both",
    popular: false,
    fullDescription: "Run tactical military simulations on dedicated Arma 3 servers. Perfect for milsim units, custom scenarios, and large-scale operations.",
    heroPoints: [
      "Headless client support",
      "Full mod/addon management",
      "Mission file uploads",
      "BattlEye anti-cheat"
    ],
    features: [
      "Headless client support",
      "Steam Workshop integration",
      "Custom mission support",
      "BattlEye enabled",
      "Automatic restarts",
      "Mod preset management",
      "Performance monitoring",
      "RCON access"
    ],
    plans: [
      { name: "Squad", slots: 32, cpu: "4 vCores", ram: "8GB", storage: "60GB NVMe", price: 30.00, features: ["32 slots", "Mod support", "BattlEye"] },
      { name: "Platoon", slots: 64, cpu: "6 vCores", ram: "12GB", storage: "100GB NVMe", price: 50.00, popular: true, features: ["64 slots", "Headless client", "Full mod support"] },
      { name: "Company", slots: 128, cpu: "8 vCores", ram: "20GB", storage: "200GB NVMe", price: 90.00, features: ["128 slots", "Multiple headless clients", "Priority support"] }
    ],
    faqs: [
      { question: "Do you support headless clients?", answer: "Yes! We support headless client setups for improved AI performance and smoother gameplay during large operations." },
      { question: "Can I upload custom missions?", answer: "Absolutely. Upload your custom .pbo mission files via FTP and they'll be available on your server." },
      { question: "Which mods are supported?", answer: "We support all Steam Workshop mods including ACE3, TFAR, RHS, CUP, and any other mod collection." }
    ]
  },
  {
    id: "dayz",
    slug: "dayz",
    title: "DayZ",
    coverImage: "https://images.unsplash.com/photo-1542349314-b0ceb4d90f4b?w=400&h=300&fit=crop",
    pricingDisplay: "$1.10/slot",
    priceValue: 1.10,
    pricingUnit: "slot",
    shortDescription: "Zombie survival servers",
    tags: ["Survival", "Mods", "Custom Maps", "Hardcore"],
    category: "survival",
    os: "both",
    popular: false,
    fullDescription: "Survive the zombie apocalypse on your own DayZ server. Full mod support, custom spawns, and complete control over your apocalyptic world.",
    heroPoints: [
      "Full mod support",
      "Custom spawn configurations",
      "Trader/economy mods",
      "Namalsk and custom maps"
    ],
    features: [
      "Steam Workshop mods",
      "Custom XML editing",
      "Trader support",
      "Custom maps",
      "Automatic restarts",
      "Player whitelist",
      "BattlEye enabled",
      "Performance optimization"
    ],
    plans: [
      { name: "Starter", slots: 32, ram: "8GB", storage: "50GB NVMe", price: 25.00, features: ["32 slots", "Basic mods", "Chernarus"] },
      { name: "Standard", slots: 60, ram: "12GB", storage: "80GB NVMe", price: 45.00, popular: true, features: ["60 slots", "Full mod support", "Any map"] },
      { name: "Premium", slots: 100, ram: "16GB", storage: "150GB NVMe", price: 75.00, features: ["100 slots", "Traders", "Priority support"] },
      { name: "Enterprise", slots: 127, ram: "24GB", storage: "250GB NVMe", price: 110.00, features: ["127 slots", "Maximum resources", "Custom configs"] }
    ],
    faqs: [
      { question: "Can I install Expansion mod?", answer: "Yes! DayZ Expansion and all other Steam Workshop mods are fully supported." },
      { question: "Do you support custom maps?", answer: "Absolutely. Namalsk, Deer Isle, and other custom maps work perfectly on our servers." },
      { question: "Can I run trader mods?", answer: "Yes, all trader mods like Dr. Jones Trader are supported. We can help with initial setup if needed." }
    ]
  },
  {
    id: "valheim",
    slug: "valheim",
    title: "Valheim",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    pricingDisplay: "$0.60/slot",
    priceValue: 0.60,
    pricingUnit: "slot",
    shortDescription: "Viking survival servers",
    tags: ["Survival", "Co-op", "Mods", "BepInEx"],
    category: "survival",
    os: "linux",
    popular: true,
    fullDescription: "Explore, build, and conquer in your own Viking world. Our Valheim servers provide the perfect foundation for your clan's adventures.",
    heroPoints: [
      "Valheim Plus support",
      "BepInEx mod framework",
      "World file management",
      "Crossplay enabled"
    ],
    features: [
      "Valheim Plus support",
      "BepInEx mods",
      "World backup/restore",
      "Crossplay support",
      "Automatic updates",
      "Password protection",
      "Console access",
      "Easy world upload"
    ],
    plans: [
      { name: "Small Clan", slots: 10, ram: "3GB", storage: "15GB NVMe", price: 6.00, features: ["10 slots", "Basic mods", "Daily backups"] },
      { name: "Clan", slots: 20, ram: "4GB", storage: "25GB NVMe", price: 10.00, popular: true, features: ["20 slots", "Valheim Plus", "Hourly backups"] },
      { name: "Kingdom", slots: 64, ram: "8GB", storage: "50GB NVMe", price: 20.00, features: ["64 slots", "Full mod support", "Priority support"] }
    ],
    faqs: [
      { question: "Can I install Valheim Plus?", answer: "Yes! Valheim Plus and other BepInEx mods are fully supported and easy to install." },
      { question: "Can I upload my existing world?", answer: "Absolutely. Upload your world files via FTP or our file manager to continue your adventure." },
      { question: "Does crossplay work?", answer: "Yes, crossplay between PC and Xbox is supported on our servers." }
    ]
  },
  {
    id: "garrys-mod",
    slug: "garrys-mod",
    title: "Garry's Mod",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
    pricingDisplay: "$0.50/slot",
    priceValue: 0.50,
    pricingUnit: "slot",
    shortDescription: "Sandbox game servers",
    tags: ["Sandbox", "Addons", "DarkRP", "TTT"],
    category: "sandbox",
    os: "linux",
    popular: false,
    fullDescription: "Create, play, and share on your own Garry's Mod server. From DarkRP to TTT to PropHunt, we support every game mode.",
    heroPoints: [
      "DarkRP, TTT, Murder support",
      "Workshop collection sync",
      "ULX/ULib admin tools",
      "FastDL included"
    ],
    features: [
      "All game modes supported",
      "Steam Workshop sync",
      "FastDL setup",
      "ULX admin tools",
      "MySQL support",
      "Custom addons",
      "Automatic updates",
      "Point shop integration"
    ],
    plans: [
      { name: "Starter", slots: 16, storage: "20GB NVMe", price: 6.00, features: ["16 slots", "Workshop sync", "ULX included"] },
      { name: "Standard", slots: 32, storage: "40GB NVMe", price: 12.00, popular: true, features: ["32 slots", "FastDL", "MySQL database"] },
      { name: "Premium", slots: 64, storage: "80GB NVMe", price: 22.00, features: ["64 slots", "Priority support", "All features"] },
      { name: "Enterprise", slots: 128, storage: "150GB NVMe", price: 40.00, features: ["128 slots", "Maximum performance", "Custom configs"] }
    ],
    faqs: [
      { question: "Which game modes do you support?", answer: "We support all game modes including DarkRP, TTT, Prop Hunt, Murder, Sandbox, and custom modes." },
      { question: "Can I sync Workshop addons?", answer: "Yes! Simply enter your Workshop collection ID and all addons will automatically sync to your server." },
      { question: "Is FastDL included?", answer: "Yes, FastDL is included free to ensure players download custom content quickly." }
    ]
  },
  {
    id: "palworld",
    slug: "palworld",
    title: "Palworld",
    coverImage: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop",
    pricingDisplay: "$0.75/GB",
    priceValue: 0.75,
    pricingUnit: "GB",
    shortDescription: "Monster-catching survival",
    tags: ["Survival", "Multiplayer", "Co-op", "New"],
    category: "survival",
    os: "both",
    popular: true,
    fullDescription: "Build, farm, and battle with Pals on your own dedicated server. Perfect for playing with friends in this unique survival experience.",
    heroPoints: [
      "Instant server deployment",
      "Easy settings configuration",
      "Save file management",
      "Automatic updates"
    ],
    features: [
      "Easy configuration",
      "Save file management",
      "Automatic updates",
      "Password protection",
      "Admin commands",
      "Player whitelist",
      "Backup management",
      "Performance tuned"
    ],
    plans: [
      { name: "Friends", ram: "8GB", slots: 8, storage: "30GB NVMe", price: 12.00, features: ["8 players", "Easy setup", "Daily backups"] },
      { name: "Community", ram: "16GB", slots: 16, storage: "50GB NVMe", price: 20.00, popular: true, features: ["16 players", "Custom settings", "Hourly backups"] },
      { name: "Large", ram: "32GB", slots: 32, storage: "100GB NVMe", price: 35.00, features: ["32 players", "Priority support", "All features"] }
    ],
    faqs: [
      { question: "How many players can join?", answer: "Palworld supports up to 32 players on dedicated servers. Choose a plan that fits your group size." },
      { question: "Can I transfer my save file?", answer: "Yes! Upload your existing save files via FTP to continue your world on our servers." },
      { question: "Are mods supported?", answer: "Mod support is evolving. We stay updated with the latest developments and support mods as they become stable." }
    ]
  },
  {
    id: "7days",
    slug: "7-days-to-die",
    title: "7 Days to Die",
    coverImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=300&fit=crop",
    pricingDisplay: "$0.90/slot",
    priceValue: 0.90,
    pricingUnit: "slot",
    shortDescription: "Zombie survival sandbox",
    tags: ["Survival", "Zombies", "Building", "Mods"],
    category: "survival",
    os: "both",
    popular: false,
    fullDescription: "Survive the zombie apocalypse in this unique blend of FPS, survival horror, and base building. Full mod support and custom world generation.",
    heroPoints: [
      "Darkness Falls and Undead Legacy mods",
      "Random world generation",
      "Blood moon configuration",
      "Easy XML editing"
    ],
    features: [
      "Full mod support",
      "Random world gen",
      "XML configuration",
      "Blood moon settings",
      "Difficulty options",
      "Automatic updates",
      "Backup management",
      "Console access"
    ],
    plans: [
      { name: "Starter", slots: 8, ram: "6GB", storage: "40GB NVMe", price: 15.00, features: ["8 slots", "Custom world", "Basic mods"] },
      { name: "Standard", slots: 16, ram: "10GB", storage: "60GB NVMe", price: 25.00, popular: true, features: ["16 slots", "Full mods", "Large worlds"] },
      { name: "Premium", slots: 32, ram: "16GB", storage: "100GB NVMe", price: 45.00, features: ["32 slots", "Overhaul mods", "Priority support"] }
    ],
    faqs: [
      { question: "Can I run Darkness Falls?", answer: "Yes! Darkness Falls, Undead Legacy, and other overhaul mods are fully supported." },
      { question: "How do I configure blood moons?", answer: "Use our easy XML editor or upload custom serverconfig.xml files to set blood moon frequency and difficulty." },
      { question: "Do you support custom maps?", answer: "Yes, you can use RWG (random world generation) or upload pre-generated worlds via FTP." }
    ]
  }
];

export const gameCategories = [
  { id: "all", label: "All Games" },
  { id: "fps", label: "FPS" },
  { id: "survival", label: "Survival" },
  { id: "sandbox", label: "Sandbox" },
  { id: "roleplay", label: "Roleplay" },
  { id: "mmo", label: "MMO" },
  { id: "other", label: "Other" }
];

export const gameSortOptions = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A-Z" },
  { id: "name-desc", label: "Name: Z-A" }
];
