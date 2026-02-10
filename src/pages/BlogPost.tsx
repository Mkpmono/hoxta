import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  author: string;
  author_role: string | null;
  image_url: string | null;
  tags: string[];
  read_time: string | null;
  views: number;
  created_at: string;
}

function ShareButton({ icon: Icon, label, onClick, className = "" }: { icon: any; label: string; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`p-2.5 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 ${className}`} aria-label={label}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^\s*/, '<p>')
    .replace(/\s*$/, '</p>');
}

export default function BlogPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", postId)
        .eq("is_published", true)
        .maybeSingle();

      if (data) {
        setPost(data as BlogPostData);
        // Increment views
        supabase.from("blog_posts").update({ views: (data.views || 0) + 1 }).eq("id", data.id).then();
        // Fetch related posts
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("is_published", true)
          .neq("id", data.id)
          .eq("category", data.category)
          .limit(3);
        if (related) setRelatedPosts(related as BlogPostData[]);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-glow">Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = post.title;
  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank");
  const shareToFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  const shareToLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); toast.success("Link copied!"); setTimeout(() => setCopied(false), 2000); };

  const defaultImage = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop";

  return (
    <Layout>
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <button onClick={() => navigate("/blog")} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/20 text-primary border-0">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs">{post.author_role || "Team"}</p>
                </div>
              </div>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.read_time || "5 min read"}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden mb-10">
              <img src={post.image_url || defaultImage} alt={post.title} className="w-full aspect-[2/1] object-cover" />
            </div>

            <div className="flex items-center justify-between py-4 border-y border-border/50 mb-10">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton icon={Twitter} label="Share on Twitter" onClick={shareToTwitter} />
                <ShareButton icon={Facebook} label="Share on Facebook" onClick={shareToFacebook} />
                <ShareButton icon={Linkedin} label="Share on LinkedIn" onClick={shareToLinkedIn} />
                <ShareButton icon={copied ? Check : Copy} label="Copy link" onClick={copyLink} className={copied ? "border-green-500 text-green-500" : ""} />
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div
                className="text-muted-foreground leading-relaxed
                  [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:mt-10 [&>h1]:mb-4
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-10 [&>h2]:mb-4
                  [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:mt-8 [&>h3]:mb-3
                  [&>p]:mb-4
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
                  [&>li]:mb-2
                  [&>pre]:bg-card [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4
                  [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
                  [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full
                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic
                  [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4
                  [&_th]:border [&_th]:border-border/50 [&_th]:p-2 [&_th]:bg-card [&_th]:text-left
                  [&_td]:border [&_td]:border-border/50 [&_td]:p-2
                  [&>strong]:text-foreground [&>strong]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(markdownToHtml(post.content), {
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'pre', 'code', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'br', 'img'],
                    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
                  })
                }}
              />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-12">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-border/50">{tag}</Badge>
                ))}
              </div>
            )}
          </motion.div>

          {relatedPosts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="max-w-6xl mx-auto mt-16 pt-16 border-t border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group block bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img src={relatedPost.image_url || defaultImage} alt={relatedPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="text-xs border-border/50 mb-3">{relatedPost.category}</Badge>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{relatedPost.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{relatedPost.read_time || "5 min read"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </Layout>
  );
}
