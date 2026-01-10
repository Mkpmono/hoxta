<?php
$pageTitle = 'Page Not Found';
$pageDescription = 'The page you are looking for could not be found.';
$currentPage = '404';
require_once __DIR__.'/partials/head.php';
require_once __DIR__.'/partials/header.php';
// Use BASE_URL for links
$base = isset($BASE_URL) ? $BASE_URL : '';
?>

<!-- 404 Section -->
<section class="error-section">
    <div class="error-bg">
        <div class="error-particles"></div>
    </div>
    <div class="container">
        <div class="error-content">
            <div class="error-code">
                <span class="digit">4</span>
                <span class="digit zero">0</span>
                <span class="digit">4</span>
            </div>
            <h1>Page Not Found</h1>
            <p>Oops! The page you're looking for seems to have been moved, deleted, or never existed. Let's get you back on track.</p>
            
            <div class="error-actions">
                <a href="<?php echo $base; ?>/" class="btn-glow btn-large">
                    <span>← Back to Home</span>
                </a>
                <a href="<?php echo $base; ?>/contact.php" class="btn-outline btn-large">
                    <span>Contact Support</span>
                </a>
            </div>

            <div class="error-suggestions">
                <h3>Popular Destinations</h3>
                <div class="suggestion-grid">
                    <a href="<?php echo $base; ?>/web-hosting.php" class="suggestion-card">
                        <span class="suggestion-icon">🌐</span>
                        <span>Web Hosting</span>
                    </a>
                    <a href="<?php echo $base; ?>/vps-hosting.php" class="suggestion-card">
                        <span class="suggestion-icon">🖥️</span>
                        <span>VPS Hosting</span>
                    </a>
                    <a href="<?php echo $base; ?>/dedicated-servers.php" class="suggestion-card">
                        <span class="suggestion-icon">🖧</span>
                        <span>Dedicated</span>
                    </a>
                    <a href="<?php echo $base; ?>/game-servers.php" class="suggestion-card">
                        <span class="suggestion-icon">🎮</span>
                        <span>Game Servers</span>
                    </a>
                    <a href="https://api.hoxta.com/clientarea.php" class="suggestion-card">
                        <span class="suggestion-icon">👤</span>
                        <span>Client Area</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.error-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 4rem 0;
}

.error-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
}

.error-particles {
    position: absolute;
    inset: 0;
    background-image: 
        radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 1px, transparent 1px);
    background-size: 100px 100px, 150px 150px, 200px 200px;
    animation: particleDrift 20s linear infinite;
}

@keyframes particleDrift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-50px, -50px); }
}

.error-content {
    text-align: center;
    position: relative;
    z-index: 1;
}

.error-code {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.error-code .digit {
    font-size: clamp(5rem, 15vw, 10rem);
    font-weight: 800;
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    text-shadow: 0 0 60px rgba(16, 185, 129, 0.5);
}

.error-code .zero {
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.95); }
}

.error-content h1 {
    font-size: 2rem;
    color: #fff;
    margin-bottom: 1rem;
}

.error-content > p {
    color: rgba(255, 255, 255, 0.7);
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.6;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 4rem;
}

.error-suggestions h3 {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
}

.suggestion-grid {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.suggestion-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 2rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
}

.suggestion-card:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
}

.suggestion-icon {
    font-size: 1.5rem;
}
</style>

<?php
require_once __DIR__.'/partials/footer.php';
require_once __DIR__.'/partials/scripts.php';
?>
