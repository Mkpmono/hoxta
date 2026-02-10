import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, LogIn, ShieldAlert, Eye, EyeOff, Star, StarOff, ArrowLeft, BookOpen, Image, Upload, Newspaper
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
  image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
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
  is_published: boolean;
  is_featured: boolean;
  views: number;
  read_time: string | null;
  created_at: string;
  updated_at: string;
}

// Login form
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Ask the site owner to grant you admin access.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
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
              <h1 className="text-2xl font-bold text-foreground">{isSignUp ? "Create Admin Account" : "Admin Login"}</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full btn-glow" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
              </Button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
            >
              {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
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
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

// Image upload component
function ImageUploader({ currentUrl, onUploaded }: { currentUrl?: string | null; onUploaded: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabase.storage.from("article-images").upload(fileName, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(fileName);
    setPreview(publicUrl);
    onUploaded(publicUrl);
    toast.success("Image uploaded!");
    setUploading(false);
  };

  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">Cover Image</label>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-1">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
        <Input
          value={preview || ""}
          onChange={e => { setPreview(e.target.value); onUploaded(e.target.value); }}
          placeholder="Or paste image URL..."
          className="flex-1"
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      {preview && (
        <div className="mt-2 relative rounded-lg overflow-hidden border border-border/30 max-w-xs">
          <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
          <button
            onClick={() => { setPreview(""); onUploaded(""); }}
            className="absolute top-1 right-1 bg-black/60 rounded p-1 hover:bg-black/80"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

// Inline image inserter for content
function ContentImageInserter({ onInsert }: { onInsert: (markdown: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only images"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(fileName, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(fileName);
    onInsert(`\n![${file.name}](${publicUrl})\n`);
    toast.success("Image inserted!");
    setUploading(false);
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-1">
        <Image className="w-4 h-4" />
        {uploading ? "Uploading..." : "Insert Image"}
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </>
  );
}

// KB Article editor
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
  const [imageUrl, setImageUrl] = useState(article?.image_url || "");
  const [isPublished, setIsPublished] = useState(article?.is_published || false);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const handleTitleChange = (val: string) => { setTitle(val); if (!article?.id) setSlug(generateSlug(val)); };

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
          <select className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">No category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <Button type="button" variant={isPublished ? "default" : "outline"} size="sm" onClick={() => setIsPublished(!isPublished)} className="gap-1">
            {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isPublished ? "Published" : "Draft"}
          </Button>
          <Button type="button" variant={isFeatured ? "default" : "outline"} size="sm" onClick={() => setIsFeatured(!isFeatured)} className="gap-1">
            {isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
            Featured
          </Button>
        </div>
      </div>
      <ImageUploader currentUrl={article?.image_url} onUploaded={setImageUrl} />
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
        <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-muted-foreground">Content (Markdown) *</label>
          <ContentImageInserter onInsert={md => setContent(prev => prev + md)} />
        </div>
        <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your article in Markdown..." className="min-h-[300px] font-mono text-sm" />
      </div>
      <div className="flex gap-3">
        <Button onClick={() => onSave({ title, slug, content, excerpt, category_id: categoryId || null, image_url: imageUrl || null, is_published: isPublished, is_featured: isFeatured })} className="btn-glow gap-1">
          <Save className="w-4 h-4" /> Save Article
        </Button>
        <Button variant="outline" onClick={onCancel} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
      </div>
    </div>
  );
}

// Blog post editor
function BlogEditor({ post, onSave, onCancel }: {
  post: Partial<BlogPost> | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "General");
  const [author, setAuthor] = useState(post?.author || "Hoxta Team");
  const [authorRole, setAuthorRole] = useState(post?.author_role || "Team");
  const [imageUrl, setImageUrl] = useState(post?.image_url || "");
  const [tagsStr, setTagsStr] = useState((post?.tags || []).join(", "));
  const [readTime, setReadTime] = useState(post?.read_time || "5 min read");
  const [isPublished, setIsPublished] = useState(post?.is_published || false);
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const handleTitleChange = (val: string) => { setTitle(val); if (!post?.id) setSlug(generateSlug(val)); };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Title *</label>
          <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Blog post title" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Slug *</label>
          <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="blog-post-slug" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Category</label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Tutorials" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Author</label>
          <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Author Role</label>
          <Input value={authorRole} onChange={e => setAuthorRole(e.target.value)} placeholder="Team role" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Tags (comma separated)</label>
          <Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Minecraft, Tutorial, Performance" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Read Time</label>
          <Input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="5 min read" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button type="button" variant={isPublished ? "default" : "outline"} size="sm" onClick={() => setIsPublished(!isPublished)} className="gap-1">
          {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {isPublished ? "Published" : "Draft"}
        </Button>
        <Button type="button" variant={isFeatured ? "default" : "outline"} size="sm" onClick={() => setIsFeatured(!isFeatured)} className="gap-1">
          {isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
          Featured
        </Button>
      </div>
      <ImageUploader currentUrl={post?.image_url} onUploaded={setImageUrl} />
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
        <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-muted-foreground">Content (Markdown) *</label>
          <ContentImageInserter onInsert={md => setContent(prev => prev + md)} />
        </div>
        <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your blog post in Markdown..." className="min-h-[300px] font-mono text-sm" />
      </div>
      <div className="flex gap-3">
        <Button onClick={() => onSave({
          title, slug, content, excerpt,
          category, author, author_role: authorRole,
          image_url: imageUrl || null,
          tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean),
          read_time: readTime,
          is_published: isPublished, is_featured: isFeatured
        })} className="btn-glow gap-1">
          <Save className="w-4 h-4" /> Save Post
        </Button>
        <Button variant="outline" onClick={onCancel} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
      </div>
    </div>
  );
}

// Main admin panel
export default function KBAdmin() {
  const { isAdmin, loading: authLoading, user } = useKBAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<Partial<BlogPost> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [tab, setTab] = useState<"articles" | "blog" | "categories">("articles");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  // Category editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Zap");

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    const [catRes, artRes, blogRes] = await Promise.all([
      supabase.from("kb_categories").select("*").order("sort_order"),
      supabase.from("kb_articles").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);
    if (catRes.data) setCategories(catRes.data as Category[]);
    if (artRes.data) setArticles(artRes.data as Article[]);
    if (blogRes.data) setBlogPosts(blogRes.data as BlogPost[]);
  };

  // KB Article CRUD
  const saveArticle = async (data: any) => {
    if (!data.title || !data.slug || !data.content) { toast.error("Title, slug, and content are required"); return; }
    if (editingArticle?.id) {
      const { error } = await supabase.from("kb_articles").update(data).eq("id", editingArticle.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Article updated!");
    } else {
      const { error } = await supabase.from("kb_articles").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Article created!");
    }
    setEditingArticle(null); setIsCreating(false); fetchData();
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("kb_articles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Article deleted"); fetchData();
  };

  // Blog Post CRUD
  const saveBlogPost = async (data: any) => {
    if (!data.title || !data.slug || !data.content) { toast.error("Title, slug, and content are required"); return; }
    if (editingBlogPost?.id) {
      const { error } = await supabase.from("blog_posts").update(data).eq("id", editingBlogPost.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog post updated!");
    } else {
      const { error } = await supabase.from("blog_posts").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog post created!");
    }
    setEditingBlogPost(null); setIsCreatingBlog(false); fetchData();
  };

  const deleteBlogPost = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Blog post deleted"); fetchData();
  };

  // Category CRUD
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
    resetCategoryForm(); fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("kb_categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Category deleted"); fetchData();
  };

  const resetCategoryForm = () => { setEditingCategory(null); setNewCatName(""); setNewCatSlug(""); setNewCatDesc(""); setNewCatIcon("Zap"); };
  const startEditCategory = (cat: Category) => { setEditingCategory(cat); setNewCatName(cat.name); setNewCatSlug(cat.slug); setNewCatDesc(cat.description || ""); setNewCatIcon(cat.icon || "Zap"); };

  if (authLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20"><div className="container mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div></section>
      </Layout>
    );
  }

  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NoAccess />;

  // Editor views
  if (isCreating || editingArticle) {
    return (
      <Layout>
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{editingArticle?.id ? "Edit KB Article" : "New KB Article"}</h1>
            </div>
            <div className="glass-card p-6">
              <ArticleEditor article={editingArticle} categories={categories} onSave={saveArticle} onCancel={() => { setEditingArticle(null); setIsCreating(false); }} />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isCreatingBlog || editingBlogPost) {
    return (
      <Layout>
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{editingBlogPost?.id ? "Edit Blog Post" : "New Blog Post"}</h1>
            </div>
            <div className="glass-card p-6">
              <BlogEditor post={editingBlogPost} onSave={saveBlogPost} onCancel={() => { setEditingBlogPost(null); setIsCreatingBlog(false); }} />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const filteredArticles = filterCategory ? articles.filter(a => a.category_id === filterCategory) : articles;
  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "—";

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Content Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/knowledge-base"><Button variant="outline" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> View KB</Button></Link>
              <Link to="/blog"><Button variant="outline" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> View Blog</Button></Link>
              {tab === "articles" && (
                <Button size="sm" className="btn-glow gap-1" onClick={() => { setIsCreating(true); setEditingArticle({}); }}>
                  <Plus className="w-4 h-4" /> New Article
                </Button>
              )}
              {tab === "blog" && (
                <Button size="sm" className="btn-glow gap-1" onClick={() => { setIsCreatingBlog(true); setEditingBlogPost({}); }}>
                  <Plus className="w-4 h-4" /> New Blog Post
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={tab === "articles" ? "default" : "outline"} size="sm" onClick={() => setTab("articles")}>
              <BookOpen className="w-4 h-4 mr-1" /> KB Articles ({articles.length})
            </Button>
            <Button variant={tab === "blog" ? "default" : "outline"} size="sm" onClick={() => setTab("blog")}>
              <Newspaper className="w-4 h-4 mr-1" /> Blog Posts ({blogPosts.length})
            </Button>
            <Button variant={tab === "categories" ? "default" : "outline"} size="sm" onClick={() => setTab("categories")}>
              Categories ({categories.length})
            </Button>
          </div>

          {/* KB Articles Tab */}
          {tab === "articles" && (
            <>
              <div className="mb-4">
                <select className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">All categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
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
                            <div className="flex items-center gap-3">
                              {article.image_url && <img src={article.image_url} className="w-10 h-10 rounded object-cover hidden sm:block" alt="" />}
                              <div>
                                <div className="font-medium text-foreground">{article.title}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">/{article.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">{getCategoryName(article.category_id)}</td>
                          <td className="p-4 hidden sm:table-cell text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${article.is_published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                              {article.is_published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-4 hidden sm:table-cell text-center text-muted-foreground">{article.views}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setEditingArticle(article)}><Pencil className="w-4 h-4" /></Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Delete article?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete "{article.title}".</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteArticle(article.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredArticles.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No articles found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Blog Posts Tab */}
          {tab === "blog" && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-4 text-muted-foreground font-medium">Title</th>
                      <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                      <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Author</th>
                      <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Status</th>
                      <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Views</th>
                      <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map(post => (
                      <tr key={post.id} className="border-b border-border/10 hover:bg-white/[0.02]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {post.image_url && <img src={post.image_url} className="w-10 h-10 rounded object-cover hidden sm:block" alt="" />}
                            <div>
                              <div className="font-medium text-foreground">{post.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">/{post.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{post.category}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{post.author}</td>
                        <td className="p-4 hidden sm:table-cell text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${post.is_published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                          {post.is_featured && <span className="inline-flex ml-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">Featured</span>}
                        </td>
                        <td className="p-4 hidden sm:table-cell text-center text-muted-foreground">{post.views}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingBlogPost(post)}><Pencil className="w-4 h-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Delete blog post?</AlertDialogTitle>
                                  <AlertDialogDescription>This will permanently delete "{post.title}".</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteBlogPost(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blogPosts.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No blog posts yet. Create your first one!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {tab === "categories" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{editingCategory ? "Edit Category" : "New Category"}</h3>
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
                    <Button onClick={saveCategory} className="btn-glow gap-1"><Save className="w-4 h-4" /> {editingCategory ? "Update" : "Create"}</Button>
                    {editingCategory && <Button variant="outline" onClick={resetCategoryForm}>Cancel</Button>}
                  </div>
                </div>
              </div>
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
                        <Button variant="ghost" size="sm" onClick={() => startEditCategory(cat)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete category?</AlertDialogTitle>
                              <AlertDialogDescription>This will delete "{cat.name}".</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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
