import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "optimize-minecraft-server",
    title: "How to Optimize Your Minecraft Server for Maximum Performance",
    excerpt: "Learn the best practices for configuring your Minecraft server to handle more players with less lag.",
    content: `
## Introduction

Running a successful Minecraft server requires more than just setting it up and hoping for the best. Whether you're hosting a small server for friends or managing a large community, optimization is key to providing a smooth gaming experience.

## 1. Allocate the Right Amount of RAM

One of the most common mistakes server owners make is allocating too much or too little RAM. Here's a general guideline:

- **Small servers (1-10 players):** 2-4 GB
- **Medium servers (10-50 players):** 4-8 GB
- **Large servers (50+ players):** 8-16 GB

Remember: More RAM isn't always better. Allocating excessive RAM can actually hurt performance due to garbage collection overhead.

## 2. Optimize JVM Flags

Using the right Java arguments can significantly improve performance. We recommend Aikar's flags for most servers:

\`\`\`bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -jar server.jar
\`\`\`

## 3. Optimize Server Configuration

### server.properties
- Set \`view-distance\` to 8-10 (lower for larger servers)
- Enable \`use-native-transport\` for Linux servers
- Adjust \`network-compression-threshold\` to 256

### spigot.yml / paper.yml
- Reduce \`mob-spawn-range\` to 6
- Set \`entity-activation-range\` appropriately
- Enable \`per-player-mob-spawns\`

## 4. Use Performance Plugins

Consider installing plugins like:
- **Spark** - For performance profiling
- **ClearLagg** - To remove unnecessary entities
- **VillagerOptimiser** - Reduces villager lag

## 5. Regular Maintenance

- **Prune unused chunks** regularly
- **Update plugins** to their latest versions
- **Monitor performance** with tools like Spark or Timings

## Conclusion

Optimizing your Minecraft server is an ongoing process. Start with these basics and continuously monitor your server's performance to identify and address bottlenecks.

Need help optimizing your server? Our support team is available 24/7 to assist you with any configuration questions.
    `,
    category: "Tutorials",
    author: "Alex Hosting",
    authorRole: "Senior Systems Engineer",
    date: "2026-01-08",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1587573088697-b4fa24c18962?w=1200&h=600&fit=crop",
    tags: ["Minecraft", "Performance", "Tutorial", "Optimization"],
  },
  {
    id: "ddos-protection-guide",
    title: "Understanding DDoS Attacks and How We Protect Your Server",
    excerpt: "A comprehensive guide to DDoS attacks, their types, and how Hoxta's multi-layer protection keeps your services online.",
    content: `
## What is a DDoS Attack?

A Distributed Denial of Service (DDoS) attack is a malicious attempt to disrupt normal traffic to your server by overwhelming it with a flood of internet traffic from multiple sources.

## Types of DDoS Attacks

### 1. Volumetric Attacks
These attacks aim to consume all available bandwidth between your server and the internet. Common examples include:
- UDP floods
- ICMP floods
- DNS amplification

### 2. Protocol Attacks
These exploit weaknesses in layer 3 and layer 4 of the protocol stack:
- SYN floods
- Ping of Death
- Smurf attacks

### 3. Application Layer Attacks
These target specific applications or services:
- HTTP floods
- Slowloris
- DNS query floods

## How Hoxta Protects Your Server

### Multi-Layer Defense System

**Layer 1: Network Edge Protection**
Our global network of scrubbing centers can absorb attacks up to 3.5 Tbps, filtering malicious traffic before it reaches your server.

**Layer 2: Intelligent Traffic Analysis**
Machine learning algorithms analyze traffic patterns in real-time, identifying and blocking suspicious activity within milliseconds.

**Layer 3: Application-Aware Filtering**
Game-specific filters understand legitimate game traffic patterns, allowing real players through while blocking attacks.

### Always-On Protection
Unlike some providers, our DDoS protection is always active. There's no need to wait for an attack to be detected before protection kicks in.

### Zero Impact Mitigation
Our infrastructure is designed to handle mitigation without affecting legitimate traffic. Your players won't notice a thing.

## Best Practices for Server Owners

1. **Keep your server software updated** - Patches often fix security vulnerabilities
2. **Use strong authentication** - Prevent unauthorized access to your server
3. **Monitor your traffic** - Know what's normal so you can spot anomalies
4. **Have a response plan** - Know who to contact and what to do during an attack

## Conclusion

DDoS attacks are a serious threat, but with the right protection, your server can stay online even during the most aggressive attacks. At Hoxta, we're committed to keeping your services running smoothly, 24/7.
    `,
    category: "Security",
    author: "Security Team",
    authorRole: "Infrastructure Security",
    date: "2026-01-05",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop",
    tags: ["DDoS", "Security", "Infrastructure", "Protection"],
  },
  {
    id: "fivem-server-setup",
    title: "Complete FiveM Server Setup Guide for Beginners",
    excerpt: "Step-by-step instructions to get your FiveM roleplay server up and running.",
    content: `
## Getting Started with FiveM

FiveM is a popular modification framework for GTA V that allows you to create custom multiplayer servers. This guide will walk you through everything you need to know to set up your first server.

## Prerequisites

Before starting, make sure you have:
- A Hoxta game server with FiveM support
- A Cfx.re account (free to create)
- Basic knowledge of file management

## Step 1: Generate Your Server License

1. Go to https://keymaster.fivem.net/
2. Log in with your Cfx.re account
3. Click "Register a new server"
4. Fill in your server details
5. Copy your license key

## Step 2: Configure Your Server

### server.cfg
Create or edit your server.cfg file with the following essential settings:

\`\`\`
# Server name and info
sv_hostname "Your Server Name"
sv_projectDesc "Your server description"
sv_maxclients 32

# License key (from Cfx.re)
sv_licenseKey "your_license_key_here"

# Game settings
gametype "roleplay"
locale "en-US"

# Resources
ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure basic-gamemode
\`\`\`

## Step 3: Install Essential Resources

Download and install these recommended resources:
- **vMenu** - Server-side trainer and admin menu
- **EssentialMode** - Framework for economy and player data
- **MySQL-Async** - Database connectivity

## Step 4: Database Setup

For persistent data, set up a MySQL database:

1. Access your database through your Hoxta panel
2. Create a new database for FiveM
3. Configure your database connection in your resources

## Step 5: Testing Your Server

1. Start your server through the control panel
2. Open FiveM on your gaming PC
3. Press F8 and type: \`connect your.server.ip\`
4. Test all basic functionality

## Recommended Next Steps

- Set up an admin team with proper permissions
- Install additional roleplay resources
- Create custom rules and guidelines
- Join FiveM community forums for support

## Troubleshooting Common Issues

**Server not showing in list?**
- Check your sv_master1 setting
- Ensure ports are properly forwarded

**Resources not loading?**
- Verify resource names match folder names exactly
- Check for missing dependencies

## Conclusion

Setting up a FiveM server is just the beginning. With Hoxta's optimized hosting and 24/7 support, you can focus on building your community while we handle the technical infrastructure.
    `,
    category: "Tutorials",
    author: "Game Team",
    authorRole: "Game Server Specialist",
    date: "2026-01-03",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f55a4?w=1200&h=600&fit=crop",
    tags: ["FiveM", "GTA V", "Setup Guide", "Roleplay"],
  },
  {
    id: "new-frankfurt-datacenter",
    title: "Announcing Our New Frankfurt Data Center",
    excerpt: "We're excited to announce the opening of our new Frankfurt data center.",
    content: `
## Expanding Our European Infrastructure

We're thrilled to announce the opening of our new state-of-the-art data center in Frankfurt, Germany. This expansion represents a significant milestone in our mission to provide the best possible gaming experience for our European customers.

## Why Frankfurt?

Frankfurt is one of the most connected cities in the world, home to DE-CIX, the world's largest internet exchange point. This strategic location offers:

- **Ultra-low latency** to Central Europe
- **Excellent connectivity** to Eastern and Western Europe
- **Direct peering** with major gaming networks
- **Redundant power** and cooling systems

## What This Means for You

### Improved Latency
Players in Germany, Austria, Switzerland, Poland, and surrounding countries will see ping reductions of 30-50% compared to our other European locations.

### More Capacity
The new facility adds over 2,000 server capacity, ensuring we can meet growing demand without compromising on quality.

### Enhanced Reliability
Enterprise-grade infrastructure with:
- N+1 redundancy on all critical systems
- Multiple Tier 1 network providers
- 24/7 on-site technical support

## Migration Options

If you're currently hosted in another location and want to take advantage of the Frankfurt data center:

1. **New customers**: Select "Frankfurt, DE" during checkout
2. **Existing customers**: Contact support for a free migration

## Technical Specifications

- **Power**: 100% renewable energy
- **Cooling**: Advanced liquid cooling systems
- **Network**: 400 Gbps total capacity
- **Security**: 24/7 physical security, biometric access

## Looking Ahead

This is just the beginning. We have plans to expand further in 2026, with new locations in Asia and North America on the roadmap.

Thank you for being part of our community. We're committed to continuously improving our infrastructure to serve you better.
    `,
    category: "Company News",
    author: "Hoxta Team",
    authorRole: "Infrastructure Team",
    date: "2025-12-28",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop",
    tags: ["News", "Infrastructure", "Expansion", "Frankfurt"],
  },
  {
    id: "vps-vs-dedicated",
    title: "VPS vs Dedicated Server: Which One Do You Need?",
    excerpt: "Compare VPS and dedicated servers to understand which hosting solution best fits your needs.",
    content: `
## Understanding Your Hosting Options

Choosing between a VPS (Virtual Private Server) and a Dedicated Server is one of the most important decisions you'll make for your project. Let's break down the differences to help you make an informed choice.

## What is a VPS?

A VPS is a virtualized server that shares physical hardware with other VPS instances, but operates as an independent server with dedicated resources.

### VPS Advantages
- **Cost-effective** - Lower monthly costs
- **Scalable** - Easy to upgrade resources
- **Quick deployment** - Usually ready in minutes
- **Managed options** - Less technical knowledge required

### VPS Best For
- Small to medium websites
- Development environments
- Game servers with moderate player counts
- Startups and growing businesses

## What is a Dedicated Server?

A dedicated server gives you exclusive use of an entire physical machine. No sharing, no virtualization overhead.

### Dedicated Advantages
- **Maximum performance** - Full hardware access
- **Complete control** - Customize everything
- **Consistent performance** - No "noisy neighbor" issues
- **Better for compliance** - Easier to meet security requirements

### Dedicated Best For
- High-traffic websites
- Large game servers (100+ players)
- Database-heavy applications
- Enterprise applications

## Side-by-Side Comparison

| Feature | VPS | Dedicated |
|---------|-----|-----------|
| Cost | €5-100/month | €80-500/month |
| Performance | Good | Excellent |
| Scalability | Excellent | Limited |
| Setup Time | Minutes | Hours to Days |
| Root Access | Yes | Yes |
| Hardware Control | Limited | Full |

## Making Your Decision

### Choose VPS If:
- You're just starting out
- Your budget is limited
- You need flexibility to scale
- Your application isn't resource-intensive

### Choose Dedicated If:
- Performance is critical
- You have specific hardware requirements
- You need guaranteed resources
- Security compliance is a priority

## Our Recommendation

For most users, we recommend **starting with a VPS** and upgrading to dedicated when needed. Our VPS plans offer excellent performance at a fraction of the cost, and our migration service makes upgrading seamless.

Need help deciding? Contact our team for a personalized recommendation based on your specific needs.
    `,
    category: "Guides",
    author: "Tech Team",
    authorRole: "Solutions Architect",
    date: "2025-12-20",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=1200&h=600&fit=crop",
    tags: ["VPS", "Dedicated", "Comparison", "Hosting"],
  },
  {
    id: "rust-server-wipes",
    title: "Managing Rust Server Wipes: Best Practices",
    excerpt: "Everything you need to know about Rust server wipes and keeping your community engaged.",
    content: `
## Understanding Rust Wipes

Server wipes are an essential part of the Rust experience. They reset the game world, giving everyone a fresh start. But managing wipes effectively requires planning and communication.

## Types of Wipes

### Map Wipes
- Resets the game world and player-built structures
- Usually happens monthly (forced by Facepunch)
- Can be done more frequently on community servers

### Blueprint Wipes
- Resets all learned blueprints
- Usually done less frequently
- Major impact on player progression

### Full Wipes
- Combines map and blueprint wipes
- Complete fresh start for everyone
- Typically done on forced wipe days

## Wipe Schedule Best Practices

### Forced Wipes
Facepunch forces map wipes on the first Thursday of every month. Plan your schedule around this:

- **Weekly servers**: Wipe every Thursday
- **Bi-weekly servers**: Wipe on forced wipe + 2 weeks later
- **Monthly servers**: Wipe only on forced wipe days

### Communicate Clearly
- Post your wipe schedule in your Discord
- Update server name with next wipe date
- Send reminders 24-48 hours before wipe

## Pre-Wipe Checklist

1. **Backup your data** - Save player statistics and admin configurations
2. **Update Rust** - Apply any pending game updates
3. **Update plugins** - Ensure compatibility with new version
4. **Generate new map** - Create or select your new map seed
5. **Test locally** - Verify everything works before going live

## Keeping Players Engaged

### End of Wipe Events
- Host PvP events with special loot
- Run building competitions
- Offer exclusive skins or VIP status for winners

### Wipe Day Hype
- Create countdown timers in Discord
- Share sneak peeks of new features
- Announce any new plugins or rules

## Common Wipe Day Issues

**Players can't connect after wipe?**
- Ensure server is fully restarted
- Check for plugin errors in console
- Verify Rust client is updated

**Map not loading correctly?**
- Regenerate map with a different seed
- Check server has enough RAM
- Look for corrupted map files

## Conclusion

A well-managed wipe schedule keeps your community excited and engaged. Consistency and communication are key to building a loyal player base.

Need help with your Rust server? Our game specialists are here to help 24/7.
    `,
    category: "Tutorials",
    author: "Game Team",
    authorRole: "Rust Server Specialist",
    date: "2025-12-15",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
    tags: ["Rust", "Server Management", "Community", "Wipes"],
  },
];

function ShareButton({ icon: Icon, label, onClick, className = "" }: { icon: any; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 ${className}`}
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function BlogPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const post = blogPosts.find((p) => p.id === postId);
  const relatedPosts = blogPosts
    .filter((p) => p.id !== postId && p.tags.some((tag) => post?.tags.includes(tag)))
    .slice(0, 3);

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

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank");
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-0">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs">{post.authorRole}</p>
                </div>
              </div>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            {/* Featured Image */}
            <div className="relative rounded-2xl overflow-hidden mb-10">
              <img
                src={post.image}
                alt={post.title}
                className="w-full aspect-[2/1] object-cover"
              />
            </div>

            {/* Share Bar */}
            <div className="flex items-center justify-between py-4 border-y border-border/50 mb-10">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton icon={Twitter} label="Share on Twitter" onClick={shareToTwitter} />
                <ShareButton icon={Facebook} label="Share on Facebook" onClick={shareToFacebook} />
                <ShareButton icon={Linkedin} label="Share on LinkedIn" onClick={shareToLinkedIn} />
                <ShareButton
                  icon={copied ? Check : Copy}
                  label="Copy link"
                  onClick={copyLink}
                  className={copied ? "border-green-500 text-green-500" : ""}
                />
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div
                className="text-muted-foreground leading-relaxed
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-10 [&>h2]:mb-4
                  [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:mt-8 [&>h3]:mb-3
                  [&>p]:mb-4
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
                  [&>li]:mb-2
                  [&>pre]:bg-card [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4
                  [&>code]:bg-card [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic
                  [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4
                  [&_th]:border [&_th]:border-border/50 [&_th]:p-2 [&_th]:bg-card [&_th]:text-left
                  [&_td]:border [&_td]:border-border/50 [&_td]:p-2
                  [&>strong]:text-foreground [&>strong]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n- (.+)/g, "\n<li>$1</li>")
                    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
                    .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
                    .replace(/`([^`]+)`/g, "<code>$1</code>")
                    .replace(/\n\n/g, "</p><p>")
                    .replace(/^\s*/, "<p>")
                    .replace(/\s*$/, "</p>")
                }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-12">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-border/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto mt-16 pt-16 border-t border-border/50"
            >
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group block bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="text-xs border-border/50 mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {relatedPost.readTime}
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
