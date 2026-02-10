import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";

// Simple markdown to HTML converter
function markdownToHtml(md: string): string {
  let html = md
    // headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-foreground mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h1>')
    // bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm">$1</code>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    // unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>')
    // code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black/30 border border-border/30 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-foreground/90">$2</code></pre>')
    // paragraphs (lines not already wrapped)
    .replace(/^(?!<[hluop]|<li|<pre|<code)(.+)$/gm, '<p class="text-muted-foreground leading-relaxed mb-4">$1</p>')
    // wrap consecutive lis in ul
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/g, '<ul class="space-y-1 my-4">$&</ul>');
  return html;
}

export default function KBArticle() {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("kb_articles")
        .select("*")
        .eq("slug", articleSlug)
        .eq("is_published", true)
        .maybeSingle();
      if (data) {
        setArticle(data);
        // increment views
        supabase.from("kb_articles").update({ views: (data.views || 0) + 1 }).eq("id", data.id).then();
        // fetch category
        if (data.category_id) {
          const { data: cat } = await supabase.from("kb_categories").select("*").eq("id", data.category_id).maybeSingle();
          setCategory(cat);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [articleSlug]);

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <Link to="/knowledge-base">
              <Button variant="outline">Back to Knowledge Base</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const htmlContent = DOMPurify.sanitize(markdownToHtml(article.content));

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/knowledge-base" className="hover:text-primary transition-colors">Knowledge Base</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/knowledge-base/${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{article.title}</span>
          </div>

          {/* Article */}
          <div className="glass-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
              {category && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{category.name}</span>
              )}
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{article.views}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(article.updated_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-6">{article.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          <div className="mt-6">
            <Link to="/knowledge-base">
              <Button variant="outline" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
