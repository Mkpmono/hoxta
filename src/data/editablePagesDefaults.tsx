import {
  Mail, MessageCircle, MapPin, Clock, Ticket, Briefcase, Send, Headphones,
  Globe, Shield, Users, Award, Zap, Cpu, Heart, HeartHandshake, Rocket,
  Server, Target, Eye, Gem, Sparkles, Star, Settings, BookOpen, HardDrive,
} from "lucide-react";

export const PAGE_ICONS = {
  Mail, MessageCircle, MapPin, Clock, Ticket, Briefcase, Send, Headphones,
  Globe, Shield, Users, Award, Zap, Cpu, Heart, HeartHandshake, Rocket,
  Server, Target, Eye, Gem, Sparkles, Star, Settings, BookOpen, HardDrive,
} as const;

export type PageIconName = keyof typeof PAGE_ICONS;

export const PAGE_ICON_OPTIONS: PageIconName[] = Object.keys(PAGE_ICONS) as PageIconName[];

export function PageIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (PAGE_ICONS as any)[name] || Sparkles;
  return <Icon className={className} />;
}

// ───── Contact page defaults ─────
export interface ContactActionCard {
  icon: string; title: string; description: string; ctaLabel: string; ctaUrl: string;
}
export interface ContactInfoRow {
  label: string; value: string; href?: string;
}
export interface ContactInfoCard {
  icon: string; title: string; rows: ContactInfoRow[];
}
export interface ContactTrustItem { icon: string; label: string; }

export interface ContactPageContent {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  actionCards: ContactActionCard[];
  formTitle: string;
  formSubtitle: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formSubjectLabel: string;
  formSubjectPlaceholder: string;
  formSubjectOptions: string[];
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formSubmitLabel: string;
  formSuccessMessage: string;
  infoCards: ContactInfoCard[];
  trustItems: ContactTrustItem[];
}

export const DEFAULT_CONTACT: ContactPageContent = {
  badge: "24/7 Support",
  titlePart1: "Get in",
  titlePart2: "Touch",
  subtitle: "We're here to help. Contact our team anytime — we respond in hours, not days.",
  actionCards: [
    { icon: "Ticket", title: "Support Ticket", description: "Technical issues? Open a ticket and our experts will help you solve them quickly.", ctaLabel: "Open Ticket", ctaUrl: "https://billing.hoxta.com/submitticket.php" },
    { icon: "MessageCircle", title: "Live Chat", description: "Need quick help? Chat with our team in real-time.", ctaLabel: "Start Chat", ctaUrl: "#live-chat" },
    { icon: "Briefcase", title: "Sales Inquiry", description: "Custom solutions or enterprise pricing? Let's discuss your needs.", ctaLabel: "Email Sales", ctaUrl: "mailto:sales@hoxta.com" },
  ],
  formTitle: "Send Us a Message",
  formSubtitle: "Fill out the form below and we will contact you within 24 hours.",
  formNameLabel: "Your Name",
  formNamePlaceholder: "John Doe",
  formEmailLabel: "Email Address",
  formEmailPlaceholder: "john@example.com",
  formSubjectLabel: "Subject",
  formSubjectPlaceholder: "Select a topic",
  formSubjectOptions: ["General Inquiry", "Technical Support", "Sales Question", "Billing Issue", "Partnership"],
  formMessageLabel: "Message",
  formMessagePlaceholder: "Describe your question or issue...",
  formSubmitLabel: "Send Message",
  formSuccessMessage: "Your message has been sent! We will get back to you within 24 hours.",
  infoCards: [
    { icon: "Mail", title: "Email", rows: [
      { label: "General", value: "info@hoxta.com", href: "mailto:info@hoxta.com" },
      { label: "Support", value: "support@hoxta.com", href: "mailto:support@hoxta.com" },
      { label: "Sales", value: "sales@hoxta.com", href: "mailto:sales@hoxta.com" },
    ]},
    { icon: "Clock", title: "Support Hours", rows: [
      { label: "Technical Support", value: "24/7/365" },
      { label: "Sales", value: "Mon-Fri 9AM-6PM EST" },
      { label: "Billing Question", value: "Mon-Fri 9AM-6PM EST" },
    ]},
    { icon: "Globe", title: "Connect", rows: [
      { label: "Discord", value: "Community", href: "https://discord.gg/ju7ADq4ZqY" },
      { label: "Twitter / X", value: "@hoxta", href: "https://twitter.com/hoxta" },
      { label: "Status Page", value: "status.hoxta.com", href: "/status" },
    ]},
  ],
  trustItems: [
    { icon: "Shield", label: "99.9% Uptime SLA" },
    { icon: "Clock", label: "< 15min Response" },
    { icon: "Headphones", label: "24/7/365 Support" },
    { icon: "MapPin", label: "Bucharest, RO" },
  ],
};

// ───── About page defaults ─────
export interface AboutStat { icon: string; value: string; label: string; }
export interface AboutValue { icon: string; title: string; description: string; }
export interface AboutTimelineItem { year: string; title: string; description: string; }

export interface AboutPageContent {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  stats: AboutStat[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValue[];
  timelineTitle: string;
  timelineSubtitle: string;
  timeline: AboutTimelineItem[];
}

export const DEFAULT_ABOUT: AboutPageContent = {
  badge: "About",
  titlePart1: "Premium Hosting",
  titlePart2: "Built for Performance",
  subtitle: "We provide reliable, high-performance hosting infrastructure for gamers, developers, and businesses worldwide.",
  stats: [
    { icon: "Users", value: "10,000+", label: "Active Customers" },
    { icon: "Award", value: "99.9%", label: "Uptime SLA" },
    { icon: "Globe", value: "5", label: "Data Centers" },
    { icon: "Zap", value: "24/7", label: "Expert Support" },
  ],
  missionTitle: "Our Mission",
  missionText: "To provide the most reliable, high-performance hosting infrastructure that empowers gamers and developers to build amazing experiences — without worrying about servers.",
  visionTitle: "Our Vision",
  visionText: "To become the most trusted hosting provider in Europe — known for speed, transparency, and a community-driven approach.",
  valuesTitle: "What Drives Us",
  valuesSubtitle: "The principles behind every server we deploy and every client we support.",
  values: [
    { icon: "Shield", title: "Security First", description: "DDoS protection and proactive monitoring on every service." },
    { icon: "Cpu", title: "High Performance", description: "NVMe storage, AMD EPYC processors, and low-latency networks." },
    { icon: "HeartHandshake", title: "Client Focused", description: "Your success is our priority. We listen, adapt, and deliver." },
    { icon: "Clock", title: "Instant Deployment", description: "Services provisioned in minutes, not hours. No waiting." },
    { icon: "Headphones", title: "Expert Support", description: "Real people, real solutions. Available 24/7." },
    { icon: "Rocket", title: "Always Innovating", description: "Constantly upgrading our infrastructure and adding new features." },
  ],
  timelineTitle: "Our Journey",
  timelineSubtitle: "From a small idea to thousands of happy customers.",
  timeline: [
    { year: "2022", title: "Founded", description: "Hoxta was born from a passion for reliable and accessible hosting." },
    { year: "2023", title: "1,000 Clients", description: "We reached our first major milestone with a growing community." },
    { year: "2024", title: "Global Expansion", description: "Opened new data centers across Europe to serve clients better." },
    { year: "2025", title: "10,000+ Clients", description: "Trusted by thousands of gamers, developers, and businesses." },
    { year: "2026", title: "Always Improving", description: "Continuing to innovate and deliver the best hosting experience." },
  ],
};
