<?php
/**
 * Simple JWT Implementation (HMAC-SHA256)
 */
require_once __DIR__ . '/_config.php';

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_create($payload) {
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    
    $payload['iat'] = time();
    $payload['exp'] = time() + (60 * 60 * 24 * 7); // 7 zile
    $payloadEncoded = base64url_encode(json_encode($payload));
    
    $signature = base64url_encode(
        hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
    );
    
    return "$header.$payloadEncoded.$signature";
}

function jwt_verify($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    
    [$header, $payload, $signature] = $parts;
    
    $validSignature = base64url_encode(
        hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
    );
    
    if (!hash_equals($validSignature, $signature)) return null;
    
    $data = json_decode(base64url_decode($payload), true);
    
    // Check expiration
    if (isset($data['exp']) && $data['exp'] < time()) return null;
    
    return $data;
}

/**
 * Get authenticated user from Authorization header
 * Returns payload or sends 401 and exits
 */
function jwt_require_auth() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (empty($authHeader) || !preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
    
    $payload = jwt_verify($matches[1]);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    
    return $payload;
}
