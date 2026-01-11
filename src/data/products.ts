/**
 * Unified Product Catalog
 * Single source of truth for all hosting products and plans.
 * Used by pricing pages, order flow, and WHMCS integration.
 */

export type ProductCategory = 
  | "web-hosting"
  | "reseller-hosting"
  | "vps"
  | "dedicated"
  | "game-server";

export type BillingCycle = "monthly" | "quarterly" | "annually";

export interface ProductPlan {
  id: string;
  name: string;
  description?: string;
  popular?: boolean;
  whmcs_pid: number; // WHMCS Product ID
  pricing: {
    monthly: number;
    quarterly?: number;
    annually: number;
  };
  features: ProductFeature[];
  specs?: Record<string, string | number | boolean>;
}

export interface ProductFeature {
  label: string;
  value: string | boolean;
  highlight?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  icon?: string;
  plans: ProductPlan[];
  orderPageUrl: string;
}

// ============================================
// WEB HOSTING PRODUCTS
// ============================================

export const webHostingProduct: Product = {
  id: "web-hosting",
  slug: "web-hosting",
  name: "Web Hosting",
  category: "web-hosting",
  shortDescription: "Fast, secure shared hosting with NVMe storage",
  orderPageUrl: "/order",
  plans: [
    {
      id: "web-starter",
      name: "Starter",
      description: "Perfect for personal sites",
      whmcs_pid: 101,
      pricing: { monthly: 3.99, annually: 2.99 },
      features: [
        { label: "Website", value: "1" },
        { label: "SSD Storage", value: "10GB" },
        { label: "Bandwidth", value: "Unlimited" },
        { label: "Email Accounts", value: "5" },
        { label: "Free SSL Certificate", value: true },
        { label: "Daily Backups", value: true },
        { label: "24/7 Support", value: true },
      ],
      specs: { websites: 1, storage: 10, bandwidth: "Unlimited", emails: 5 },
    },
    {
      id: "web-professional",
      name: "Professional",
      description: "For growing businesses",
      popular: true,
      whmcs_pid: 102,
      pricing: { monthly: 8.99, annually: 6.99 },
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
      specs: { websites: -1, storage: 50, bandwidth: "Unlimited", emails: -1 },
    },
    {
      id: "web-business",
      name: "Business",
      description: "For high-traffic sites",
      whmcs_pid: 103,
      pricing: { monthly: 16.99, annually: 12.99 },
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
      specs: { websites: -1, storage: 100, bandwidth: "Unlimited", emails: -1, dedicatedIp: true },
    },
    {
      id: "web-enterprise",
      name: "Enterprise",
      description: "Maximum performance",
      whmcs_pid: 104,
      pricing: { monthly: 29.99, annually: 24.99 },
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
      specs: { websites: -1, storage: 250, bandwidth: "Unlimited", emails: -1, dedicatedResources: true },
    },
  ],
};

// ============================================
// RESELLER HOSTING PRODUCTS
// ============================================

export const resellerHostingProduct: Product = {
  id: "reseller-hosting",
  slug: "reseller-hosting",
  name: "Reseller Hosting",
  category: "reseller-hosting",
  shortDescription: "Start your hosting business with WHM/cPanel",
  orderPageUrl: "/order",
  plans: [
    {
      id: "reseller-starter",
      name: "Starter Reseller",
      description: "Start your hosting business",
      whmcs_pid: 201,
      pricing: { monthly: 19.99, annually: 14.99 },
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
      popular: true,
      whmcs_pid: 202,
      pricing: { monthly: 34.99, annually: 27.99 },
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
      whmcs_pid: 203,
      pricing: { monthly: 54.99, annually: 44.99 },
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
      whmcs_pid: 204,
      pricing: { monthly: 89.99, annually: 74.99 },
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
  ],
};

// ============================================
// VPS HOSTING PRODUCTS
// ============================================

export const vpsHostingProduct: Product = {
  id: "vps-hosting",
  slug: "vps",
  name: "VPS Hosting",
  category: "vps",
  shortDescription: "Full root access virtual private servers",
  orderPageUrl: "/order",
  plans: [
    {
      id: "vps-basic",
      name: "VPS Basic",
      description: "Entry-level virtual server",
      whmcs_pid: 301,
      pricing: { monthly: 12.99, annually: 9.99 },
      features: [
        { label: "vCPU Cores", value: "2" },
        { label: "RAM", value: "4GB" },
        { label: "NVMe Storage", value: "80GB" },
        { label: "Bandwidth", value: "4TB" },
        { label: "Root Access", value: true },
        { label: "DDoS Protection", value: true },
        { label: "Weekly Backups", value: true },
      ],
      specs: { vcpu: 2, ram: 4, storage: 80, bandwidth: "4TB" },
    },
    {
      id: "vps-standard",
      name: "VPS Standard",
      description: "Balanced performance",
      popular: true,
      whmcs_pid: 302,
      pricing: { monthly: 24.99, annually: 19.99 },
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
      specs: { vcpu: 4, ram: 8, storage: 160, bandwidth: "6TB" },
    },
    {
      id: "vps-advanced",
      name: "VPS Advanced",
      description: "High-performance server",
      whmcs_pid: 303,
      pricing: { monthly: 49.99, annually: 39.99 },
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
      specs: { vcpu: 6, ram: 16, storage: 320, bandwidth: "8TB" },
    },
    {
      id: "vps-enterprise",
      name: "VPS Enterprise",
      description: "Maximum power",
      whmcs_pid: 304,
      pricing: { monthly: 89.99, annually: 74.99 },
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
      specs: { vcpu: 8, ram: 32, storage: 640, bandwidth: "10TB" },
    },
  ],
};

// ============================================
// DEDICATED SERVER PRODUCTS
// ============================================

export const dedicatedServerProduct: Product = {
  id: "dedicated-servers",
  slug: "dedicated",
  name: "Dedicated Servers",
  category: "dedicated",
  shortDescription: "Bare metal servers with full hardware control",
  orderPageUrl: "/order",
  plans: [
    {
      id: "dedicated-starter",
      name: "Entry Dedicated",
      description: "Budget dedicated server",
      whmcs_pid: 401,
      pricing: { monthly: 79.99, annually: 69.99 },
      features: [
        { label: "CPU", value: "Intel Xeon E-2236" },
        { label: "RAM", value: "32GB DDR4" },
        { label: "Storage", value: "2x 500GB NVMe" },
        { label: "Bandwidth", value: "10TB" },
        { label: "Port Speed", value: "1Gbps" },
        { label: "DDoS Protection", value: true },
        { label: "Full Root Access", value: true },
      ],
    },
    {
      id: "dedicated-business",
      name: "Business Dedicated",
      description: "High-performance server",
      popular: true,
      whmcs_pid: 402,
      pricing: { monthly: 149.99, annually: 129.99 },
      features: [
        { label: "CPU", value: "Intel Xeon E-2288G" },
        { label: "RAM", value: "64GB DDR4" },
        { label: "Storage", value: "2x 1TB NVMe" },
        { label: "Bandwidth", value: "20TB" },
        { label: "Port Speed", value: "1Gbps" },
        { label: "Premium DDoS", value: true },
        { label: "IPMI Access", value: true },
        { label: "Priority Support", value: true },
      ],
    },
    {
      id: "dedicated-enterprise",
      name: "Enterprise Dedicated",
      description: "Maximum resources",
      whmcs_pid: 403,
      pricing: { monthly: 299.99, annually: 259.99 },
      features: [
        { label: "CPU", value: "AMD EPYC 7443P" },
        { label: "RAM", value: "128GB DDR4" },
        { label: "Storage", value: "4x 2TB NVMe" },
        { label: "Bandwidth", value: "Unlimited" },
        { label: "Port Speed", value: "10Gbps" },
        { label: "Enterprise DDoS", value: true },
        { label: "IPMI + KVM", value: true },
        { label: "Dedicated Support", value: true },
      ],
    },
  ],
};

// ============================================
// GAME SERVER PRODUCTS (Dynamic from gameServersData)
// ============================================

export interface GameServerProduct extends Product {
  gameSlug: string;
  pricingUnit: "slot" | "GB" | "month";
  basePrice: number;
}

export const gameServerProducts: GameServerProduct[] = [
  {
    id: "minecraft-server",
    slug: "minecraft",
    gameSlug: "minecraft",
    name: "Minecraft Server",
    category: "game-server",
    shortDescription: "Java & Bedrock servers",
    pricingUnit: "GB",
    basePrice: 0.50,
    orderPageUrl: "/order",
    plans: [
      {
        id: "mc-starter",
        name: "Starter",
        whmcs_pid: 501,
        pricing: { monthly: 3.00, annually: 2.50 },
        features: [
          { label: "RAM", value: "2GB" },
          { label: "Storage", value: "10GB NVMe" },
          { label: "Players", value: "Up to 10" },
          { label: "Basic mod support", value: true },
          { label: "Daily backups", value: true },
        ],
      },
      {
        id: "mc-standard",
        name: "Standard",
        popular: true,
        whmcs_pid: 502,
        pricing: { monthly: 6.00, annually: 5.00 },
        features: [
          { label: "RAM", value: "4GB" },
          { label: "Storage", value: "25GB NVMe" },
          { label: "Players", value: "Up to 30" },
          { label: "Full mod support", value: true },
          { label: "Hourly backups", value: true },
          { label: "Free subdomain", value: true },
        ],
      },
      {
        id: "mc-premium",
        name: "Premium",
        whmcs_pid: 503,
        pricing: { monthly: 12.00, annually: 10.00 },
        features: [
          { label: "RAM", value: "8GB" },
          { label: "Storage", value: "50GB NVMe" },
          { label: "Players", value: "Up to 100" },
          { label: "Priority support", value: true },
          { label: "Custom domain", value: true },
          { label: "MySQL database", value: true },
        ],
      },
      {
        id: "mc-enterprise",
        name: "Enterprise",
        whmcs_pid: 504,
        pricing: { monthly: 24.00, annually: 20.00 },
        features: [
          { label: "RAM", value: "16GB" },
          { label: "Storage", value: "100GB NVMe" },
          { label: "Players", value: "Unlimited" },
          { label: "Dedicated resources", value: true },
          { label: "Premium support", value: true },
          { label: "All features included", value: true },
        ],
      },
    ],
  },
  {
    id: "fivem-server",
    slug: "fivem",
    gameSlug: "fivem",
    name: "FiveM Server",
    category: "game-server",
    shortDescription: "GTA V roleplay servers",
    pricingUnit: "slot",
    basePrice: 1.40,
    orderPageUrl: "/order",
    plans: [
      {
        id: "fivem-starter",
        name: "Starter",
        whmcs_pid: 511,
        pricing: { monthly: 19.00, annually: 16.00 },
        features: [
          { label: "Slots", value: "32" },
          { label: "CPU", value: "2 vCores" },
          { label: "RAM", value: "4GB" },
          { label: "Storage", value: "30GB NVMe" },
          { label: "Basic scripts", value: true },
          { label: "Daily backups", value: true },
        ],
      },
      {
        id: "fivem-standard",
        name: "Standard",
        popular: true,
        whmcs_pid: 512,
        pricing: { monthly: 35.00, annually: 30.00 },
        features: [
          { label: "Slots", value: "64" },
          { label: "CPU", value: "4 vCores" },
          { label: "RAM", value: "8GB" },
          { label: "Storage", value: "60GB NVMe" },
          { label: "ESX/QBCore ready", value: true },
          { label: "Hourly backups", value: true },
          { label: "Priority support", value: true },
        ],
      },
      {
        id: "fivem-premium",
        name: "Premium",
        whmcs_pid: 513,
        pricing: { monthly: 65.00, annually: 55.00 },
        features: [
          { label: "Slots", value: "128" },
          { label: "CPU", value: "6 vCores" },
          { label: "RAM", value: "16GB" },
          { label: "Storage", value: "120GB NVMe" },
          { label: "Full framework support", value: true },
          { label: "Custom scripts", value: true },
          { label: "Dedicated resources", value: true },
        ],
      },
      {
        id: "fivem-enterprise",
        name: "Enterprise",
        whmcs_pid: 514,
        pricing: { monthly: 120.00, annually: 100.00 },
        features: [
          { label: "Slots", value: "Unlimited" },
          { label: "CPU", value: "8 vCores" },
          { label: "RAM", value: "32GB" },
          { label: "Storage", value: "250GB NVMe" },
          { label: "Maximum performance", value: true },
          { label: "24/7 priority support", value: true },
          { label: "Custom configurations", value: true },
        ],
      },
    ],
  },
  {
    id: "rust-server",
    slug: "rust",
    gameSlug: "rust",
    name: "Rust Server",
    category: "game-server",
    shortDescription: "Survival game servers",
    pricingUnit: "slot",
    basePrice: 1.00,
    orderPageUrl: "/order",
    plans: [
      {
        id: "rust-starter",
        name: "Starter",
        whmcs_pid: 521,
        pricing: { monthly: 20.00, annually: 17.00 },
        features: [
          { label: "Slots", value: "50" },
          { label: "CPU", value: "3 vCores" },
          { label: "RAM", value: "6GB" },
          { label: "Storage", value: "50GB NVMe" },
          { label: "3500 map size", value: true },
          { label: "Basic plugins", value: true },
        ],
      },
      {
        id: "rust-standard",
        name: "Standard",
        popular: true,
        whmcs_pid: 522,
        pricing: { monthly: 35.00, annually: 30.00 },
        features: [
          { label: "Slots", value: "100" },
          { label: "CPU", value: "4 vCores" },
          { label: "RAM", value: "10GB" },
          { label: "Storage", value: "80GB NVMe" },
          { label: "4500 map size", value: true },
          { label: "Full plugin support", value: true },
          { label: "Wipe scheduler", value: true },
        ],
      },
      {
        id: "rust-premium",
        name: "Premium",
        whmcs_pid: 523,
        pricing: { monthly: 60.00, annually: 50.00 },
        features: [
          { label: "Slots", value: "200" },
          { label: "CPU", value: "6 vCores" },
          { label: "RAM", value: "16GB" },
          { label: "Storage", value: "150GB NVMe" },
          { label: "Custom maps", value: true },
          { label: "Priority support", value: true },
          { label: "All features", value: true },
        ],
      },
      {
        id: "rust-enterprise",
        name: "Enterprise",
        whmcs_pid: 524,
        pricing: { monthly: 100.00, annually: 85.00 },
        features: [
          { label: "Slots", value: "500" },
          { label: "CPU", value: "8 vCores" },
          { label: "RAM", value: "32GB" },
          { label: "Storage", value: "300GB NVMe" },
          { label: "Maximum performance", value: true },
          { label: "Dedicated resources", value: true },
          { label: "Custom configurations", value: true },
        ],
      },
    ],
  },
];

// ============================================
// PRODUCT CATALOG HELPERS
// ============================================

export const allProducts: Product[] = [
  webHostingProduct,
  resellerHostingProduct,
  vpsHostingProduct,
  dedicatedServerProduct,
  ...gameServerProducts,
];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getPlanById(productSlug: string, planId: string): ProductPlan | undefined {
  const product = getProductBySlug(productSlug);
  return product?.plans.find((p) => p.id === planId);
}

export function getPlanPrice(plan: ProductPlan, billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case "monthly":
      return plan.pricing.monthly;
    case "quarterly":
      return plan.pricing.quarterly || plan.pricing.monthly * 3;
    case "annually":
      return plan.pricing.annually;
  }
}

export function getBillingCycleLabel(cycle: BillingCycle): string {
  switch (cycle) {
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "annually":
      return "Annually";
  }
}

export function getBillingCycleMonths(cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":
      return 1;
    case "quarterly":
      return 3;
    case "annually":
      return 12;
  }
}

export function calculateOrderTotal(
  plan: ProductPlan,
  billingCycle: BillingCycle,
  taxRate: number = 0
): { subtotal: number; tax: number; total: number } {
  const pricePerMonth = getPlanPrice(plan, billingCycle);
  const months = getBillingCycleMonths(billingCycle);
  const subtotal = pricePerMonth * months;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

export const paymentMethods = [
  { id: "stripe", name: "Credit Card", icon: "💳", description: "Visa, Mastercard, Amex" },
  { id: "paypal", name: "PayPal", icon: "🅿️", description: "Pay with PayPal balance or linked card" },
  { id: "crypto", name: "Cryptocurrency", icon: "₿", description: "Bitcoin, Ethereum, USDT" },
  { id: "paysafe", name: "Paysafecard", icon: "🎫", description: "Prepaid voucher payment" },
] as const;

export type PaymentMethodId = typeof paymentMethods[number]["id"];
