import { Plan, Feature, FAQItem } from "@/components/hosting";
import {
  Zap, Shield, Globe, Headphones, HardDrive, RefreshCw,
  Lock, Gauge, Server, Database, Mail, Cpu, Users, TrendingUp,
  Cloud, Layers, Settings
} from "lucide-react";

// ============================================
// WEB HOSTING DATA
// ============================================

export const webHostingPlans: Plan[] = [
  {
    id: "web-starter",
    name: "Starter",
    description: "Perfect for personal sites",
    monthlyPrice: 3.99,
    yearlyPrice: 2.99,
    features: [
      { label: "Website", value: "1" },
      { label: "SSD Storage", value: "10GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Email Accounts", value: "5" },
      { label: "Free SSL Certificate", value: true },
      { label: "Daily Backups", value: true },
      { label: "24/7 Support", value: true },
    ],
  },
  {
    id: "web-professional",
    name: "Professional",
    description: "For growing businesses",
    monthlyPrice: 8.99,
    yearlyPrice: 6.99,
    popular: true,
    features: [
      { label: "Websites", value: "Unlimited" },
      { label: "NVMe Storage", value: "50GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Email Accounts", value: "Unlimited" },
      { label: "Free SSL & CDN", value: true },
      { label: "Daily Backups", value: true },
      { label: "Staging Environment", value: true },
      { label: "Priority Support", value: true },
    ],
  },
  {
    id: "web-business",
    name: "Business",
    description: "For high-traffic sites",
    monthlyPrice: 16.99,
    yearlyPrice: 12.99,
    features: [
      { label: "Websites", value: "Unlimited" },
      { label: "NVMe Storage", value: "100GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Email Accounts", value: "Unlimited" },
      { label: "Free SSL & CDN", value: true },
      { label: "Daily Backups", value: true },
      { label: "Dedicated IP", value: true },
      { label: "White-label Branding", value: true },
      { label: "Premium Support", value: true },
    ],
  },
  {
    id: "web-enterprise",
    name: "Enterprise",
    description: "Maximum performance",
    monthlyPrice: 29.99,
    yearlyPrice: 24.99,
    features: [
      { label: "Websites", value: "Unlimited" },
      { label: "NVMe Storage", value: "250GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Email Accounts", value: "Unlimited" },
      { label: "Free SSL & CDN", value: true },
      { label: "Hourly Backups", value: true },
      { label: "Dedicated Resources", value: true },
      { label: "Custom Configurations", value: true },
      { label: "Dedicated Account Manager", value: true },
    ],
  },
];

export const webHostingFeatures: Feature[] = [
  {
    icon: Zap,
    title: "NVMe Speed",
    description: "Ultra-fast NVMe storage delivers up to 10x faster read/write than standard SSDs.",
  },
  {
    icon: Gauge,
    title: "LiteSpeed Cache",
    description: "Built-in caching accelerates WordPress and PHP sites automatically.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Multi-layer protection shields your site from volumetric and app-layer attacks.",
  },
  {
    icon: Lock,
    title: "Free SSL Certificates",
    description: "Automatic SSL secures all your domains with HTTPS.",
  },
  {
    icon: RefreshCw,
    title: "Daily Backups",
    description: "Automated backups with one-click restore keep your data safe.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Content delivery network with edge locations worldwide for faster loads.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Real human support via live chat, phone, and tickets — around the clock.",
  },
  {
    icon: Server,
    title: "99.9% Uptime SLA",
    description: "Industry-leading uptime backed by our service agreement.",
  },
];

export const webHostingFAQs: FAQItem[] = [
  {
    question: "What is web hosting and do I need it?",
    answer: "Web hosting lets you publish your website on the internet. Your files are stored on a server that's online 24/7. We provide the server space, tools, and support you need to run your site successfully.",
  },
  {
    question: "Can I transfer my existing website to Hoxta?",
    answer: "Yes! We offer free migration for all new customers. Our team will move your website, emails, and databases with zero downtime. Just submit a migration request after signing up.",
  },
  {
    question: "What control panel do you use?",
    answer: "We use cPanel — the industry-standard panel that makes managing your hosting easy. Handle files, databases, emails, and domains through a simple web interface.",
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes! We offer a 30-day money-back guarantee on all hosting plans. Not satisfied? Get a full refund, no questions asked.",
  },
  {
    question: "How many websites can I host?",
    answer: "It depends on your plan. Starter allows 1 site, while Professional, Business, and Enterprise allow unlimited. Each plan has different storage to fit your needs.",
  },
  {
    question: "Is SSL included with my hosting?",
    answer: "Yes! All plans include free SSL for all your domains. SSL is installed and renewed automatically, keeping your sites secure with HTTPS.",
  },
  {
    question: "What is NVMe storage?",
    answer: "NVMe is the fastest SSD storage available — up to 10x faster than standard SSDs. This means faster site loading, quicker database queries, and better overall performance.",
  },
  {
    question: "Do you support WordPress?",
    answer: "Absolutely! Our hosting is optimized for WordPress with one-click install, auto-updates, LiteSpeed caching, and specialized support. Higher-tier plans include managed WordPress features.",
  },
];

export const webHostingComparison = {
  plans: [
    { name: "Starter", price: "$2.99/mo" },
    { name: "Professional", price: "$6.99/mo" },
    { name: "Business", price: "$12.99/mo" },
    { name: "Enterprise", price: "$24.99/mo" },
  ],
  categories: [
    {
      name: "Resources",
      features: [
        { name: "Websites", values: ["1", "Unlimited", "Unlimited", "Unlimited"] },
        { name: "NVMe Storage", values: ["10GB", "50GB", "100GB", "250GB"] },
        { name: "Bandwidth", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
        { name: "Email Accounts", values: ["5", "Unlimited", "Unlimited", "Unlimited"] },
        { name: "Databases", values: ["5", "Unlimited", "Unlimited", "Unlimited"] },
      ],
    },
    {
      name: "Performance",
      features: [
        { name: "LiteSpeed Cache", values: [true, true, true, true] },
        { name: "Free CDN", values: [false, true, true, true] },
        { name: "Dedicated Resources", values: [false, false, false, true] },
        { name: "HTTP/3 Support", values: [true, true, true, true] },
      ],
    },
    {
      name: "Security & Backup",
      features: [
        { name: "Free SSL", values: [true, true, true, true] },
        { name: "Daily Backups", values: [true, true, true, true] },
        { name: "Dedicated IP", values: [false, false, true, true] },
        { name: "Advanced Firewall", values: [false, true, true, true] },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "24/7 Support", values: [true, true, true, true] },
        { name: "Priority Support", values: [false, true, true, true] },
        { name: "Dedicated Account Manager", values: [false, false, false, true] },
      ],
    },
  ],
};

// ============================================
// RESELLER HOSTING DATA
// ============================================

export const resellerHostingPlans: Plan[] = [
  {
    id: "reseller-starter",
    name: "Starter Reseller",
    description: "Start your hosting business",
    monthlyPrice: 19.99,
    yearlyPrice: 14.99,
    features: [
      { label: "cPanel Accounts", value: "20" },
      { label: "SSD Storage", value: "60GB" },
      { label: "Bandwidth", value: "600GB" },
      { label: "Free WHM/cPanel", value: true },
      { label: "White-label Branding", value: true },
      { label: "Free SSL Certificates", value: true },
      { label: "Private Nameservers", value: true },
    ],
  },
  {
    id: "reseller-business",
    name: "Business Reseller",
    description: "For growing reseller businesses",
    monthlyPrice: 34.99,
    yearlyPrice: 27.99,
    popular: true,
    features: [
      { label: "cPanel Accounts", value: "50" },
      { label: "NVMe Storage", value: "120GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Free WHM/cPanel", value: true },
      { label: "White-label Branding", value: true },
      { label: "WHMCS License", value: true },
      { label: "Priority Support", value: true },
      { label: "Free Website Migration", value: true },
    ],
  },
  {
    id: "reseller-pro",
    name: "Pro Reseller",
    description: "Scale your hosting empire",
    monthlyPrice: 54.99,
    yearlyPrice: 44.99,
    features: [
      { label: "cPanel Accounts", value: "100" },
      { label: "NVMe Storage", value: "200GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Free WHM/cPanel", value: true },
      { label: "White-label Branding", value: true },
      { label: "WHMCS License", value: true },
      { label: "Dedicated IP", value: true },
      { label: "Premium Support", value: true },
    ],
  },
  {
    id: "reseller-enterprise",
    name: "Enterprise Reseller",
    description: "Maximum resources",
    monthlyPrice: 89.99,
    yearlyPrice: 74.99,
    features: [
      { label: "cPanel Accounts", value: "Unlimited" },
      { label: "NVMe Storage", value: "400GB" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Free WHM/cPanel", value: true },
      { label: "Full White-label", value: true },
      { label: "WHMCS License", value: true },
      { label: "Multiple Dedicated IPs", value: true },
      { label: "Dedicated Account Manager", value: true },
    ],
  },
];

export const resellerHostingFeatures: Feature[] = [
  {
    icon: Users,
    title: "Unlimited Clients",
    description: "Host as many clients as your plan allows with individual cPanel accounts for each.",
  },
  {
    icon: Layers,
    title: "White-label Branding",
    description: "Fully rebrand the hosting experience as your own with custom nameservers and branding.",
  },
  {
    icon: Settings,
    title: "WHM Control Panel",
    description: "Manage all your clients from a single, powerful Web Host Manager interface.",
  },
  {
    icon: Database,
    title: "WHMCS Integration",
    description: "Automate billing, provisioning, and support with included WHMCS license.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Resources",
    description: "Easily upgrade your reseller plan as your business grows without migration.",
  },
  {
    icon: Shield,
    title: "Account Isolation",
    description: "CloudLinux ensures each account is isolated for security and resource fairness.",
  },
  {
    icon: Headphones,
    title: "White-label Support",
    description: "Get expert support behind the scenes that you can rebrand as your own.",
  },
  {
    icon: Cloud,
    title: "Free Migrations",
    description: "We'll migrate all your existing clients' websites and emails at no extra cost.",
  },
];

export const resellerHostingFAQs: FAQItem[] = [
  {
    question: "What is reseller hosting?",
    answer: "Reseller hosting allows you to start your own web hosting business. You purchase hosting resources from us in bulk and then resell them to your own clients under your brand. You manage your clients through WHM (Web Host Manager) while we handle the server infrastructure.",
  },
  {
    question: "Do I need technical knowledge to start?",
    answer: "While some technical knowledge is helpful, it's not required. WHM and cPanel are user-friendly, and we provide extensive documentation. Plus, our 24/7 support team can assist with any technical issues, allowing you to focus on growing your business.",
  },
  {
    question: "Can I set my own pricing?",
    answer: "Absolutely! You have complete control over your pricing. Set your own rates, create custom packages, and keep 100% of the profits. There are no restrictions on how you price or package your hosting services.",
  },
  {
    question: "Is WHMCS included?",
    answer: "WHMCS is included free with our Business Reseller plan and above. WHMCS automates billing, account provisioning, and support ticket management, making it essential for running a professional hosting business.",
  },
  {
    question: "Can my clients see that I'm reselling?",
    answer: "No! Our reseller hosting is completely white-label. Your clients will see your branding, your nameservers, and your company name everywhere. They won't know you're reselling unless you tell them.",
  },
  {
    question: "How do I upgrade my reseller plan?",
    answer: "Upgrading is seamless. Simply contact our support or upgrade through your client area. Your resources will be increased instantly without any downtime or migration required.",
  },
];

export const resellerHostingComparison = {
  plans: [
    { name: "Starter", price: "$14.99/mo" },
    { name: "Business", price: "$27.99/mo" },
    { name: "Pro", price: "$44.99/mo" },
    { name: "Enterprise", price: "$74.99/mo" },
  ],
  categories: [
    {
      name: "Resources",
      features: [
        { name: "cPanel Accounts", values: ["20", "50", "100", "Unlimited"] },
        { name: "NVMe Storage", values: ["60GB", "120GB", "200GB", "400GB"] },
        { name: "Bandwidth", values: ["600GB", "Unlimited", "Unlimited", "Unlimited"] },
      ],
    },
    {
      name: "Management",
      features: [
        { name: "WHM Access", values: [true, true, true, true] },
        { name: "WHMCS License", values: [false, true, true, true] },
        { name: "Private Nameservers", values: [true, true, true, true] },
        { name: "White-label Branding", values: [true, true, true, true] },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "24/7 Support", values: [true, true, true, true] },
        { name: "Priority Support", values: [false, true, true, true] },
        { name: "Dedicated Account Manager", values: [false, false, false, true] },
      ],
    },
  ],
};

// ============================================
// VPS HOSTING DATA
// ============================================

export const vpsHostingPlans: Plan[] = [
  {
    id: "vps-basic",
    name: "VPS Basic",
    description: "Entry-level virtual server",
    monthlyPrice: 12.99,
    yearlyPrice: 9.99,
    features: [
      { label: "vCPU Cores", value: "2" },
      { label: "RAM", value: "4GB" },
      { label: "NVMe Storage", value: "80GB" },
      { label: "Bandwidth", value: "4TB" },
      { label: "Root Access", value: true },
      { label: "DDoS Protection", value: true },
      { label: "Weekly Backups", value: true },
    ],
  },
  {
    id: "vps-standard",
    name: "VPS Standard",
    description: "Balanced performance",
    monthlyPrice: 24.99,
    yearlyPrice: 19.99,
    popular: true,
    features: [
      { label: "vCPU Cores", value: "4" },
      { label: "RAM", value: "8GB" },
      { label: "NVMe Storage", value: "160GB" },
      { label: "Bandwidth", value: "6TB" },
      { label: "Root Access", value: true },
      { label: "DDoS Protection", value: true },
      { label: "Daily Backups", value: true },
      { label: "Free cPanel Option", value: true },
    ],
  },
  {
    id: "vps-advanced",
    name: "VPS Advanced",
    description: "High-performance server",
    monthlyPrice: 49.99,
    yearlyPrice: 39.99,
    features: [
      { label: "vCPU Cores", value: "6" },
      { label: "RAM", value: "16GB" },
      { label: "NVMe Storage", value: "320GB" },
      { label: "Bandwidth", value: "8TB" },
      { label: "Root Access", value: true },
      { label: "Enhanced DDoS", value: true },
      { label: "Daily Backups", value: true },
      { label: "Priority Support", value: true },
    ],
  },
  {
    id: "vps-enterprise",
    name: "VPS Enterprise",
    description: "Maximum power",
    monthlyPrice: 89.99,
    yearlyPrice: 74.99,
    features: [
      { label: "vCPU Cores", value: "8" },
      { label: "RAM", value: "32GB" },
      { label: "NVMe Storage", value: "640GB" },
      { label: "Bandwidth", value: "10TB" },
      { label: "Root Access", value: true },
      { label: "Premium DDoS", value: true },
      { label: "Hourly Backups", value: true },
      { label: "Dedicated Support", value: true },
    ],
  },
];

export const vpsHostingFeatures: Feature[] = [
  {
    icon: Cpu,
    title: "Dedicated Resources",
    description: "Guaranteed CPU, RAM, and storage that's never shared or oversold.",
  },
  {
    icon: HardDrive,
    title: "NVMe SSD Storage",
    description: "Enterprise-grade NVMe drives delivering exceptional I/O performance.",
  },
  {
    icon: Lock,
    title: "Full Root Access",
    description: "Complete control over your server with SSH root access and full customization.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Multi-layer DDoS mitigation protecting against volumetric and protocol attacks.",
  },
  {
    icon: Server,
    title: "Choice of OS",
    description: "Deploy your preferred Linux distribution or Windows Server edition.",
  },
  {
    icon: Zap,
    title: "Instant Provisioning",
    description: "Your VPS is ready within minutes of order completion, not hours.",
  },
  {
    icon: RefreshCw,
    title: "Automated Backups",
    description: "Scheduled automatic backups with easy point-in-time recovery options.",
  },
  {
    icon: Gauge,
    title: "Scalable Resources",
    description: "Upgrade CPU, RAM, and storage on-demand without data migration.",
  },
];

export const vpsHostingFAQs: FAQItem[] = [
  {
    question: "What is VPS hosting?",
    answer: "VPS (Virtual Private Server) hosting provides you with dedicated resources on a virtualized server. Unlike shared hosting, your CPU, RAM, and storage are guaranteed and not affected by other users. It offers the control of a dedicated server at a fraction of the cost.",
  },
  {
    question: "VPS vs. Shared Hosting: What's the difference?",
    answer: "Shared hosting shares server resources among multiple users, while VPS provides dedicated, guaranteed resources. VPS offers better performance, more control (root access), and improved security. It's ideal when you've outgrown shared hosting or need specific server configurations.",
  },
  {
    question: "Do I get root access?",
    answer: "Yes! All our VPS plans include full root access, giving you complete control over your server. Install any software, configure custom settings, and manage your server exactly as you need.",
  },
  {
    question: "What operating systems are available?",
    answer: "We offer a wide range of operating systems including Ubuntu, CentOS, Debian, AlmaLinux, Rocky Linux, and Windows Server. You can also upload your own ISO for custom installations.",
  },
  {
    question: "Is my VPS managed or unmanaged?",
    answer: "Our VPS plans are unmanaged by default, giving you full control. However, we offer optional managed services including server monitoring, security patches, and cPanel installation for an additional fee.",
  },
  {
    question: "Can I upgrade my VPS later?",
    answer: "Absolutely! You can upgrade your CPU, RAM, and storage at any time through your control panel. Upgrades are applied instantly without data loss or server migration.",
  },
  {
    question: "What control panel options are available?",
    answer: "You can install any control panel you prefer. We offer one-click installation for cPanel, Plesk, DirectAdmin, and free options like CyberPanel and Webmin. Control panel licenses are available as add-ons.",
  },
];

export const vpsHostingComparison = {
  plans: [
    { name: "Basic", price: "$9.99/mo" },
    { name: "Standard", price: "$19.99/mo" },
    { name: "Advanced", price: "$39.99/mo" },
    { name: "Enterprise", price: "$74.99/mo" },
  ],
  categories: [
    {
      name: "Hardware",
      features: [
        { name: "vCPU Cores", values: ["2", "4", "6", "8"] },
        { name: "RAM", values: ["4GB", "8GB", "16GB", "32GB"] },
        { name: "NVMe Storage", values: ["80GB", "160GB", "320GB", "640GB"] },
        { name: "Bandwidth", values: ["4TB", "6TB", "8TB", "10TB"] },
      ],
    },
    {
      name: "Features",
      features: [
        { name: "Root Access", values: [true, true, true, true] },
        { name: "DDoS Protection", values: [true, true, true, true] },
        { name: "IPv4 Address", values: ["1", "1", "2", "3"] },
        { name: "IPv6 Support", values: [true, true, true, true] },
      ],
    },
    {
      name: "Backup & Support",
      features: [
        { name: "Backup Frequency", values: ["Weekly", "Daily", "Daily", "Hourly"] },
        { name: "Snapshot Slots", values: ["1", "3", "5", "10"] },
        { name: "Priority Support", values: [false, false, true, true] },
      ],
    },
  ],
};
