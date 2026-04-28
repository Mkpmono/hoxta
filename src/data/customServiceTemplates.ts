import type { CustomServiceSections } from "@/hooks/useCustomServices";

export interface ServiceTemplate {
  key: string;
  label: string;
  description: string;
  group: string;
  icon: string;
  category: string;
  shortDescription: string;
  sections: CustomServiceSections;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    key: "web-hosting",
    label: "Web Hosting",
    description: "Pachete cPanel cu NVMe, LiteSpeed, SSL gratuit",
    group: "web",
    icon: "Globe",
    category: "Web Hosting",
    shortDescription: "Web hosting rapid cu NVMe SSD, LiteSpeed și suport 24/7.",
    sections: {
      hero: {
        enabled: true,
        title: "Web Hosting de mare performanță",
        subtitle: "Servere optimizate cu NVMe SSD, LiteSpeed și certificate SSL gratuite. Migrare gratuită inclusă.",
        ctaLabel: "Vezi planurile",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "De ce să alegi acest hosting",
        items: [
          { icon: "Zap", title: "NVMe SSD", description: "Stocare ultra-rapidă pentru timpi de încărcare minimi." },
          { icon: "ShieldCheck", title: "Protecție DDoS inclusă", description: "Protecție 400+ Gbps activă pe toate planurile." },
          { icon: "Server", title: "LiteSpeed Web Server", description: "Servire dinamică cu LSCache pentru WordPress." },
          { icon: "Lock", title: "SSL gratuit", description: "Certificate Let's Encrypt instalate automat." },
          { icon: "Database", title: "Backup zilnic", description: "Restaurare cu un click în 7 zile retroactiv." },
          { icon: "Headphones", title: "Suport 24/7", description: "Echipă tehnică disponibilă oricând prin chat și ticket." },
        ],
      },
      plans: {
        enabled: true,
        title: "Planuri Web Hosting",
        items: [
          {
            name: "Starter",
            price: "€2.99/lună",
            description: "Perfect pentru un site personal sau de prezentare.",
            features: ["10 GB NVMe", "1 site web", "100 GB trafic", "SSL gratuit", "1 cont email"],
            ctaUrl: "/order",
            popular: false,
          },
          {
            name: "Business",
            price: "€5.99/lună",
            description: "Pentru afaceri mici și magazine online.",
            features: ["50 GB NVMe", "10 site-uri", "Trafic nelimitat", "Backup zilnic", "10 conturi email"],
            ctaUrl: "/order",
            popular: true,
          },
          {
            name: "Premium",
            price: "€11.99/lună",
            description: "Resurse generoase pentru proiecte mari.",
            features: ["200 GB NVMe", "Site-uri nelimitate", "CPU dedicat", "Cache LiteSpeed Pro", "Email nelimitat"],
            ctaUrl: "/order",
            popular: false,
          },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări frecvente",
        items: [
          { question: "Cât durează activarea?", answer: "Activarea este instantă după confirmarea plății." },
          { question: "Pot migra de la alt provider?", answer: "Da, oferim migrare gratuită completă, inclusiv site, baze de date și email." },
          { question: "Există garanție?", answer: "Da, 30 de zile money-back, fără întrebări." },
          { question: "Pot face upgrade ulterior?", answer: "Sigur, poți trece între planuri instant, fără downtime." },
        ],
      },
      cta: {
        enabled: true,
        title: "Începe cu hosting performant azi",
        subtitle: "Activare instantă, suport 24/7 și 30 de zile money-back.",
        ctaLabel: "Comandă acum",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "vps",
    label: "VPS Hosting",
    description: "Servere virtuale cu CPU dedicat, KVM, root access",
    group: "server",
    icon: "Server",
    category: "VPS",
    shortDescription: "VPS cu KVM, NVMe și CPU dedicat. Acces root complet, deploy în câteva minute.",
    sections: {
      hero: {
        enabled: true,
        title: "VPS Hosting cu performanță reală",
        subtitle: "Servere virtuale KVM cu NVMe SSD, CPU dedicat și acces root. Activare în mai puțin de 5 minute.",
        ctaLabel: "Configurează VPS",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "Specificații VPS",
        items: [
          { icon: "Cpu", title: "CPU dedicat", description: "Core-uri rezervate exclusiv pentru tine, fără overcommit." },
          { icon: "HardDrive", title: "NVMe SSD", description: "I/O extrem cu storage NVMe Enterprise." },
          { icon: "Network", title: "Rețea 1-10 Gbps", description: "Conectivitate dedicată cu trafic generos inclus." },
          { icon: "Terminal", title: "Acces root SSH", description: "Control complet asupra OS și pachetelor instalate." },
          { icon: "ShieldCheck", title: "DDoS Protection", description: "Filtrare de trafic 400+ Gbps activă pe IP." },
          { icon: "Repeat", title: "Snapshots & backup", description: "Salvează stări complete și restaurează rapid." },
        ],
      },
      plans: {
        enabled: true,
        title: "Configurații VPS",
        items: [
          {
            name: "VPS S",
            price: "€7.99/lună",
            description: "Pentru proiecte mici, dezvoltare, boți.",
            features: ["2 vCPU dedicat", "4 GB RAM", "60 GB NVMe", "2 TB trafic", "1 IPv4"],
            ctaUrl: "/order",
            popular: false,
          },
          {
            name: "VPS M",
            price: "€15.99/lună",
            description: "Cel mai ales pentru web apps și game servers.",
            features: ["4 vCPU dedicat", "8 GB RAM", "120 GB NVMe", "5 TB trafic", "1 IPv4"],
            ctaUrl: "/order",
            popular: true,
          },
          {
            name: "VPS L",
            price: "€29.99/lună",
            description: "Pentru aplicații cu trafic mare.",
            features: ["8 vCPU dedicat", "16 GB RAM", "240 GB NVMe", "10 TB trafic", "2 IPv4"],
            ctaUrl: "/order",
            popular: false,
          },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări frecvente VPS",
        items: [
          { question: "Ce sisteme de operare suportați?", answer: "Ubuntu, Debian, AlmaLinux, Rocky Linux, CentOS, Windows Server (la cerere)." },
          { question: "Pot reinstala OS-ul?", answer: "Da, din panoul de control, oricând, cu rebuild în câteva minute." },
          { question: "Există panou de control?", answer: "Da, panou complet pentru power, console KVM, snapshots și rețea." },
          { question: "Pot adăuga IP-uri suplimentare?", answer: "Da, IP-uri IPv4 și IPv6 adiționale disponibile la cerere." },
        ],
      },
      cta: {
        enabled: true,
        title: "Lansează-ți VPS-ul în 5 minute",
        subtitle: "Plată lunară, fără contract pe termen lung.",
        ctaLabel: "Comandă VPS",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "vds",
    label: "VDS (Virtual Dedicated Server)",
    description: "Variantă VPS cu resurse 100% dedicate (template pre-completat)",
    group: "server",
    icon: "Server",
    category: "VDS",
    shortDescription: "VDS cu resurse 100% dedicate, izolare hardware completă și performanță predictibilă.",
    sections: {
      hero: {
        enabled: true,
        title: "VDS — performanță dedicată, preț de VPS",
        subtitle: "Resurse alocate 100%, fără overcommit. Izolare completă pentru workloads sensibile.",
        ctaLabel: "Vezi configurațiile",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "De ce VDS",
        items: [
          { icon: "Cpu", title: "CPU 100% dedicat", description: "Niciun alt client pe core-urile tale." },
          { icon: "HardDrive", title: "NVMe Enterprise", description: "Stocare cu IOPS predictibili." },
          { icon: "MemoryStick", title: "RAM rezervat", description: "Memorie alocată complet, fără ballooning." },
          { icon: "Network", title: "Bandwidth garantat", description: "Lățime de bandă constantă, fără throttling." },
          { icon: "ShieldCheck", title: "DDoS inclus", description: "Protecție 400+ Gbps activă." },
          { icon: "Terminal", title: "Acces root", description: "Control total asupra serverului tău." },
        ],
      },
      plans: {
        enabled: true,
        title: "Configurații VDS",
        items: [
          {
            name: "VDS Start",
            price: "€19.99/lună",
            description: "Resurse dedicate pentru workloads stabile.",
            features: ["2 cores dedicate", "8 GB RAM", "100 GB NVMe", "5 TB trafic", "DDoS inclus"],
            ctaUrl: "/order",
            popular: false,
          },
          {
            name: "VDS Pro",
            price: "€39.99/lună",
            description: "Cel mai ales raport performanță/preț.",
            features: ["4 cores dedicate", "16 GB RAM", "200 GB NVMe", "10 TB trafic", "2 IPv4"],
            ctaUrl: "/order",
            popular: true,
          },
          {
            name: "VDS Max",
            price: "€79.99/lună",
            description: "Pentru aplicații enterprise critice.",
            features: ["8 cores dedicate", "32 GB RAM", "500 GB NVMe", "20 TB trafic", "Snapshots"],
            ctaUrl: "/order",
            popular: false,
          },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări frecvente VDS",
        items: [
          { question: "Care e diferența față de VPS?", answer: "VDS oferă resurse complet dedicate, fără overcommit, cu performanță predictibilă apropiată de un server fizic." },
          { question: "Ce hipervizor folosiți?", answer: "KVM cu pinning de CPU pentru izolare hardware reală." },
          { question: "Pot folosi virtualizare imbricată?", answer: "Da, suport pentru nested virtualization la cerere." },
        ],
      },
      cta: {
        enabled: true,
        title: "Începe cu VDS azi",
        subtitle: "Resurse garantate, plată lunară, activare rapidă.",
        ctaLabel: "Comandă VDS",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "dedicated",
    label: "Dedicated Servers",
    description: "Servere fizice cu hardware Enterprise complet",
    group: "server",
    icon: "Cpu",
    category: "Dedicated",
    shortDescription: "Servere fizice complete cu hardware Enterprise, IPMI și DDoS inclus.",
    sections: {
      hero: {
        enabled: true,
        title: "Servere Dedicate Enterprise",
        subtitle: "Hardware fizic complet pentru tine — Intel Xeon, AMD EPYC, NVMe Enterprise, rețea 10 Gbps.",
        ctaLabel: "Vezi serverele",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "Hardware Enterprise",
        items: [
          { icon: "Cpu", title: "Intel Xeon / AMD EPYC", description: "Procesoare server-grade pentru workloads exigente." },
          { icon: "HardDrive", title: "NVMe Enterprise", description: "Storage de mare durabilitate cu DWPD ridicat." },
          { icon: "Network", title: "Uplink 10 Gbps", description: "Conectivitate de înaltă viteză către backbone." },
          { icon: "Settings", title: "IPMI/KVM remote", description: "Management complet la distanță, inclusiv consolă." },
          { icon: "ShieldCheck", title: "DDoS 400+ Gbps", description: "Protecție inclusă pentru toate IP-urile." },
          { icon: "Wrench", title: "Setup tehnic", description: "Configurare inițială și consultanță gratuită." },
        ],
      },
      plans: {
        enabled: true,
        title: "Servere disponibile",
        items: [
          {
            name: "DS Lite",
            price: "€69/lună",
            description: "Server intermediar pentru aplicații mid-range.",
            features: ["Intel Xeon E-2336", "32 GB DDR4 ECC", "2 x 480 GB NVMe", "10 TB trafic @ 1 Gbps", "DDoS inclus"],
            ctaUrl: "/order",
            popular: false,
          },
          {
            name: "DS Pro",
            price: "€129/lună",
            description: "Cel mai popular pentru web stack și game hosting.",
            features: ["AMD EPYC 7313P", "64 GB DDR4 ECC", "2 x 1 TB NVMe", "20 TB @ 1 Gbps", "IPMI inclus"],
            ctaUrl: "/order",
            popular: true,
          },
          {
            name: "DS Max",
            price: "€249/lună",
            description: "Putere brută pentru aplicații critice.",
            features: ["Dual Xeon Gold", "128 GB DDR4 ECC", "4 x 2 TB NVMe", "Uplink 10 Gbps", "RAID hardware"],
            ctaUrl: "/order",
            popular: false,
          },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări frecvente",
        items: [
          { question: "Cât durează provizionarea?", answer: "Setup tipic 2-24 ore în funcție de configurație." },
          { question: "Pot alege OS-ul?", answer: "Da, instalare automată cu Linux, BSD, Windows Server." },
          { question: "Există RAID?", answer: "RAID software inclus, RAID hardware disponibil pe planurile Max." },
          { question: "Pot închiria pe contract lunar?", answer: "Da, toate serverele sunt cu plată lunară fără termen minim." },
        ],
      },
      cta: {
        enabled: true,
        title: "Closează un server dedicat performant",
        subtitle: "Setup gratuit, IPMI și DDoS protection incluse.",
        ctaLabel: "Configurează serverul",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "game-servers",
    label: "Game Servers",
    description: "Hosting de jocuri cu DDoS și panou web",
    group: "games",
    icon: "Gamepad2",
    category: "Game Hosting",
    shortDescription: "Game servers cu CPU dedicat, panou web modern, DDoS de top și deploy instant.",
    sections: {
      hero: {
        enabled: true,
        title: "Game Servers cu performanță reală",
        subtitle: "Hardware optimizat pentru jocuri, panou web complet și DDoS Protection 400+ Gbps inclusă.",
        ctaLabel: "Alege jocul tău",
        ctaUrl: "/game-servers",
      },
      features: {
        enabled: true,
        title: "Făcut pentru gamers",
        items: [
          { icon: "Zap", title: "CPU înalt clock", description: "Procesoare cu single-thread performance excelent." },
          { icon: "HardDrive", title: "NVMe ultra-rapid", description: "Loading times minime și performanță constantă." },
          { icon: "ShieldCheck", title: "DDoS Protection", description: "Filtrare 400+ Gbps pe toate serverele." },
          { icon: "Settings", title: "Panou web modern", description: "Pornire/oprire, configurări, backup-uri în câteva click-uri." },
          { icon: "MapPin", title: "Locații EU multiple", description: "Latency redus pentru jucătorii din Europa." },
          { icon: "Headphones", title: "Suport gaming", description: "Echipă cu experiență în hosting de jocuri populare." },
        ],
      },
      plans: { enabled: false, title: "", items: [] },
      content: {
        enabled: true,
        title: "Jocuri suportate",
        markdown: "Suportăm Minecraft, FiveM, CS2, Rust, Palworld, ARK, GMod și multe altele.\nVezi catalogul complet în secțiunea /game-servers pentru planuri specifice fiecărui joc.",
      },
      faq: {
        enabled: true,
        title: "Întrebări frecvente",
        items: [
          { question: "Cât durează activarea?", answer: "Serverele se activează automat în 1-2 minute după plată." },
          { question: "Pot schimba jocul ulterior?", answer: "Da, suportăm switch între jocuri direct din panou." },
          { question: "Există backup automat?", answer: "Da, snapshots zilnice incluse pe toate planurile." },
        ],
      },
      cta: {
        enabled: true,
        title: "Lansează-ți serverul de joc",
        subtitle: "Activare instantă, panou modern, DDoS inclus.",
        ctaLabel: "Vezi catalogul",
        ctaUrl: "/game-servers",
      },
    },
  },

  {
    key: "reseller",
    label: "Reseller Hosting",
    description: "Vinde hosting sub brandul tău cu WHM",
    group: "web",
    icon: "Users",
    category: "Reseller",
    shortDescription: "Pornește-ți afacerea de hosting cu WHM, white-label complet și suport dedicat.",
    sections: {
      hero: {
        enabled: true,
        title: "Reseller Hosting white-label",
        subtitle: "Vinde hosting sub propriul brand cu WHM, branding complet și suport tehnic dedicat resellerilor.",
        ctaLabel: "Devino reseller",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "Tot ce-ți trebuie pentru a vinde hosting",
        items: [
          { icon: "Users", title: "WHM inclus", description: "Creează conturi cPanel pentru clienții tăi." },
          { icon: "Tag", title: "White-label", description: "Branding-ul tău, fără referințe Hoxta." },
          { icon: "FileText", title: "Facturare proprie", description: "Integrare cu WHMCS pentru facturare automată." },
          { icon: "Headphones", title: "Suport reseller", description: "Echipă tehnică dedicată partenerilor noștri." },
        ],
      },
      plans: { enabled: false, title: "", items: [] },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări reseller",
        items: [
          { question: "Câte conturi pot crea?", answer: "Numărul depinde de planul ales — de la 25 până la nelimitat." },
          { question: "Pot aloca resurse personalizate?", answer: "Da, fiecare cont cPanel are limite configurabile prin WHM." },
        ],
      },
      cta: {
        enabled: true,
        title: "Pornește-ți afacerea de hosting",
        subtitle: "Plată lunară, fără investiție inițială.",
        ctaLabel: "Vezi planurile reseller",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "discord-bot",
    label: "Discord Bot Hosting",
    description: "Hosting 24/7 pentru boți Discord",
    group: "moreHosting",
    icon: "Bot",
    category: "Bot Hosting",
    shortDescription: "Hosting 24/7 pentru boți Discord cu auto-restart, deploy din Git și SSH.",
    sections: {
      hero: {
        enabled: true,
        title: "Discord Bot Hosting 24/7",
        subtitle: "Botul tău rămâne online non-stop. Auto-restart, deploy din Git, suport Node.js, Python, Java și mai mult.",
        ctaLabel: "Pornește botul",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "Optimizat pentru boți",
        items: [
          { icon: "Bot", title: "Online 24/7", description: "Uptime 99.9% cu auto-restart la crash." },
          { icon: "GitBranch", title: "Deploy din Git", description: "Push în repo, restart automat al botului." },
          { icon: "Code", title: "Multi-runtime", description: "Node.js, Python, Java, Go, Rust suportate." },
          { icon: "Terminal", title: "SSH access", description: "Control complet prin terminal SSH." },
        ],
      },
      plans: {
        enabled: true,
        title: "Planuri Bot Hosting",
        items: [
          { name: "Bot Lite", price: "€2/lună", description: "Pentru boți mici, până în 100 servere.", features: ["512 MB RAM", "1 vCPU", "5 GB SSD", "Auto-restart"], ctaUrl: "/order", popular: false },
          { name: "Bot Pro", price: "€5/lună", description: "Pentru boți populari cu trafic mediu.", features: ["2 GB RAM", "2 vCPU", "20 GB SSD", "Deploy Git"], ctaUrl: "/order", popular: true },
          { name: "Bot Max", price: "€12/lună", description: "Pentru boți enterprise cu mii de servere.", features: ["8 GB RAM", "4 vCPU", "60 GB SSD", "DB inclusă"], ctaUrl: "/order", popular: false },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări boți",
        items: [
          { question: "Pot deploy direct din GitHub?", answer: "Da, integrare Git nativă cu auto-deploy la push." },
          { question: "Există bază de date inclusă?", answer: "Pe planul Max este inclusă o bază PostgreSQL/MySQL." },
        ],
      },
      cta: {
        enabled: true,
        title: "Pornește-ți botul în 2 minute",
        subtitle: "Setup rapid, plată lunară, fără termen contractual.",
        ctaLabel: "Comandă acum",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "teamspeak",
    label: "TeamSpeak Hosting",
    description: "Servere TeamSpeak 3 cu sloturi flexibile",
    group: "moreHosting",
    icon: "Mic",
    category: "Voice Hosting",
    shortDescription: "Servere TeamSpeak 3 cu calitate audio premium și sloturi flexibile.",
    sections: {
      hero: {
        enabled: true,
        title: "TeamSpeak Hosting premium",
        subtitle: "Servere TS3 stabile cu calitate audio HD și panou web complet de administrare.",
        ctaLabel: "Alege sloturile",
        ctaUrl: "/order",
      },
      features: {
        enabled: true,
        title: "Calitate voice premium",
        items: [
          { icon: "Mic", title: "Calitate HD audio", description: "Codec Opus pentru claritate excelentă." },
          { icon: "Users", title: "Sloturi flexibile", description: "De la 10 la 1000+ sloturi, scalare oricând." },
          { icon: "ShieldCheck", title: "DDoS Protection", description: "Voice fără întreruperi pentru clanul tău." },
          { icon: "Settings", title: "Panou web", description: "Administrare completă fără client TS." },
        ],
      },
      plans: {
        enabled: true,
        title: "Pachete TeamSpeak",
        items: [
          { name: "TS 32 sloturi", price: "€2.50/lună", description: "Perfect pentru un grup mic.", features: ["32 sloturi", "Custom port", "Panou web"], ctaUrl: "/order", popular: false },
          { name: "TS 64 sloturi", price: "€4.50/lună", description: "Cel mai ales pentru clanuri.", features: ["64 sloturi", "Backup", "Custom IP"], ctaUrl: "/order", popular: true },
          { name: "TS 128 sloturi", price: "€8/lună", description: "Pentru comunități mari.", features: ["128 sloturi", "Branding propriu", "Suport prioritar"], ctaUrl: "/order", popular: false },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări TeamSpeak",
        items: [
          { question: "Pot avea IP/port propriu?", answer: "Da, IP dedicat și port custom disponibile." },
          { question: "Există backup?", answer: "Backup automat zilnic al configurațiilor și permisiunilor." },
        ],
      },
      cta: {
        enabled: true,
        title: "Pornește-ți serverul TS3",
        subtitle: "Activare instantă, calitate HD, DDoS inclus.",
        ctaLabel: "Comandă TeamSpeak",
        ctaUrl: "/order",
      },
    },
  },

  {
    key: "colocation",
    label: "Colocation",
    description: "Găzduire fizică pentru hardware-ul tău",
    group: "moreHosting",
    icon: "HardDrive",
    category: "Colocation",
    shortDescription: "Colocation în datacenter European cu uplink 10 Gbps și DDoS Protection inclusă.",
    sections: {
      hero: {
        enabled: true,
        title: "Colocation în datacenter EU",
        subtitle: "Adu-ți propriul hardware. Noi îți oferim power, cooling, conectivitate și DDoS Protection.",
        ctaLabel: "Cere ofertă",
        ctaUrl: "/contact",
      },
      features: {
        enabled: true,
        title: "Infrastructură de top",
        items: [
          { icon: "Zap", title: "Power redundant", description: "Două surse independente cu UPS și generatoare." },
          { icon: "Wind", title: "Cooling profesional", description: "Sisteme N+1 pentru temperatură constantă." },
          { icon: "Network", title: "Uplink 10 Gbps+", description: "Carrier-neutral cu peering multiplu." },
          { icon: "Lock", title: "Acces securizat 24/7", description: "Acces fizic permanent cu autentificare biometrică." },
        ],
      },
      plans: {
        enabled: true,
        title: "Pachete Colocation",
        items: [
          { name: "1U", price: "€39/lună", description: "Pentru un server 1U standard.", features: ["1U rack space", "1 Gbps uplink", "5 TB trafic", "Power 200W"], ctaUrl: "/contact", popular: false },
          { name: "Quarter Rack", price: "€149/lună", description: "Până la 10U cu power generos.", features: ["10U rack", "10 Gbps uplink", "20 TB trafic", "Power 2 kW"], ctaUrl: "/contact", popular: true },
          { name: "Full Rack", price: "€499/lună", description: "Rack complet 42U pentru deploy mare.", features: ["42U rack", "10 Gbps uplink", "Trafic nelimitat", "Power 6 kW"], ctaUrl: "/contact", popular: false },
        ],
      },
      content: { enabled: false, title: "", markdown: "" },
      faq: {
        enabled: true,
        title: "Întrebări Colocation",
        items: [
          { question: "Pot avea remote hands?", answer: "Da, oferim remote hands pentru intervenții fizice 24/7." },
          { question: "Există acces fizic?", answer: "Da, acces 24/7 cu programare prealabilă." },
        ],
      },
      cta: {
        enabled: true,
        title: "Adu-ți hardware-ul în datacenter-ul nostru",
        subtitle: "Quote personalizat în 24 de ore.",
        ctaLabel: "Solicită ofertă",
        ctaUrl: "/contact",
      },
    },
  },
];
