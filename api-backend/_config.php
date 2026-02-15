<?php
/**
 * === CONFIGURARE WHMCS ===
 * Editează valorile de mai jos cu credențialele tale.
 * NU pune acest fișier pe GitHub!
 */

// URL-ul WHMCS (unde e instalat WHMCS-ul tău)
define('WHMCS_API_URL', 'https://api.hoxta.com/includes/api.php');

// Credențiale API (din WHMCS Admin → Setup → Staff Management → API Credentials)
define('WHMCS_IDENTIFIER', 'PUNE_IDENTIFIER_AICI');
define('WHMCS_SECRET',     'PUNE_SECRET_AICI');

// Secret pentru semnarea JWT-urilor (schimbă cu un string random lung)
define('JWT_SECRET', 'schimba-cu-un-string-random-foarte-lung-aici-1234567890');

// Domenii permise pentru CORS
define('ALLOWED_ORIGINS', serialize([
    'https://hoxta.com',
    'https://www.hoxta.com',
    'https://hoxta.lovable.app',
    'https://id-preview--3c009f31-c1ef-47e9-8a42-d06a347bc20b.lovable.app',
    'http://localhost:5173',
    'http://localhost:8080',
]));
