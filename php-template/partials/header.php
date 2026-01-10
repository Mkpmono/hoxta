<?php
/**
 * Hoxta PHP Template - Header Partial
 * Complete navigation with all pages
 */

// Navigation menu data - COMPLETE with all pages
$menuItems = [
    ['label' => 'Home', 'href' => $BASE_URL . '/', 'items' => null],
    ['label' => 'Web', 'href' => null, 'items' => [
        ['title' => 'Web Hosting', 'subtitle' => 'Fast & reliable hosting for your websites', 'href' => $BASE_URL . '/web-hosting.php', 'icon' => 'globe'],
        ['title' => 'Reseller Hosting', 'subtitle' => 'Start your own hosting business', 'href' => $BASE_URL . '/reseller-hosting.php', 'icon' => 'users'],
    ]],
    ['label' => 'Game Servers', 'href' => null, 'items' => [
        ['title' => 'All Games', 'subtitle' => 'Browse all game servers', 'href' => $BASE_URL . '/game-servers.php', 'icon' => 'gamepad'],
        ['title' => 'Minecraft', 'subtitle' => 'Java & Bedrock servers', 'href' => $BASE_URL . '/game.php?game=minecraft', 'icon' => 'box'],
        ['title' => 'FiveM', 'subtitle' => 'GTA V roleplay servers', 'href' => $BASE_URL . '/game.php?game=fivem', 'icon' => 'car'],
        ['title' => 'Counter-Strike 2', 'subtitle' => 'Competitive CS2 servers', 'href' => $BASE_URL . '/game.php?game=cs2', 'icon' => 'crosshair'],
        ['title' => 'Rust', 'subtitle' => 'Survival game servers', 'href' => $BASE_URL . '/game.php?game=rust', 'icon' => 'hammer'],
        ['title' => 'Palworld', 'subtitle' => 'Monster-catching survival', 'href' => $BASE_URL . '/game.php?game=palworld', 'icon' => 'paw'],
        ['title' => 'Valheim', 'subtitle' => 'Viking survival adventure', 'href' => $BASE_URL . '/game.php?game=valheim', 'icon' => 'axe'],
    ]],
    ['label' => 'Server', 'href' => null, 'items' => [
        ['title' => 'VPS Hosting', 'subtitle' => 'Virtual private servers', 'href' => $BASE_URL . '/vps-hosting.php', 'icon' => 'cpu'],
        ['title' => 'Dedicated Servers', 'subtitle' => 'Bare metal power', 'href' => $BASE_URL . '/dedicated-servers.php', 'icon' => 'server'],
    ]],
    ['label' => 'More', 'href' => null, 'items' => [
        ['title' => 'Discord Bot Hosting', 'subtitle' => 'Host your bots 24/7', 'href' => $BASE_URL . '/more-discord-bot.php', 'icon' => 'bot'],
        ['title' => 'TeamSpeak Hosting', 'subtitle' => 'Voice servers', 'href' => $BASE_URL . '/more-teamspeak.php', 'icon' => 'headphones'],
        ['title' => 'Colocation', 'subtitle' => 'Colocate your hardware', 'href' => $BASE_URL . '/more-colocation.php', 'icon' => 'building'],
    ]],
    ['label' => 'DDoS Protection', 'href' => $BASE_URL . '/ddos.php', 'items' => null],
    ['label' => 'Help', 'href' => null, 'items' => [
        ['title' => 'Knowledge Base', 'subtitle' => 'Guides and tutorials', 'href' => $BASE_URL . '/knowledge-base.php', 'icon' => 'book'],
        ['title' => 'Pricing', 'subtitle' => 'Compare all plans', 'href' => $BASE_URL . '/pricing.php', 'icon' => 'tag'],
        ['title' => 'Status', 'subtitle' => 'Server status & uptime', 'href' => $BASE_URL . '/status.php', 'icon' => 'activity'],
        ['title' => 'Contact Us', 'subtitle' => 'Get in touch', 'href' => $BASE_URL . '/contact.php', 'icon' => 'mail'],
        ['title' => 'About Us', 'subtitle' => 'Learn about Hoxta', 'href' => $BASE_URL . '/about.php', 'icon' => 'info'],
        ['title' => 'Blog', 'subtitle' => 'News and updates', 'href' => $BASE_URL . '/blog.php', 'icon' => 'file-text'],
    ]],
];

// Get current page for active state
$currentPage = isset($currentPage) ? $currentPage : basename($_SERVER['PHP_SELF'], '.php');

// SVG Icons helper
function getIcon($name, $class = 'w-5 h-5') {
    $icons = [
        'globe' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
        'users' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
        'server' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg>',
        'cpu' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
        'gamepad' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"/></svg>',
        'box' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>',
        'car' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
        'crosshair' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',
        'hammer' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9"/><path d="M17.64 15L22 10.64a1 1 0 000-1.42l-7.22-7.22a1 1 0 00-1.42 0L9 6.36"/></svg>',
        'paw' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M11 14c-3 0-5.5 2-5.5 5s2.5 3 5.5 3 5.5 0 5.5-3-2.5-5-5.5-5z"/></svg>',
        'axe' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 12L3 21M9 3v6l-3 3"/><path d="M9 9h6l3-3"/></svg>',
        'bot' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
        'headphones' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>',
        'building' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>',
        'shield' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'book' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
        'tag' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
        'activity' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        'mail' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>',
        'info' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
        'file-text' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
        'chevron-down' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
        'menu' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
        'x' => '<svg class="'.$class.'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    ];
    return $icons[$name] ?? '';
}

// Check if current page matches
function isActivePage($href, $currentPage) {
    if (empty($href)) return false;
    $hrefPage = basename(parse_url($href, PHP_URL_PATH), '.php');
    if ($hrefPage === '' || $hrefPage === '/') $hrefPage = 'index';
    return $currentPage === $hrefPage;
}

function isActiveDropdown($items, $currentPage) {
    if (!$items) return false;
    foreach ($items as $item) {
        if (isActivePage($item['href'], $currentPage)) return true;
    }
    return false;
}
?>

<header id="header" class="header">
    <div class="container">
        <div class="header-inner">
            <!-- Logo -->
            <a href="<?php echo $BASE_URL; ?>/" class="logo">
                <span class="logo-text">Ho</span><span class="logo-accent">x</span><span class="logo-text">ta</span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="nav-desktop" id="navDesktop">
                <?php foreach ($menuItems as $item): ?>
                    <div class="nav-item">
                        <?php if ($item['items']): ?>
                            <button class="nav-link has-dropdown <?php echo isActiveDropdown($item['items'], $currentPage) ? 'active' : ''; ?>" 
                                    data-dropdown="<?php echo htmlspecialchars(strtolower(str_replace(' ', '-', $item['label']))); ?>">
                                <?php echo htmlspecialchars($item['label']); ?>
                                <?php echo getIcon('chevron-down', 'w-3.5 h-3.5 dropdown-arrow'); ?>
                            </button>
                        <?php else: ?>
                            <a href="<?php echo htmlspecialchars($item['href']); ?>" 
                               class="nav-link <?php echo isActivePage($item['href'], $currentPage) ? 'active' : ''; ?>">
                                <?php echo htmlspecialchars($item['label']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </nav>

            <!-- Control Panel Button -->
            <div class="header-actions">
                <a href="https://api.hoxta.com/clientarea.php" class="btn-glow header-cta" target="_blank" rel="noopener">
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
                <div class="mega-dropdown" id="dropdown-<?php echo htmlspecialchars(strtolower(str_replace(' ', '-', $item['label']))); ?>" 
                     data-dropdown-content="<?php echo htmlspecialchars(strtolower(str_replace(' ', '-', $item['label']))); ?>">
                    <div class="dropdown-grid <?php echo count($item['items']) <= 2 ? 'cols-2' : (count($item['items']) <= 4 ? 'cols-2' : 'cols-3'); ?>">
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
                <details class="mobile-nav-group" <?php echo isActiveDropdown($item['items'], $currentPage) ? 'open' : ''; ?>>
                    <summary class="mobile-nav-link">
                        <?php echo htmlspecialchars($item['label']); ?>
                        <?php echo getIcon('chevron-down', 'w-4 h-4'); ?>
                    </summary>
                    <div class="mobile-nav-submenu">
                        <?php foreach ($item['items'] as $subItem): ?>
                            <a href="<?php echo htmlspecialchars($subItem['href']); ?>" 
                               class="mobile-nav-sublink <?php echo isActivePage($subItem['href'], $currentPage) ? 'active' : ''; ?>">
                                <?php echo htmlspecialchars($subItem['title']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </details>
            <?php else: ?>
                <a href="<?php echo htmlspecialchars($item['href']); ?>" 
                   class="mobile-nav-link <?php echo isActivePage($item['href'], $currentPage) ? 'active' : ''; ?>">
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
