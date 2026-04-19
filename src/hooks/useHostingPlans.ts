import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HostingPlanRow {
  id: string;
  category: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string;
  price_value: number;
  pricing_display: string;
  billing_cycle: string;
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  bandwidth: string | null;
  locations: string[] | null;
  os: string | null;
  features: string[];
  hero_points: string[] | null;
  faqs: any;
  order_url: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  popular: boolean;
  is_published: boolean;
  sort_order: number | null;
  translations: any;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch published hosting plans for a given category.
 * Used by public pages (Web, Reseller, VPS, Dedicated, etc.)
 */
export function useHostingPlans(category: string) {
  const [plans, setPlans] = useState<HostingPlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from("hosting_plans")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (mounted) {
          setPlans((data || []) as HostingPlanRow[]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [category]);

  return { plans, loading };
}

/**
 * Convert a HostingPlanRow into the legacy `Plan` shape used by `PricingPlans`.
 */
export function rowToPlan(row: HostingPlanRow) {
  return {
    id: row.slug,
    name: row.name,
    description: row.short_description,
    monthlyPrice: Number(row.price_value),
    popular: row.popular,
    features: (row.features || []).map((f) => ({ label: f, value: true as const })),
    cta: row.order_url ? { text: "", href: row.order_url } : undefined,
  };
}
