import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CustomServiceMenuGroup = "web" | "games" | "server" | "moreHosting" | "helpInfo" | "more";

export interface CustomServiceFeatureItem {
  icon?: string;
  title: string;
  description?: string;
}

export interface CustomServicePlanItem {
  name: string;
  price: string;
  description?: string;
  features?: string[];
  ctaUrl?: string;
  popular?: boolean;
}

export interface CustomServiceFaqItem {
  question: string;
  answer: string;
}

export interface CustomServiceSections {
  hero?: {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  features?: {
    enabled: boolean;
    title?: string;
    items?: CustomServiceFeatureItem[];
  };
  plans?: {
    enabled: boolean;
    title?: string;
    items?: CustomServicePlanItem[];
  };
  content?: {
    enabled: boolean;
    title?: string;
    markdown?: string;
  };
  faq?: {
    enabled: boolean;
    title?: string;
    items?: CustomServiceFaqItem[];
  };
  cta?: {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
}

export interface CustomService {
  id: string;
  slug: string;
  name: string;
  menu_label: string | null;
  menu_description: string | null;
  menu_icon: string | null;
  menu_group: CustomServiceMenuGroup | string;
  category: string;
  tags: string[] | null;
  cover_image_url: string | null;
  short_description: string | null;
  sections: CustomServiceSections;
  translations: Record<string, any> | null;
  is_published: boolean;
  show_in_menu: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export function useCustomServices(opts: { onlyMenu?: boolean } = {}) {
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const query = supabase
        .from("custom_services")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (opts.onlyMenu) {
        query.eq("show_in_menu", true);
      }

      const { data, error } = await query;
      if (!mounted) return;
      if (!error && data) {
        setServices(data as unknown as CustomService[]);
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [opts.onlyMenu]);

  return { services, loading };
}

export function useCustomService(slug: string | undefined) {
  const [service, setService] = useState<CustomService | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("custom_services")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (!mounted) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        setService(data as unknown as CustomService);
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return { service, loading, notFound };
}
