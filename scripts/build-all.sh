#!/bin/bash
# =============================================================================
# Hoxta Hosting — Build & Package Script
# Generates both deployment variants in one step:
#   1. dist/        → Static React/Vite build (for VPS/Nginx)
#   2. php-template/ → PHP cPanel export (already in repo)
# Output: deploy/ folder with both packages as .tar.gz archives
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "============================================"
echo "  Hoxta Hosting — Build & Package"
echo "  $(date)"
echo "============================================"

# Clean previous deploy output
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# ─── 1. React/Vite Static Build ───────────────────────────────────────────────
echo ""
echo "▶ [1/4] Installing dependencies..."
cd "$PROJECT_ROOT"
npm install --silent

echo "▶ [2/4] Building React app (npm run build)..."
npm run build

if [ ! -d "$PROJECT_ROOT/dist" ]; then
  echo "✗ Build failed — dist/ folder not found"
  exit 1
fi

echo "▶ [3/4] Packaging VPS build..."
# Copy dist to deploy folder
cp -r "$PROJECT_ROOT/dist" "$DEPLOY_DIR/vps-static"

# Add Nginx config template
cat > "$DEPLOY_DIR/vps-static/nginx.conf.example" << 'NGINX'
# Hoxta Hosting — Nginx Configuration
# Place this in /etc/nginx/conf.d/hoxta.conf or include in nginx.conf

server {
    listen 80;
    server_name hoxta.com www.hoxta.com;

    # Redirect HTTP to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    root /var/www/hoxta;
    index index.html;

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;
}
NGINX

# Create the archive
cd "$DEPLOY_DIR"
tar -czf "hoxta-vps-$TIMESTAMP.tar.gz" -C vps-static .
echo "  ✓ VPS package: deploy/hoxta-vps-$TIMESTAMP.tar.gz"

# ─── 2. PHP cPanel Package ────────────────────────────────────────────────────
echo "▶ [4/4] Packaging PHP/cPanel build..."

if [ ! -d "$PROJECT_ROOT/php-template" ]; then
  echo "✗ php-template/ folder not found"
  exit 1
fi

# Copy php-template to deploy folder
cp -r "$PROJECT_ROOT/php-template" "$DEPLOY_DIR/cpanel-php"

# Add .htaccess if not present (Apache SPA fallback)
if [ ! -f "$DEPLOY_DIR/cpanel-php/.htaccess" ]; then
  cat > "$DEPLOY_DIR/cpanel-php/.htaccess" << 'HTACCESS'
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
HTACCESS
fi

# Create the archive
cd "$DEPLOY_DIR"
tar -czf "hoxta-cpanel-$TIMESTAMP.tar.gz" -C cpanel-php .
echo "  ✓ cPanel package: deploy/hoxta-cpanel-$TIMESTAMP.tar.gz"

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================"
echo "  ✓ Build complete!"
echo "============================================"
echo ""
echo "  Files ready in deploy/:"
echo "    • hoxta-vps-$TIMESTAMP.tar.gz"
echo "      → Upload contents to /var/www/hoxta/"
echo "      → Use nginx.conf.example for config"
echo ""
echo "    • hoxta-cpanel-$TIMESTAMP.tar.gz"
echo "      → Upload contents to public_html/"
echo "      → Copy panel/api/config.example.php → config.php"
echo "      → Set WHMCS credentials in config.php"
echo ""
echo "  IMPORTANT: Never commit API credentials to git!"
echo "============================================"
