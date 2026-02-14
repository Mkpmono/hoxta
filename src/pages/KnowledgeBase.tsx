import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { Link } from "react-router-dom";
// Content fetched from PHP backend
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { 
  Search, BookOpen, Server, Shield, Settings, Users, Zap,
  HelpCircle, ChevronRight, Clock, Eye, ArrowRight, Gamepad2,
  Globe, Database, Terminal, CreditCard, Pencil
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  Zap, Gamepad2, Server, Shield, CreditCard, HelpCircle, Users, Globe, Database, Settings, BookOpen, Terminal,
};

const colorMap: Record<string, string> = {
  "getting-started": "from-green-500/20 to-green-500/5",
  "game-servers": "from-blue-500/20 to-blue-500/5",
  "vps-dedicated": "from-purple-500/20 to-purple-500/5",
  "security-ddos": "from-red-500/20 to-red-500/5",
  "billing-account": "from-yellow-500/20 to-yellow-500/5",
  "troubleshooting": "from-orange-500/20 to-orange-500/5",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  article_count?: number;
}

interface Article {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useKBAdmin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = "https://api.hoxta.com";
        const [catRes, artRes] = await Promise.all([
          fetch(`${API_BASE}/content/kb-categories.php`).then(r => r.ok ? r.json() : []),
          fetch(`${API_BASE}/content/kb-articles.php`).then(r => r.ok ? r.json() : []),
        ]);
        
        const cats = (catRes.categories || catRes || []) as Category[];
        const arts = (artRes.articles || artRes || []) as Article[];
        
        cats.forEach(cat => {
          cat.article_count = arts.filter(a => a.category_id === cat.id).length;
        });
        
        setCategories(cats);
        setArticles(arts);
      } catch {
        // API not available
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, articles]);

  const featuredArticles = useMemo(() => articles.filter(a => a.is_featured).slice(0, 4), [articles]);
  const recentArticles = useMemo(() => articles.slice(0, 5), [articles]);

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "";
  const getCategorySlug = (id: string | null) => categories.find(c => c.id === id)?.slug || "";

  return (
    <Layout>
      <SEOHead 
        title="Knowledge Base | Hoxta Hosting"
        description="Find tutorials, guides, and troubleshooting articles for game servers, VPS, web hosting, and more."
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Knowledge Base</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How Can We <span className="text-primary">Help You?</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse tutorials, guides, and troubleshooting articles to get the most out of your hosting services.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for articles, tutorials, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base bg-card/60 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Admin button */}
            {isAdmin && (
              <div className="mt-4">
                <Link to="/kb-admin">
                  <Button size="sm" variant="outline" className="gap-1 border-primary/30 text-primary">
                    <Pencil className="w-3.5 h-3.5" /> Manage Articles
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search results */}
      {searchQuery && (
        <section className="pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Search Results ({filteredArticles.length} articles)
            </h2>
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredArticles.map(article => (
                  <Link key={article.id} to={`/knowledge-base/article/${article.slug}`}>
                    <div className="group glass-card p-5 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">{getCategoryName(article.category_id)}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />{article.views}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                      {article.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No articles found matching your search.</p>
            )}
          </div>
        </section>
      )}

      {/* Quick Links */}
      {!searchQuery && (
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Terminal, label: "API Documentation", href: "/knowledge-base" },
                { icon: Database, label: "Database Guides", href: "/knowledge-base" },
                { icon: Globe, label: "Domain Setup", href: "/knowledge-base" },
                { icon: Settings, label: "Control Panel", href: "/knowledge-base" },
              ].map((link, index) => (
                <Link key={index} to={link.href}>
                  <Button variant="outline" className="btn-outline gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">Find articles organized by topic</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card p-6 h-40 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => {
                  const Icon = iconMap[category.icon || "Zap"] || Zap;
                  const color = colorMap[category.slug] || "from-cyan-500/20 to-cyan-500/5";
                  return (
                    <Link key={category.id} to={`/knowledge-base/${category.slug}`}>
                      <div className="group glass-card p-6 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(25,195,255,0.12)] hover:-translate-y-1">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} border border-border/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{category.article_count || 0} articles</span>
                          <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {!searchQuery && featuredArticles.length > 0 && (
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Popular Articles</h2>
              <p className="text-muted-foreground">Most viewed guides and tutorials</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article.id} to={`/knowledge-base/article/${article.slug}`}>
                  <div className="group glass-card p-6 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(25,195,255,0.12)]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">{getCategoryName(article.category_id)}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {!searchQuery && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-6">Recently Updated</h2>
                <div className="space-y-4">
                  {recentArticles.length > 0 ? recentArticles.map((article) => (
                    <Link key={article.id} to={`/knowledge-base/article/${article.slug}`}>
                      <div className="group flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                          <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div>
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{article.title}</h4>
                            <span className="text-sm text-muted-foreground">{getCategoryName(article.category_id)}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground hidden sm:block">{new Date(article.updated_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-muted-foreground">No articles published yet.</p>
                  )}
                </div>
              </div>
              <div>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Need More Help?</h3>
                  <p className="text-sm text-muted-foreground mb-6">Can't find what you're looking for? Our support team is available 24/7.</p>
                  <div className="space-y-3">
                    <Link to="/panel/tickets/new">
                      <Button className="w-full btn-glow">Open Support Ticket</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full btn-outline">Contact Us</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default KnowledgeBase;
