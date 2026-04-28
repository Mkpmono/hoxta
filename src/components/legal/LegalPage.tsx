import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface LegalPageProps {
  slug: "terms" | "privacy";
  defaultTitle: string;
}

export function LegalPage({ slug, defaultTitle }: LegalPageProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("legal_pages")
        .select("title, content, translations")
        .eq("slug", slug)
        .maybeSingle();
      if (!mounted) return;
      if (data) {
        const tr = ((data as any).translations || {})[lang];
        setTitle((tr?.title as string) || data.title || defaultTitle);
        setContent((tr?.content as string) || data.content || "");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slug, lang, defaultTitle]);

  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>
          <div className="glass-card p-8 prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
