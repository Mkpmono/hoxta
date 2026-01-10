<?php
// Navigation menu data
$menuItems = [
    ['label' => 'Home', 'href' => '/', 'items' => null],
    ['label' => 'Web', 'href' => null, 'items' => [
        ['title' => 'Web Hosting', 'subtitle' => 'Fast & reliable hosting for your websites', 'href' => '/web-hosting.php', 'icon' => 'globe'],
        ['title' => 'Reseller Hosting', 'subtitle' => 'Start your own hosting business', 'href' => '/reseller-hosting.php', 'icon' => 'server'],
    ]],
    ['label' => 'Game Servers', 'href' => null, 'items' => [
        ['title' => 'All Games', 'subtitle' => 'Browse all game servers', 'href' => '/game-servers.php', 'icon' => 'gamepad'],
        ['title' => 'Minecraft', 'subtitle' => 'Java & Bedrock servers', 'href' => '/game.php?game=minecraft', 'icon' => 'gamepad'],
        ['title' => 'FiveM', 'subtitle' => 'GTA V roleplay servers', 'href' => '/game.php?game=fivem', 'icon' => 'gamepad'],
        ['title' => 'Counter-Strike 2', 'subtitle' => 'Competitive CS2 servers', 'href' => '/game.php?game=cs2', 'icon' => 'gamepad'],
        ['title' => 'Rust', 'subtitle' => 'Survival game servers', 'href' => '/game.php?game=rust', 'icon' => 'gamepad'],
        ['title' => 'Palworld', 'subtitle' => 'Monster-catching survival', 'href' => '/game.php?game=palworld', 'icon' => 'gamepad'],
    ]],
    ['label' => 'Server', 'href' => null, 'items' => [
        ['title' => 'VPS Hosting', 'subtitle' => 'Virtual private servers', 'href' => '/vps-hosting.php', 'icon' => 'harddrive'],
        ['title' => 'Dedicated Server', 'subtitle' => 'Bare metal servers', 'href' => '/dedicated-servers.php', 'icon' => 'server'],
    ]],
    ['label' => 'More Hosting', 'href' => null, 'items' => [
        ['title' => 'Discord Bot', 'subtitle' => 'Host your bots 24/7', 'href' => '/more-discord-bot.php', 'icon' => 'server'],
        ['title' => 'TeamSpeak', 'subtitle' => 'Voice servers', 'href' => '/more-teamspeak.php', 'icon' => 'server'],
        ['title' => 'Colocation', 'subtitle' => 'Colocate your hardware', 'href' => '/more-colocation.php', 'icon' => 'harddrive'],
    ]],
    ['label' => 'Help & Info', 'href' => null, 'items' => [
        ['title' => 'About Us', 'subtitle' => 'Learn about Hoxta', 'href' => '/about.php', 'icon' => 'info'],
        ['title' => 'Contact Us', 'subtitle' => 'Get in touch', 'href' => '/contact.php', 'icon' => 'mail'],
        ['title' => 'Blog', 'subtitle' => 'News and updates', 'href' => '/blog.php', 'icon' => 'file'],
        ['title' => 'Terms of Service', 'subtitle' => 'Our terms', 'href' => '/terms.php', 'icon' => 'file'],
        ['title' => 'Privacy Policy', 'subtitle' => 'Data protection', 'href' => '/privacy.php', 'icon' => 'shield'],
    ]],
];

// Get current page for active state
$currentPage = basename($_SERVER['PHP_SELF']);

// SVG Icons
function getIcon($name, $class = 'w-5 h-5') {
    $icons = [
        'globe' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
        'server' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></svg>',
        'gamepad' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"/></svg>',
        'harddrive' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 12H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11zM6 16h.01M10 16h.01"/></svg>',
        'info' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
        'mail' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>',
        'file' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
        'shield' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'chevron-down' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
        'menu' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
        'x' => '<svg class="'.$class.'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    ];
    return $icons[$name] ?? '';
}
?>

<header id="header" class="header">
    <div class="container">
        <div class="header-inner">
            <!-- Logo -->
            <a href="/" class="logo">
                <span class="logo-text">Ho</span><span class="logo-accent">x</span><span class="logo-text">ta</span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="nav-desktop" id="navDesktop">
                <?php foreach ($menuItems as $item): ?>
                    <div class="nav-item">
                        <?php if ($item['items']): ?>
                            <button class="nav-link has-dropdown" data-dropdown="<?php echo htmlspecialchars($item['label']); ?>">
                                <?php echo htmlspecialchars($item['label']); ?>
                                <?php echo getIcon('chevron-down', 'w-3.5 h-3.5 dropdown-arrow'); ?>
                            </button>
                        <?php else: ?>
                            <a href="<?php echo htmlspecialchars($item['href']); ?>" 
                               class="nav-link <?php echo ($item['href'] === '/' && $currentPage === 'index.php') ? 'active' : ''; ?>">
                                <?php echo htmlspecialchars($item['label']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </nav>

            <!-- Control Panel Button -->
            <div class="header-actions">
                <a href="https://api.hoxta.com/clientarea.php" class="btn-glow" target="_blank" rel="noopener">
                    Control Panel
                </a>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
                    <?php echo getIcon('menu', 'w-6 h-6'); ?>
                </button>
            </div>
        </div>
    </div>

    <!-- Mega Dropdown Container -->
    <div class="dropdown-container" id="dropdownContainer">
        <?php foreach ($menuItems as $item): ?>
            <?php if ($item['items']): ?>
                <div class="mega-dropdown" id="dropdown-<?php echo htmlspecialchars(strtolower(str_replace(' ', '-', $item['label']))); ?>" data-dropdown-content="<?php echo htmlspecialchars($item['label']); ?>">
                    <div class="dropdown-grid cols-<?php echo count($item['items']) <= 2 ? '2' : '3'; ?>">
                        <?php foreach ($item['items'] as $subItem): ?>
                            <a href="<?php echo htmlspecialchars($subItem['href']); ?>" class="dropdown-item">
                                <div class="dropdown-icon">
                                    <?php echo getIcon($subItem['icon']); ?>
                                </div>
                                <div class="dropdown-content">
                                    <span class="dropdown-title"><?php echo htmlspecialchars($subItem['title']); ?></span>
                                    <span class="dropdown-subtitle"><?php echo htmlspecialchars($subItem['subtitle']); ?></span>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-content">
        <?php foreach ($menuItems as $item): ?>
            <?php if ($item['items']): ?>
                <details class="mobile-nav-group">
                    <summary class="mobile-nav-link">
                        <?php echo htmlspecialchars($item['label']); ?>
                        <?php echo getIcon('chevron-down', 'w-4 h-4'); ?>
                    </summary>
                    <div class="mobile-nav-submenu">
                        <?php foreach ($item['items'] as $subItem): ?>
                            <a href="<?php echo htmlspecialchars($subItem['href']); ?>" class="mobile-nav-sublink">
                                <?php echo htmlspecialchars($subItem['title']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </details>
            <?php else: ?>
                <a href="<?php echo htmlspecialchars($item['href']); ?>" class="mobile-nav-link">
                    <?php echo htmlspecialchars($item['label']); ?>
                </a>
            <?php endif; ?>
        <?php endforeach; ?>
        <a href="https://api.hoxta.com/clientarea.php" class="btn-glow mobile-cta" target="_blank" rel="noopener">
            Control Panel
        </a>
    </div>
</div>

<main class="main-content">
