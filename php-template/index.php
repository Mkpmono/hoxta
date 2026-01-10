<?php
$pageTitle = 'Premium Game, Web, VPS & Server Hosting';
$pageDescription = 'High-performance infrastructure for gamers, developers, and businesses. Game servers, VPS, web hosting & DDoS protection with 99.9% uptime.';
require_once __DIR__.'/partials/head.php';
require_once __DIR__.'/partials/header.php';
?>

<!-- Hero Section -->
<section class="hero wave-bg">
    <div class="container">
        <div class="hero-grid">
            <div class="hero-content">
                <div class="hero-badge">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <span>Premium Infrastructure</span>
                </div>
                <h1>Premium <span class="text-gradient">Game, Web, VPS</span><br>& Server Hosting</h1>
                <p class="hero-description">High-performance infrastructure for gamers, developers, and businesses. From Minecraft & FiveM to custom VPS & enterprise servers — power your next project with us.</p>
                <div class="hero-buttons">
                    <a href="/pricing.php" class="btn-glow btn-large">Get Started <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                    <a href="/pricing.php" class="btn-outline btn-large">Compare Plans</a>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat"><div class="hero-stat-value">99.9%</div><div class="hero-stat-label">Uptime SLA</div></div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat"><div class="hero-stat-value">400+</div><div class="hero-stat-label">Gbps DDoS</div></div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat"><div class="hero-stat-value">24/7</div><div class="hero-stat-label">Support</div></div>
                </div>
            </div>
            <div class="hero-console-wrapper">
                <div class="hero-console">
                    <div class="console-header">
                        <span class="console-title">Hosting Console</span>
                        <div class="console-dots"><span class="console-dot red"></span><span class="console-dot yellow"></span><span class="console-dot green"></span></div>
                    </div>
                    <div class="console-body"></div>
                    <div class="console-footer">
                        <div class="console-progress-label"><span>Deployment Progress</span><span class="console-progress-percent">0%</span></div>
                        <div class="console-progress-bar"><div class="console-progress-fill" style="width: 0%"></div></div>
                    </div>
                </div>
                <div class="console-glow"></div>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose Section -->
<section class="why-choose">
    <div class="container">
        <div class="why-choose-header">
            <h2>Why Choose <span class="text-gradient">Hoxta</span>?</h2>
            <p>We provide enterprise-grade infrastructure with premium support at competitive prices.</p>
        </div>
        <div class="why-choose-grid" data-stagger>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                <h3>Instant Setup</h3>
                <p>Your server is deployed within seconds. No waiting, no delays — start playing immediately.</p>
            </div>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <h3>DDoS Protection</h3>
                <p>Enterprise-grade 400+ Gbps DDoS mitigation keeps your servers online during attacks.</p>
            </div>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                <h3>99.9% Uptime</h3>
                <p>Our SLA guarantees maximum availability. Your projects stay online around the clock.</p>
            </div>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div>
                <h3>24/7 Support</h3>
                <p>Our expert team is available around the clock via tickets, Discord, and live chat.</p>
            </div>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg></div>
                <h3>NVMe Storage</h3>
                <p>Ultra-fast NVMe SSDs ensure minimal load times and maximum performance.</p>
            </div>
            <div class="glass-card glass-card-hover feature-card">
                <div class="feature-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg></div>
                <h3>Global Network</h3>
                <p>Multiple datacenter locations ensure low latency for players worldwide.</p>
            </div>
        </div>
    </div>
</section>

<!-- Choose Your Game Section -->
<section class="choose-game">
    <div class="container">
        <div class="choose-game-header">
            <h2>Choose Your <span class="text-gradient">Game</span></h2>
            <div class="billing-toggle">
                <button class="active" data-period="monthly">Monthly</button>
                <button data-period="annual">Annual (Save 20%)</button>
            </div>
        </div>
        <div class="games-carousel">
            <a href="/game.php?game=minecraft" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/minecraft-cover.jpg" alt="Minecraft"><span class="game-card-badge bestseller">Bestseller</span></div>
                <div class="game-card-content"><h3 class="game-card-title">Minecraft</h3><p class="game-card-description">Java & Bedrock servers</p><div class="game-card-footer"><span class="game-card-price">$0.50/GB</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
            <a href="/game.php?game=fivem" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/fivem-cover.jpg" alt="FiveM"><span class="game-card-badge popular">Popular</span></div>
                <div class="game-card-content"><h3 class="game-card-title">FiveM</h3><p class="game-card-description">GTA V roleplay servers</p><div class="game-card-footer"><span class="game-card-price">$1.40/slot</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
            <a href="/game.php?game=cs2" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/cs2-cover.jpg" alt="Counter-Strike 2"><span class="game-card-badge hot">Hot</span></div>
                <div class="game-card-content"><h3 class="game-card-title">Counter-Strike 2</h3><p class="game-card-description">Competitive CS2 servers</p><div class="game-card-footer"><span class="game-card-price">$0.80/slot</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
            <a href="/game.php?game=rust" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/rust-cover.jpg" alt="Rust"><span class="game-card-badge popular">Popular</span></div>
                <div class="game-card-content"><h3 class="game-card-title">Rust</h3><p class="game-card-description">Survival game servers</p><div class="game-card-footer"><span class="game-card-price">$1.00/slot</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
            <a href="/game.php?game=palworld" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/palworld-cover.jpg" alt="Palworld"><span class="game-card-badge new">New</span></div>
                <div class="game-card-content"><h3 class="game-card-title">Palworld</h3><p class="game-card-description">Monster-catching survival</p><div class="game-card-footer"><span class="game-card-price">$0.75/slot</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
            <a href="/game.php?game=valheim" class="game-card glass-card glass-card-hover">
                <div class="game-card-image"><img src="/assets/img/games/valheim-cover.jpg" alt="Valheim"></div>
                <div class="game-card-content"><h3 class="game-card-title">Valheim</h3><p class="game-card-description">Viking survival servers</p><div class="game-card-footer"><span class="game-card-price">$0.60/slot</span><span class="game-card-action">View Plans →</span></div></div>
            </a>
        </div>
        <div class="carousel-nav">
            <button class="carousel-prev"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
            <button class="carousel-next"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
            <a href="/game-servers.php" class="btn-outline">View All Games →</a>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <div class="cta-bg"></div>
        <div class="cta-content">
            <div class="cta-badge"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg><span>Ready to Level Up?</span></div>
            <h2>Ready to Level Up Your <span class="text-gradient">Hosting</span>?</h2>
            <p>Join thousands of satisfied customers who trust Hoxta for their hosting needs.</p>
            <div class="cta-cards" data-stagger>
                <a href="https://api.hoxta.com/submitticket.php" class="glass-card cta-card">
                    <div class="cta-card-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></div>
                    <h3>Support</h3>
                    <p>Get help from our expert team</p>
                    <span class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem;">Open Ticket</span>
                </a>
                <a href="/knowledge-base.php" class="glass-card cta-card">
                    <div class="cta-card-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
                    <h3>Knowledge Base</h3>
                    <p>Tutorials and guides</p>
                    <span class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem;">Browse Docs</span>
                </a>
                <a href="/contact.php" class="glass-card cta-card">
                    <div class="cta-card-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                    <h3>Sales</h3>
                    <p>Custom solutions & enterprise</p>
                    <span class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem;">Contact Us</span>
                </a>
            </div>
        </div>
    </div>
</section>

<?php
require_once __DIR__.'/partials/footer.php';
require_once __DIR__.'/partials/scripts.php';
?>
