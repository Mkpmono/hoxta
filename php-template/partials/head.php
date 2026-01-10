<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | Hoxta' : 'Hoxta - Premium Game, Web, VPS & Server Hosting'; ?></title>
    <meta name="description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : 'High-performance infrastructure for gamers, developers, and businesses. Game servers, VPS, web hosting & DDoS protection.'; ?>">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/assets/css/styles.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | Hoxta' : 'Hoxta Hosting'; ?>">
    <meta property="og:description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : 'Premium hosting infrastructure'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://hoxta.com<?php echo $_SERVER['REQUEST_URI']; ?>">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://hoxta.com<?php echo strtok($_SERVER['REQUEST_URI'], '?'); ?>">
    
    <?php if (isset($additionalHead)) echo $additionalHead; ?>
</head>
<body>
