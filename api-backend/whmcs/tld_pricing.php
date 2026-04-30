<?php
/**
 * TLD Pricing via WHMCS GetTLDPricing
 * GET — returns: { ok: true, currency: "EUR", pricing: { ".com": { price: "9.99", currency: "EUR" }, ... } }
 *
 * Cached for 6 hours in /tmp to reduce WHMCS load.
 */
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_whmcs.php';

$cacheFile = sys_get_temp_dir() . '/whmcs_tld_pricing.json';
$cacheTtl  = 6 * 3600;

if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTtl) {
    header('Content-Type: application/json');
    readfile($cacheFile);
    exit;
}

$res = whmcs_call('GetTLDPricing', ['currencyid' => 1]);

$pricing  = [];
$currency = $res['currency']['code'] ?? 'EUR';

if (!empty($res['pricing']) && is_array($res['pricing'])) {
    foreach ($res['pricing'] as $tld => $info) {
        $reg = $info['register']['1'] ?? null; // 1-year register
        if ($reg !== null && $reg !== '') {
            $pricing['.' . $tld] = ['price' => (string) $reg, 'currency' => $currency];
        }
    }
}

$payload = json_encode([
    'ok'       => true,
    'currency' => $currency,
    'pricing'  => $pricing,
]);

@file_put_contents($cacheFile, $payload);
header('Content-Type: application/json');
echo $payload;
