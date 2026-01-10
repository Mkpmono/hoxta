# Hoxta Hosting - PHP Template

A complete, production-ready PHP website for game and web hosting services. This template is designed for direct upload to cPanel without any build steps.

## 📁 Directory Structure

```
php-template/
├── assets/
│   ├── css/
│   │   ├── styles.css      # Main site styles
│   │   └── panel.css       # Client panel styles
│   ├── js/
│   │   ├── main.js         # Main site JavaScript
│   │   ├── animations.js   # Animation effects
│   │   ├── panel.js        # Panel functionality
│   │   ├── panel-api.js    # Mock/WHMCS API layer
│   │   └── games-data.js   # Game server catalog data
│   ├── img/
│   │   ├── games/          # Game cover images
│   │   └── ...             # Other images
│   └── fonts/              # Local fonts (optional)
├── partials/
│   ├── head.php            # HTML head + BASE_URL system
│   ├── header.php          # Site navigation
│   ├── footer.php          # Site footer
│   └── scripts.php         # JavaScript includes
├── panel/
│   ├── partials/
│   │   ├── sidebar.php     # Panel sidebar navigation
│   │   └── topbar.php      # Panel top bar
│   ├── api/
│   │   ├── whmcs.php       # WHMCS API proxy
│   │   └── config.example.php  # WHMCS credentials template
│   ├── index.php           # Dashboard
│   ├── login.php           # Login page
│   ├── services.php        # Services list
│   ├── service.php         # Service detail
│   ├── upgrade.php         # Upgrade/downgrade
│   ├── orders.php          # Orders list
│   ├── invoices.php        # Invoices list
│   ├── invoice.php         # Invoice detail
│   ├── tickets.php         # Tickets list
│   ├── ticket.php          # Ticket thread
│   ├── new-ticket.php      # Create ticket
│   └── profile.php         # User profile
├── index.php               # Homepage
├── web-hosting.php         # Web hosting page
├── vps-hosting.php         # VPS hosting page
├── dedicated-servers.php   # Dedicated servers page
├── game-servers.php        # Game server catalog
├── game.php                # Individual game page
├── ... (other pages)
├── 404.php                 # Custom 404 page
├── .htaccess               # Apache configuration
└── README.md               # This file
```

## 🚀 Installation

### Option 1: Root Installation (public_html/)

1. Upload all files to your `public_html/` directory
2. The site will work immediately at `https://yourdomain.com/`

### Option 2: Subfolder Installation (public_html/subfolder/)

1. Upload all files to a subfolder (e.g., `public_html/hosting/`)
2. The BASE_URL system will auto-detect the path
3. Access at `https://yourdomain.com/hosting/`

### Option 3: Subdomain

1. Create a subdomain in cPanel (e.g., `hosting.yourdomain.com`)
2. Upload all files to the subdomain's directory
3. Access at `https://hosting.yourdomain.com/`

## ⚙️ Configuration

### WHMCS Integration (Optional)

To connect to your WHMCS installation:

1. Copy `panel/api/config.example.php` to `panel/api/config.php`
2. Edit `config.php` with your WHMCS credentials:

```php
return [
    'whmcs_url' => 'https://your-whmcs.com',
    'whmcs_identifier' => 'your-api-identifier',
    'whmcs_secret' => 'your-api-secret',
];
```

3. In WHMCS Admin, go to Setup > Staff Management > Manage API Credentials
4. Create a new API Credential with appropriate permissions
5. Copy the Identifier and Secret to your config.php

### Mock Mode vs Live Mode

By default, the panel runs in **Mock Mode** using simulated data. This allows testing without WHMCS.

To switch to Live Mode:
1. Configure `panel/api/config.php` with valid WHMCS credentials
2. The panel will automatically use real WHMCS data

## 🎨 Customization

### Branding

1. Edit brand colors in `assets/css/styles.css` (CSS variables at top)
2. Replace logo text in `partials/header.php`
3. Update footer content in `partials/footer.php`

### Adding Pages

1. Create a new PHP file in the root directory
2. Include the partials:

```php
<?php require_once __DIR__ . '/partials/head.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo getHeadContent('Page Title', 'Page description'); ?>
</head>
<body>
    <?php include __DIR__ . '/partials/header.php'; ?>
    
    <!-- Your content here -->
    
    <?php include __DIR__ . '/partials/footer.php'; ?>
    <?php include __DIR__ . '/partials/scripts.php'; ?>
</body>
</html>
```

3. Add navigation links in `partials/header.php`

### Adding Games

Edit `assets/js/games-data.js` to add new games to the catalog:

```javascript
newgame: {
    id: 'newgame',
    name: 'Game Name',
    tagline: 'Short tagline',
    description: 'Full description',
    category: 'Category',
    // ... see existing games for full structure
}
```

## 🔒 Security Notes

1. **WHMCS Credentials**: The `config.php` file is gitignored. Never commit API secrets.
2. **API Proxy**: All WHMCS calls go through the PHP proxy to protect credentials.
3. **Session Management**: The panel uses PHP sessions for demo auth.
4. **DDoS Protection**: Recommended to use Cloudflare in front of your hosting.

## 📱 Features

- ✅ Fully responsive design
- ✅ Dark theme with glassmorphism effects
- ✅ SEO optimized with semantic HTML
- ✅ Accessible navigation
- ✅ Fast loading (no build step required)
- ✅ Complete client panel with mock data
- ✅ WHMCS integration ready
- ✅ 12+ game server pages
- ✅ Animated hero sections
- ✅ Custom 404 page

## 🐛 Troubleshooting

### CSS/JS not loading?
- Check that .htaccess is uploaded (it may be hidden)
- Verify file permissions (644 for files, 755 for directories)
- Clear browser cache

### Panel not working?
- Ensure PHP sessions are enabled
- Check PHP version (7.4+ recommended)
- Verify partials are correctly included

### 404 errors on pages?
- Confirm .htaccess mod_rewrite is enabled
- Check that all PHP files are uploaded

## 📄 License

This template is provided for use with Hoxta Hosting services.

## 🤝 Support

For support, contact your Hoxta administrator or visit the knowledge base.
