import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, LogIn, ShieldAlert, Eye, EyeOff, Star, StarOff, ArrowLeft, BookOpen, Image, Upload, Newspaper, FolderOpen
} from "lucide-react";
import { Link } from "react-router-dom";
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

type ContentType = "kb" | "blog";

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
      if (error) toast.error(error.message);
      else toast.success("Account created! Ask the site owner to grant you admin access.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
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
            <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors">
              {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function NoAccess() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
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
    if (!file.type.startsWith("image/")) { toast.error("Only image files are allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(fileName, file);
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
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
        <Input value={preview || ""} onChange={e => { setPreview(e.target.value); onUploaded(e.target.value); }} placeholder="Or paste image URL..." className="flex-1" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      {preview && (
        <div className="mt-2 relative rounded-lg overflow-hidden border border-border/30 max-w-xs">
          <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
          <button onClick={() => { setPreview(""); onUploaded(""); }} className="absolute top-1 right-1 bg-black/60 rounded p-1 hover:bg-black/80">
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

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

// Unified content editor with type selector
function UnifiedEditor({ contentType: initialType, article, blogPost, categories, onSaveArticle, onSaveBlogPost, onCancel }: {
  contentType: ContentType;
  article?: Partial<Article> | null;
  blogPost?: Partial<BlogPost> | null;
  categories: Category[];
  onSaveArticle: (data: any) => void;
  onSaveBlogPost: (data: any) => void;
  onCancel: () => void;
}) {
  const isEditing = !!(article?.id || blogPost?.id);
  const [type, setType] = useState<ContentType>(initialType);

  // Shared fields
  const [title, setTitle] = useState(article?.title || blogPost?.title || "");
  const [slug, setSlug] = useState(article?.slug || blogPost?.slug || "");
  const [content, setContent] = useState(article?.content || blogPost?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || blogPost?.excerpt || "");
  const [imageUrl, setImageUrl] = useState(article?.image_url || blogPost?.image_url || "");
  const [isPublished, setIsPublished] = useState(article?.is_published || blogPost?.is_published || false);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || blogPost?.is_featured || false);

  // KB-specific
  const [categoryId, setCategoryId] = useState(article?.category_id || "");

  // Blog-specific
  const [blogCategory, setBlogCategory] = useState(blogPost?.category || "General");
  const [author, setAuthor] = useState(blogPost?.author || "Hoxta Team");
  const [authorRole, setAuthorRole] = useState(blogPost?.author_role || "Team");
  const [tagsStr, setTagsStr] = useState((blogPost?.tags || []).join(", "));
  const [readTime, setReadTime] = useState(blogPost?.read_time || "5 min read");

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const handleTitleChange = (val: string) => { setTitle(val); if (!isEditing) setSlug(generateSlug(val)); };

  const handleSave = () => {
    if (!title || !slug || !content) { toast.error("Title, slug, and content are required"); return; }
    if (type === "kb") {
      onSaveArticle({ title, slug, content, excerpt, category_id: categoryId || null, image_url: imageUrl || null, is_published: isPublished, is_featured: isFeatured });
    } else {
      onSaveBlogPost({
        title, slug, content, excerpt,
        category: blogCategory, author, author_role: authorRole,
        image_url: imageUrl || null,
        tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean),
        read_time: readTime,
        is_published: isPublished, is_featured: isFeatured,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Type selector - only for new content */}
      {!isEditing && (
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Content Type</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "kb" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("kb")}
              className="gap-1"
            >
              <BookOpen className="w-4 h-4" /> Knowledge Base
            </Button>
            <Button
              type="button"
              variant={type === "blog" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("blog")}
              className="gap-1"
            >
              <Newspaper className="w-4 h-4" /> Blog Post
            </Button>
          </div>
        </div>
      )}

      {/* Shared fields */}
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

      {/* Type-specific fields */}
      {type === "kb" ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">KB Category</label>
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
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <Input value={blogCategory} onChange={e => setBlogCategory(e.target.value)} placeholder="Tutorials" />
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
        </>
      )}

      <ImageUploader currentUrl={imageUrl || null} onUploaded={setImageUrl} />

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
        <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-muted-foreground">Content (Markdown) *</label>
          <ContentImageInserter onInsert={md => setContent(prev => prev + md)} />
        </div>
        <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your content in Markdown..." className="min-h-[300px] font-mono text-sm" />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="btn-glow gap-1">
          <Save className="w-4 h-4" /> {isEditing ? "Update" : "Create"} {type === "kb" ? "Article" : "Blog Post"}
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

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorType, setEditorType] = useState<ContentType>("kb");
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<Partial<BlogPost> | null>(null);

  const [tab, setTab] = useState<"content" | "categories">("content");
  const [filterType, setFilterType] = useState<"all" | "kb" | "blog">("all");
  const [filterCategory, setFilterCategory] = useState("");

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

  // Open new content editor
  const openNewEditor = () => {
    setEditingArticle(null);
    setEditingBlogPost(null);
    setEditorType("kb");
    setEditorOpen(true);
  };

  // Open edit for KB article
  const editKBArticle = (article: Article) => {
    setEditingArticle(article);
    setEditingBlogPost(null);
    setEditorType("kb");
    setEditorOpen(true);
  };

  // Open edit for blog post
  const editBlogPostItem = (post: BlogPost) => {
    setEditingBlogPost(post);
    setEditingArticle(null);
    setEditorType("blog");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingArticle(null);
    setEditingBlogPost(null);
  };

  // KB Article CRUD
  const saveArticle = async (data: any) => {
    if (editingArticle?.id) {
      const { error } = await supabase.from("kb_articles").update(data).eq("id", editingArticle.id);
      if (error) { toast.error(error.message); return; }
      toast.success("KB article updated!");
    } else {
      const { error } = await supabase.from("kb_articles").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("KB article created!");
    }
    closeEditor();
    fetchData();
  };

  // Blog Post CRUD
  const saveBlogPost = async (data: any) => {
    if (editingBlogPost?.id) {
      const { error } = await supabase.from("blog_posts").update(data).eq("id", editingBlogPost.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog post updated!");
    } else {
      const { error } = await supabase.from("blog_posts").insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog post created!");
    }
    closeEditor();
    fetchData();
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("kb_articles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Article deleted"); fetchData();
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

  // Editor view
  if (editorOpen) {
    const isEditing = !!(editingArticle?.id || editingBlogPost?.id);
    return (
      <Layout>
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              {editorType === "kb" ? <BookOpen className="w-6 h-6 text-primary" /> : <Newspaper className="w-6 h-6 text-primary" />}
              <h1 className="text-2xl font-bold text-foreground">
                {isEditing
                  ? `Edit ${editorType === "kb" ? "KB Article" : "Blog Post"}`
                  : "New Content"
                }
              </h1>
            </div>
            <div className="glass-card p-6">
              <UnifiedEditor
                contentType={editorType}
                article={editorType === "kb" ? editingArticle : null}
                blogPost={editorType === "blog" ? editingBlogPost : null}
                categories={categories}
                onSaveArticle={saveArticle}
                onSaveBlogPost={saveBlogPost}
                onCancel={closeEditor}
              />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Build unified content list
  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "—";

  type ContentItem = { type: "kb"; data: Article } | { type: "blog"; data: BlogPost };
  let allContent: ContentItem[] = [];

  if (filterType === "all" || filterType === "kb") {
    let filteredArticles = articles;
    if (filterCategory) filteredArticles = filteredArticles.filter(a => a.category_id === filterCategory);
    allContent.push(...filteredArticles.map(a => ({ type: "kb" as const, data: a })));
  }
  if (filterType === "all" || filterType === "blog") {
    allContent.push(...blogPosts.map(p => ({ type: "blog" as const, data: p })));
  }

  // Sort by created_at desc
  allContent.sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());

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
              <Button size="sm" className="btn-glow gap-1" onClick={openNewEditor}>
                <Plus className="w-4 h-4" /> New Content
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={tab === "content" ? "default" : "outline"} size="sm" onClick={() => setTab("content")}>
              <BookOpen className="w-4 h-4 mr-1" /> All Content ({articles.length + blogPosts.length})
            </Button>
            <Button variant={tab === "categories" ? "default" : "outline"} size="sm" onClick={() => setTab("categories")}>
              <FolderOpen className="w-4 h-4 mr-1" /> Categories ({categories.length})
            </Button>
          </div>

          {tab === "content" && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex gap-1">
                  <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>All</Button>
                  <Button variant={filterType === "kb" ? "default" : "outline"} size="sm" onClick={() => setFilterType("kb")} className="gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> KB ({articles.length})
                  </Button>
                  <Button variant={filterType === "blog" ? "default" : "outline"} size="sm" onClick={() => setFilterType("blog")} className="gap-1">
                    <Newspaper className="w-3.5 h-3.5" /> Blog ({blogPosts.length})
                  </Button>
                </div>
                {(filterType === "all" || filterType === "kb") && (
                  <select className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="">All KB categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              {/* Content table */}
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-4 text-muted-foreground font-medium">Title</th>
                        <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell w-20">Type</th>
                        <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                        <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Status</th>
                        <th className="text-center p-4 text-muted-foreground font-medium hidden sm:table-cell">Views</th>
                        <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allContent.map(item => {
                        const isKB = item.type === "kb";
                        const d = item.data;
                        const categoryDisplay = isKB ? getCategoryName((d as Article).category_id) : (d as BlogPost).category;
                        return (
                          <tr key={`${item.type}-${d.id}`} className="border-b border-border/10 hover:bg-white/[0.02]">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {d.image_url && <img src={d.image_url} className="w-10 h-10 rounded object-cover hidden sm:block" alt="" />}
                                <div>
                                  <div className="font-medium text-foreground">{d.title}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">/{d.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden sm:table-cell text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${isKB ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                                {isKB ? <BookOpen className="w-3 h-3" /> : <Newspaper className="w-3 h-3" />}
                                {isKB ? "KB" : "Blog"}
                              </span>
                            </td>
                            <td className="p-4 hidden md:table-cell text-muted-foreground">{categoryDisplay}</td>
                            <td className="p-4 hidden sm:table-cell text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${d.is_published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                {d.is_published ? "Published" : "Draft"}
                              </span>
                              {d.is_featured && <span className="inline-flex ml-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">★</span>}
                            </td>
                            <td className="p-4 hidden sm:table-cell text-center text-muted-foreground">{d.views}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => isKB ? editKBArticle(d as Article) : editBlogPostItem(d as BlogPost)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete {isKB ? "article" : "blog post"}?</AlertDialogTitle>
                                      <AlertDialogDescription>This will permanently delete "{d.title}".</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => isKB ? deleteArticle(d.id) : deleteBlogPost(d.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {allContent.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No content yet. Click "New Content" to get started!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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
