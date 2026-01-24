/**
 * Product Catalog for Edge Functions
 * Maps plan IDs to WHMCS product IDs
 * Must stay in sync with src/data/products.ts
 */

export interface ProductMapping {
  planId: string;
  whmcsPid: number;
  name: string;
  category: string;
}

// Complete product mapping from products.ts
export const PRODUCT_MAP: Record<string, ProductMapping> = {
  // Web Hosting
  'web-starter': { planId: 'web-starter', whmcsPid: 101, name: 'Web Hosting Starter', category: 'web-hosting' },
  'web-professional': { planId: 'web-professional', whmcsPid: 102, name: 'Web Hosting Professional', category: 'web-hosting' },
  'web-business': { planId: 'web-business', whmcsPid: 103, name: 'Web Hosting Business', category: 'web-hosting' },
  'web-enterprise': { planId: 'web-enterprise', whmcsPid: 104, name: 'Web Hosting Enterprise', category: 'web-hosting' },

  // Reseller Hosting
  'reseller-starter': { planId: 'reseller-starter', whmcsPid: 201, name: 'Starter Reseller', category: 'reseller-hosting' },
  'reseller-business': { planId: 'reseller-business', whmcsPid: 202, name: 'Business Reseller', category: 'reseller-hosting' },
  'reseller-pro': { planId: 'reseller-pro', whmcsPid: 203, name: 'Pro Reseller', category: 'reseller-hosting' },
  'reseller-enterprise': { planId: 'reseller-enterprise', whmcsPid: 204, name: 'Enterprise Reseller', category: 'reseller-hosting' },

  // VPS
  'vps-basic': { planId: 'vps-basic', whmcsPid: 301, name: 'VPS Basic', category: 'vps' },
  'vps-standard': { planId: 'vps-standard', whmcsPid: 302, name: 'VPS Standard', category: 'vps' },
  'vps-advanced': { planId: 'vps-advanced', whmcsPid: 303, name: 'VPS Advanced', category: 'vps' },
  'vps-enterprise': { planId: 'vps-enterprise', whmcsPid: 304, name: 'VPS Enterprise', category: 'vps' },

  // Dedicated
  'dedicated-starter': { planId: 'dedicated-starter', whmcsPid: 401, name: 'Entry Dedicated', category: 'dedicated' },
  'dedicated-business': { planId: 'dedicated-business', whmcsPid: 402, name: 'Business Dedicated', category: 'dedicated' },
  'dedicated-enterprise': { planId: 'dedicated-enterprise', whmcsPid: 403, name: 'Enterprise Dedicated', category: 'dedicated' },

  // Minecraft
  'mc-starter': { planId: 'mc-starter', whmcsPid: 501, name: 'Minecraft Starter', category: 'games' },
  'mc-standard': { planId: 'mc-standard', whmcsPid: 502, name: 'Minecraft Standard', category: 'games' },
  'mc-premium': { planId: 'mc-premium', whmcsPid: 503, name: 'Minecraft Premium', category: 'games' },
  'mc-enterprise': { planId: 'mc-enterprise', whmcsPid: 504, name: 'Minecraft Enterprise', category: 'games' },

  // FiveM
  'fivem-starter': { planId: 'fivem-starter', whmcsPid: 511, name: 'FiveM Starter', category: 'games' },
  'fivem-standard': { planId: 'fivem-standard', whmcsPid: 512, name: 'FiveM Standard', category: 'games' },
  'fivem-premium': { planId: 'fivem-premium', whmcsPid: 513, name: 'FiveM Premium', category: 'games' },
  'fivem-enterprise': { planId: 'fivem-enterprise', whmcsPid: 514, name: 'FiveM Enterprise', category: 'games' },

  // Rust
  'rust-starter': { planId: 'rust-starter', whmcsPid: 521, name: 'Rust Starter', category: 'games' },
  'rust-standard': { planId: 'rust-standard', whmcsPid: 522, name: 'Rust Standard', category: 'games' },
  'rust-premium': { planId: 'rust-premium', whmcsPid: 523, name: 'Rust Premium', category: 'games' },
  'rust-enterprise': { planId: 'rust-enterprise', whmcsPid: 524, name: 'Rust Enterprise', category: 'games' },

  // CS2
  'cs2-starter': { planId: 'cs2-starter', whmcsPid: 531, name: 'CS2 Starter', category: 'games' },
  'cs2-standard': { planId: 'cs2-standard', whmcsPid: 532, name: 'CS2 Standard', category: 'games' },
  'cs2-premium': { planId: 'cs2-premium', whmcsPid: 533, name: 'CS2 Premium', category: 'games' },
  'cs2-enterprise': { planId: 'cs2-enterprise', whmcsPid: 534, name: 'CS2 Enterprise', category: 'games' },

  // Valheim
  'valheim-starter': { planId: 'valheim-starter', whmcsPid: 541, name: 'Valheim Starter', category: 'games' },
  'valheim-standard': { planId: 'valheim-standard', whmcsPid: 542, name: 'Valheim Standard', category: 'games' },
  'valheim-premium': { planId: 'valheim-premium', whmcsPid: 543, name: 'Valheim Premium', category: 'games' },
  'valheim-enterprise': { planId: 'valheim-enterprise', whmcsPid: 544, name: 'Valheim Enterprise', category: 'games' },

  // ARK
  'ark-starter': { planId: 'ark-starter', whmcsPid: 551, name: 'ARK Starter', category: 'games' },
  'ark-standard': { planId: 'ark-standard', whmcsPid: 552, name: 'ARK Standard', category: 'games' },
  'ark-premium': { planId: 'ark-premium', whmcsPid: 553, name: 'ARK Premium', category: 'games' },
  'ark-enterprise': { planId: 'ark-enterprise', whmcsPid: 554, name: 'ARK Enterprise', category: 'games' },

  // DayZ
  'dayz-starter': { planId: 'dayz-starter', whmcsPid: 561, name: 'DayZ Starter', category: 'games' },
  'dayz-standard': { planId: 'dayz-standard', whmcsPid: 562, name: 'DayZ Standard', category: 'games' },
  'dayz-premium': { planId: 'dayz-premium', whmcsPid: 563, name: 'DayZ Premium', category: 'games' },
  'dayz-enterprise': { planId: 'dayz-enterprise', whmcsPid: 564, name: 'DayZ Enterprise', category: 'games' },

  // ARMA 3
  'arma3-starter': { planId: 'arma3-starter', whmcsPid: 571, name: 'ARMA 3 Starter', category: 'games' },
  'arma3-standard': { planId: 'arma3-standard', whmcsPid: 572, name: 'ARMA 3 Standard', category: 'games' },
  'arma3-premium': { planId: 'arma3-premium', whmcsPid: 573, name: 'ARMA 3 Premium', category: 'games' },
  'arma3-enterprise': { planId: 'arma3-enterprise', whmcsPid: 574, name: 'ARMA 3 Enterprise', category: 'games' },

  // Garry's Mod
  'gmod-starter': { planId: 'gmod-starter', whmcsPid: 581, name: "Garry's Mod Starter", category: 'games' },
  'gmod-standard': { planId: 'gmod-standard', whmcsPid: 582, name: "Garry's Mod Standard", category: 'games' },
  'gmod-premium': { planId: 'gmod-premium', whmcsPid: 583, name: "Garry's Mod Premium", category: 'games' },
  'gmod-enterprise': { planId: 'gmod-enterprise', whmcsPid: 584, name: "Garry's Mod Enterprise", category: 'games' },

  // 7 Days to Die
  '7dtd-starter': { planId: '7dtd-starter', whmcsPid: 591, name: '7 Days to Die Starter', category: 'games' },
  '7dtd-standard': { planId: '7dtd-standard', whmcsPid: 592, name: '7 Days to Die Standard', category: 'games' },
  '7dtd-premium': { planId: '7dtd-premium', whmcsPid: 593, name: '7 Days to Die Premium', category: 'games' },
  '7dtd-enterprise': { planId: '7dtd-enterprise', whmcsPid: 594, name: '7 Days to Die Enterprise', category: 'games' },

  // Project Zomboid
  'pz-starter': { planId: 'pz-starter', whmcsPid: 601, name: 'Project Zomboid Starter', category: 'games' },
  'pz-standard': { planId: 'pz-standard', whmcsPid: 602, name: 'Project Zomboid Standard', category: 'games' },
  'pz-premium': { planId: 'pz-premium', whmcsPid: 603, name: 'Project Zomboid Premium', category: 'games' },
  'pz-enterprise': { planId: 'pz-enterprise', whmcsPid: 604, name: 'Project Zomboid Enterprise', category: 'games' },

  // Palworld
  'palworld-starter': { planId: 'palworld-starter', whmcsPid: 611, name: 'Palworld Starter', category: 'games' },
  'palworld-standard': { planId: 'palworld-standard', whmcsPid: 612, name: 'Palworld Standard', category: 'games' },
  'palworld-premium': { planId: 'palworld-premium', whmcsPid: 613, name: 'Palworld Premium', category: 'games' },
  'palworld-enterprise': { planId: 'palworld-enterprise', whmcsPid: 614, name: 'Palworld Enterprise', category: 'games' },

  // Colocation
  'colo-quarter': { planId: 'colo-quarter', whmcsPid: 701, name: 'Quarter Rack', category: 'colocation' },
  'colo-half': { planId: 'colo-half', whmcsPid: 702, name: 'Half Rack', category: 'colocation' },
  'colo-full': { planId: 'colo-full', whmcsPid: 703, name: 'Full Rack', category: 'colocation' },

  // TeamSpeak
  'ts-small': { planId: 'ts-small', whmcsPid: 711, name: 'TeamSpeak Small', category: 'voip' },
  'ts-medium': { planId: 'ts-medium', whmcsPid: 712, name: 'TeamSpeak Medium', category: 'voip' },
  'ts-large': { planId: 'ts-large', whmcsPid: 713, name: 'TeamSpeak Large', category: 'voip' },
  'ts-enterprise': { planId: 'ts-enterprise', whmcsPid: 714, name: 'TeamSpeak Enterprise', category: 'voip' },

  // Discord Bot
  'bot-hobby': { planId: 'bot-hobby', whmcsPid: 721, name: 'Bot Hobby', category: 'bots' },
  'bot-standard': { planId: 'bot-standard', whmcsPid: 722, name: 'Bot Standard', category: 'bots' },
  'bot-professional': { planId: 'bot-professional', whmcsPid: 723, name: 'Bot Professional', category: 'bots' },
  'bot-enterprise': { planId: 'bot-enterprise', whmcsPid: 724, name: 'Bot Enterprise', category: 'bots' },

  // DDoS Protection
  'ddos-standard': { planId: 'ddos-standard', whmcsPid: 801, name: 'DDoS Standard', category: 'security' },
  'ddos-advanced': { planId: 'ddos-advanced', whmcsPid: 802, name: 'DDoS Advanced', category: 'security' },
  'ddos-enterprise': { planId: 'ddos-enterprise', whmcsPid: 803, name: 'DDoS Enterprise', category: 'security' },
};

// Billing cycle mapping
export const BILLING_CYCLE_MAP: Record<string, string> = {
  'monthly': 'monthly',
  'quarterly': 'quarterly',
  'annually': 'annually',
  'yearly': 'annually',
};

/**
 * Get product info by plan ID
 */
export function getProductByPlanId(planId: string): ProductMapping | null {
  return PRODUCT_MAP[planId] || null;
}

/**
 * Validate plan ID exists
 */
export function isValidPlanId(planId: string): boolean {
  return planId in PRODUCT_MAP;
}

/**
 * Get WHMCS PID from plan ID
 */
export function getWhmcsPid(planId: string): number | null {
  const product = PRODUCT_MAP[planId];
  return product?.whmcsPid || null;
}
