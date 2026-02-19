import { Layout } from "@/components/layout/Layout";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, LogOut, Save, X, FileText, BookOpen, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type Tab = "articles" | "categories" | "blog";

interface KBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
}

interface KBArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  views: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  is_published: boolean;
  is_featured: boolean;
  views: number;
  tags: string[] | null;
  image_url: string | null;
}

export default function KBAdmin() {
  const { logout } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("articles");
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingArticle, setEditingArticle] = useState<Partial<KBArticle> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<KBCategory> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    const [catRes, artRes, blogRes] = await Promise.all([
      supabase.from("kb_categories").select("*").order("sort_order"),
      supabase.from("kb_articles").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);
    setCategories(catRes.data || []);
    setArticles(artRes.data || []);
    setBlogPosts(blogRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ========= ARTICLE CRUD =========
  const saveArticle = async () => {
    if (!editingArticle?.title || !editingArticle?.slug) return;
    const payload = {
      title: editingArticle.title,
      slug: editingArticle.slug,
      excerpt: editingArticle.excerpt || null,
      content: editingArticle.content || "",
      category_id: editingArticle.category_id || null,
      is_published: editingArticle.is_published ?? false,
      is_featured: editingArticle.is_featured ?? false,
    };

    if (editingArticle.id) {
      const { error } = await supabase.from("kb_articles").update(payload).eq("id", editingArticle.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("kb_articles").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" });
    setEditingArticle(null);
    fetchData();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("kb_articles").delete().eq("id", id);
    fetchData();
  };

  // ========= CATEGORY CRUD =========
  const saveCategory = async () => {
    if (!editingCategory?.name || !editingCategory?.slug) return;
    const payload = {
      name: editingCategory.name,
      slug: editingCategory.slug,
      description: editingCategory.description || null,
      icon: editingCategory.icon || null,
      sort_order: editingCategory.sort_order ?? 0,
    };

    if (editingCategory.id) {
      const { error } = await supabase.from("kb_categories").update(payload).eq("id", editingCategory.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("kb_categories").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" });
    setEditingCategory(null);
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("kb_categories").delete().eq("id", id);
    fetchData();
  };

  // ========= BLOG CRUD =========
  const saveBlog = async () => {
    if (!editingBlog?.title || !editingBlog?.slug) return;
    const payload = {
      title: editingBlog.title,
      slug: editingBlog.slug,
      excerpt: editingBlog.excerpt || null,
      content: editingBlog.content || "",
      category: editingBlog.category || "General",
      author: editingBlog.author || "Hoxta Team",
      is_published: editingBlog.is_published ?? false,
      is_featured: editingBlog.is_featured ?? false,
      tags: editingBlog.tags || [],
      image_url: editingBlog.image_url || null,
    };

    if (editingBlog.id) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingBlog.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" });
    setEditingBlog(null);
    fetchData();
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchData();
  };

  const uploadImage = async (file: File, target: "blog" | "article") => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${target}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("article-images").upload(fileName, file, { upsert: true });
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
      const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
      toast({ title: "Image uploaded!" });
      return urlData.publicUrl;
    } catch {
      toast({ title: "Upload error", variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "blog");
    if (url) setEditingBlog((prev) => prev ? { ...prev, image_url: url } : prev);
  };

  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "article");
    if (url && editingArticle) {
      const imgMd = `\n![${file.name}](${url})\n`;
      setEditingArticle((prev) => prev ? { ...prev, content: (prev.content || "") + imgMd } : prev);
      toast({ title: "Image inserted into content!" });
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Content Admin</h1>
              <p className="text-sm text-muted-foreground">Manage KB articles, categories, and blog posts</p>
            </div>
            <div className="flex gap-2">
              <Link to="/status-admin">
                <Button variant="outline" size="sm">Status Admin</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-card/50 rounded-lg p-1 border border-border/50 mb-6">
            {([
              { key: "articles" as Tab, label: "KB Articles", icon: FileText },
              { key: "categories" as Tab, label: "Categories", icon: BookOpen },
              { key: "blog" as Tab, label: "Blog Posts", icon: FileText },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors flex-1 justify-center",
                  tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="glass-card p-4 rounded-xl animate-pulse h-16" />)}
            </div>
          ) : (
            <>
              {/* ======= ARTICLES TAB ======= */}
              {tab === "articles" && !editingArticle && (
                <div>
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={() => setEditingArticle({ is_published: false, is_featured: false, content: "" })}>
                      <Plus className="w-4 h-4 mr-1" /> New Article
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {articles.map((a) => (
                      <div key={a.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-medium text-foreground">{a.title}</span>
                          <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", a.is_published ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground")}>
                            {a.is_published ? "Published" : "Draft"}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.slug} · {a.views} views</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingArticle(a)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteArticle(a.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                        </div>
                      </div>
                    ))}
                    {articles.length === 0 && <p className="text-center text-muted-foreground py-8">No articles yet.</p>}
                  </div>
                </div>
              )}

              {tab === "articles" && editingArticle && (
                <div className="glass-card p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-foreground">{editingArticle.id ? "Edit Article" : "New Article"}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setEditingArticle(null)}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={editingArticle.title || ""} onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })} /></div>
                    <div><Label>Slug</Label><Input value={editingArticle.slug || ""} onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })} /></div>
                  </div>
                  <div><Label>Excerpt</Label><Input value={editingArticle.excerpt || ""} onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} /></div>
                  <div>
                    <Label>Category</Label>
                    <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={editingArticle.category_id || ""} onChange={(e) => setEditingArticle({ ...editingArticle, category_id: e.target.value || null })}>
                      <option value="">No category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label>Content (Markdown)</Label>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleArticleImageUpload} />
                        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                          <span><Image className="w-4 h-4 mr-1" />{uploading ? "Uploading..." : "Insert Image"}</span>
                        </Button>
                      </label>
                    </div>
                    <Textarea rows={12} value={editingArticle.content || ""} onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })} />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2"><Switch checked={editingArticle.is_published ?? false} onCheckedChange={(v) => setEditingArticle({ ...editingArticle, is_published: v })} /><Label>Published</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={editingArticle.is_featured ?? false} onCheckedChange={(v) => setEditingArticle({ ...editingArticle, is_featured: v })} /><Label>Featured</Label></div>
                  </div>
                  <Button onClick={saveArticle}><Save className="w-4 h-4 mr-1" /> Save Article</Button>
                </div>
              )}

              {/* ======= CATEGORIES TAB ======= */}
              {tab === "categories" && !editingCategory && (
                <div>
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={() => setEditingCategory({ sort_order: 0 })}>
                      <Plus className="w-4 h-4 mr-1" /> New Category
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {categories.map((c) => (
                      <div key={c.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-medium text-foreground">{c.icon} {c.name}</span>
                          <p className="text-xs text-muted-foreground">{c.slug} · order: {c.sort_order}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingCategory(c)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(c.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && <p className="text-center text-muted-foreground py-8">No categories yet.</p>}
                  </div>
                </div>
              )}

              {tab === "categories" && editingCategory && (
                <div className="glass-card p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-foreground">{editingCategory.id ? "Edit Category" : "New Category"}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setEditingCategory(null)}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Name</Label><Input value={editingCategory.name || ""} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} /></div>
                    <div><Label>Slug</Label><Input value={editingCategory.slug || ""} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Icon (emoji)</Label><Input value={editingCategory.icon || ""} onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })} /></div>
                    <div><Label>Sort Order</Label><Input type="number" value={editingCategory.sort_order ?? 0} onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea rows={3} value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} /></div>
                  <Button onClick={saveCategory}><Save className="w-4 h-4 mr-1" /> Save Category</Button>
                </div>
              )}

              {/* ======= BLOG TAB ======= */}
              {tab === "blog" && !editingBlog && (
                <div>
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={() => setEditingBlog({ is_published: false, is_featured: false, content: "", category: "General", author: "Hoxta Team" })}>
                      <Plus className="w-4 h-4 mr-1" /> New Blog Post
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {blogPosts.map((p) => (
                      <div key={p.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-medium text-foreground">{p.title}</span>
                          <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", p.is_published ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground")}>
                            {p.is_published ? "Published" : "Draft"}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.category} · {p.author} · {p.views} views</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditingBlog(p)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteBlog(p.id!)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                        </div>
                      </div>
                    ))}
                    {blogPosts.length === 0 && <p className="text-center text-muted-foreground py-8">No blog posts yet.</p>}
                  </div>
                </div>
              )}

              {tab === "blog" && editingBlog && (
                <div className="glass-card p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-foreground">{editingBlog.id ? "Edit Blog Post" : "New Blog Post"}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setEditingBlog(null)}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={editingBlog.title || ""} onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })} /></div>
                    <div><Label>Slug</Label><Input value={editingBlog.slug || ""} onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Category</Label><Input value={editingBlog.category || ""} onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })} /></div>
                    <div><Label>Author</Label><Input value={editingBlog.author || ""} onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })} /></div>
                  </div>
                  <div><Label>Excerpt</Label><Input value={editingBlog.excerpt || ""} onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} /></div>
                  <div>
                    <Label>Cover Image</Label>
                    <div className="flex gap-2 items-center">
                      <Input value={editingBlog.image_url || ""} placeholder="Image URL or upload" onChange={(e) => setEditingBlog({ ...editingBlog, image_url: e.target.value })} className="flex-1" />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleBlogImageUpload} />
                        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                          <span><Upload className="w-4 h-4 mr-1" />{uploading ? "Uploading..." : "Upload"}</span>
                        </Button>
                      </label>
                    </div>
                    {editingBlog.image_url && (
                      <img src={editingBlog.image_url} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover" />
                    )}
                  </div>
                  <div><Label>Tags (comma separated)</Label><Input value={editingBlog.tags?.join(", ") || ""} onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} /></div>
                  <div><Label>Content (Markdown)</Label><Textarea rows={12} value={editingBlog.content || ""} onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })} /></div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2"><Switch checked={editingBlog.is_published ?? false} onCheckedChange={(v) => setEditingBlog({ ...editingBlog, is_published: v })} /><Label>Published</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={editingBlog.is_featured ?? false} onCheckedChange={(v) => setEditingBlog({ ...editingBlog, is_featured: v })} /><Label>Featured</Label></div>
                  </div>
                  <Button onClick={saveBlog}><Save className="w-4 h-4 mr-1" /> Save Post</Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
