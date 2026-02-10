import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, LogIn, ShieldAlert, Eye, EyeOff, Star, StarOff, ArrowLeft, BookOpen
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
}

interface Article {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  is_published: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

// Login form
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">KB Admin Login</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full btn-glow" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// No access
function NoAccess() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges to manage the Knowledge Base.</p>
          <Link to="/knowledge-base">
            <Button variant="outline">Back to Knowledge Base</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

// Article editor
function ArticleEditor({ article, categories, onSave, onCancel }: {
  article: Partial<Article> | null;
  categories: Category[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [categoryId, setCategoryId] = useState(article?.category_id || "");
  const [isPublished, setIsPublished] = useState(article?.is_published || false);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!article?.id) setSlug(generateSlug(val));
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Title *</label>
          <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Slug *</label>
          <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="article-slug" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Category</label>
          <select
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <Button
            type="button"
            variant={isPublished ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPublished(!isPublished)}
            className="gap-1"
          >
            {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isPublished ? "Published" : "Draft"}
          </Button>
          <Button
            type="button"
            variant={isFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => setIsFeatured(!isFeatured)}
            className="gap-1"
          >
            {isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
            Featured
          </Button>
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
        <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Content (Markdown) *</label>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your article in Markdown..."
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={() => onSave({ title, slug, content, excerpt, category_id: categoryId || null, is_published: isPublished, is_featured: isFeatured })} className="btn-glow gap-1">
          <Save className="w-4 h-4" /> Save Article
        </Button>
        <Button variant="outline" onClick={onCancel} className="gap-1">
          <X className="w-4 h-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// Main admin panel
export default function KBAdmin() {
  const { isAdmin, loading: authLoading, user } = useKBAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tab, setTab] = useState<"articles" | "categories">("articles");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  // Category editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Zap");

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [catRes, artRes] = await Promise.all([
      supabase.from("kb_categories").select("*").order("sort_order"),
      supabase.from("kb_articles").select("*").order("created_at", { ascending: false }),
    ]);
    if (catRes.data) setCategories(catRes.data as Category[]);
    if (artRes.data) setArticles(artRes.data as Article[]);
  };

  const saveArticle = async (data: any) => {
    if (!data.title || !data.slug || !data.content) {
      toast.error("Title, slug, and content are required");
      return;
    }
    if (editingArticle?.id) {
      const { error } = await supabase.from("kb_articles").update(data).eq("id", editingArticle.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Article updated!");
    } else {
      const { error } = await supabase.from("kb_articles").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Article created!");
    }
    setEditingArticle(null);
    setIsCreating(false);
    fetchData();
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("kb_articles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Article deleted");
    fetchData();
  };

  const saveCategory = async () => {
    if (!newCatName || !newCatSlug) { toast.error("Name and slug are required"); return; }
    const data = { name: newCatName, slug: newCatSlug, description: newCatDesc, icon: newCatIcon };
    if (editingCategory) {
      const { error } = await supabase.from("kb_categories").update(data).eq("id", editingCategory.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Category updated!");
    } else {
      const { error } = await supabase.from("kb_categories").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Category created!");
    }
    resetCategoryForm();
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("kb_categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Category deleted");
    fetchData();
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
    setNewCatIcon("Zap");
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatDesc(cat.description || "");
    setNewCatIcon(cat.icon || "Zap");
  };

  if (authLoading) {
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

  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NoAccess />;

  const filteredArticles = filterCategory
    ? articles.filter(a => a.category_id === filterCategory)
    : articles;

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "—";

  if (isCreating || editingArticle) {
    return (
      <Layout>
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                {editingArticle?.id ? "Edit Article" : "New Article"}
              </h1>
            </div>
            <div className="glass-card p-6">
              <ArticleEditor
                article={editingArticle}
                categories={categories}
                onSave={saveArticle}
                onCancel={() => { setEditingArticle(null); setIsCreating(false); }}
              />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">KB Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/knowledge-base">
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowLeft className="w-4 h-4" /> View KB
                </Button>
              </Link>
              <Button
                size="sm"
                className="btn-glow gap-1"
                onClick={() => { setIsCreating(true); setEditingArticle({}); }}
              >
                <Plus className="w-4 h-4" /> New Article
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={tab === "articles" ? "default" : "outline"} size="sm" onClick={() => setTab("articles")}>
              Articles ({articles.length})
            </Button>
            <Button variant={tab === "categories" ? "default" : "outline"} size="sm" onClick={() => setTab("categories")}>
              Categories ({categories.length})
            </Button>
          </div>

          {tab === "articles" && (
            <>
              {/* Filter */}
              <div className="mb-4">
                <select
                  className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Articles table */}
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-4 text-muted-foreground font-medium">Title</th>
                        <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                        <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Status</th>
                        <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Views</th>
                        <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.map(article => (
                        <tr key={article.id} className="border-b border-border/10 hover:bg-white/[0.02]">
                          <td className="p-4">
                            <div className="font-medium text-foreground">{article.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">/{article.slug}</div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">
                            {getCategoryName(article.category_id)}
                          </td>
                          <td className="p-4 hidden sm:table-cell text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              article.is_published
                                ? "bg-green-500/10 text-green-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {article.is_published ? "Published" : "Draft"}
                            </span>
                            {article.is_featured && (
                              <span className="inline-flex ml-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="p-4 hidden sm:table-cell text-center text-muted-foreground">
                            {article.views}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingArticle(article)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete article?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete "{article.title}". This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteArticle(article.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredArticles.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No articles found. Create your first article!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === "categories" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category form */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Name *</label>
                    <Input value={newCatName} onChange={e => { setNewCatName(e.target.value); if (!editingCategory) setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Slug *</label>
                    <Input value={newCatSlug} onChange={e => setNewCatSlug(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                    <Input value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Icon (Lucide name)</label>
                    <Input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="Zap, Shield, Server..." />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCategory} className="btn-glow gap-1">
                      <Save className="w-4 h-4" /> {editingCategory ? "Update" : "Create"}
                    </Button>
                    {editingCategory && (
                      <Button variant="outline" onClick={resetCategoryForm}>Cancel</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories list */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Existing Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-border/20">
                      <div>
                        <div className="font-medium text-foreground text-sm">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">/{cat.slug} · {cat.icon}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEditCategory(cat)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete category?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete "{cat.name}". Articles in this category won't be deleted but will lose their category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
