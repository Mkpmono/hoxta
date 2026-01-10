<?php
/**
 * Hoxta PHP Template - Head Partial
 * Handles BASE_URL for cPanel compatibility
 */

// Determine the base URL dynamically
function getBaseUrl() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
    // Remove trailing slash and handle root
    $baseUrl = rtrim($scriptDir, '/');
    return $baseUrl;
}

$BASE_URL = getBaseUrl();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | Hoxta' : 'Hoxta - Premium Game, Web, VPS & Server Hosting'; ?></title>
    <meta name="description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : 'High-performance infrastructure for gamers, developers, and businesses. Game servers, VPS, web hosting & DDoS protection.'; ?>">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="<?php echo $BASE_URL; ?>/assets/css/styles.css" as="style">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>/assets/css/styles.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>/favicon.ico">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | Hoxta' : 'Hoxta Hosting'; ?>">
    <meta property="og:description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : 'Premium hosting infrastructure'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://hoxta.com<?php echo $_SERVER['REQUEST_URI']; ?>">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://hoxta.com<?php echo strtok($_SERVER['REQUEST_URI'], '?'); ?>">
    
    <!-- Prevent flash of unstyled content -->
    <style>
        html { visibility: hidden; opacity: 0; }
    </style>
    <noscript><style>html { visibility: visible; opacity: 1; }</style></noscript>
    
    <?php if (isset($additionalHead)) echo $additionalHead; ?>
</head>
<body>
    <script>
        // Immediately show content once styles are ready
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
    </script>
