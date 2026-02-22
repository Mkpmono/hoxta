<?php
/**
 * Domain Availability Check via WHMCS
 * GET ?domain=example.com - check single domain
 * POST { "domains": ["example.com", "example.ro"] } - check multiple
 */
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_whmcs.php';

// No auth required for domain checking
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $domain = $_GET['domain'] ?? '';
    if (!$domain) {
        http_response_code(400);
        echo json_encode(['error' => 'Domain parameter required']);
        exit;
    }

    $result = whmcs_call('DomainWhois', ['domain' => $domain]);
    
    echo json_encode([
        'ok' => true,
        'domain' => $domain,
        'status' => ($result['status'] ?? '') === 'available' ? 'available' : 'unavailable',
        'whois' => $result['whois'] ?? null,
    ]);
    exit;
}

if ($method === 'POST') {
    $input = get_json_input();
    $domains = $input['domains'] ?? [];
    
    if (empty($domains) || !is_array($domains)) {
        http_response_code(400);
        echo json_encode(['error' => 'Domains array required']);
        exit;
    }

    // Limit to 10 domains per request
    $domains = array_slice($domains, 0, 10);
    $results = [];

    foreach ($domains as $domain) {
        $domain = trim($domain);
        if (!$domain) continue;
        
        $result = whmcs_call('DomainWhois', ['domain' => $domain]);
        $results[] = [
            'domain' => $domain,
            'status' => ($result['status'] ?? '') === 'available' ? 'available' : 'unavailable',
        ];
    }

    echo json_encode([
        'ok' => true,
        'results' => $results,
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
