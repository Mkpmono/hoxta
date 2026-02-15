<?php
/**
 * WHMCS API Helper
 */
require_once __DIR__ . '/_config.php';

function whmcs_call($action, $params = []) {
    $postfields = array_merge([
        'identifier'   => WHMCS_IDENTIFIER,
        'secret'       => WHMCS_SECRET,
        'action'       => $action,
        'responsetype' => 'json',
    ], $params);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => WHMCS_API_URL,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($postfields),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($error) {
        return ['result' => 'error', 'message' => "cURL error: $error"];
    }

    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['result' => 'error', 'message' => 'Invalid JSON from WHMCS'];
    }

    return $data;
}

/**
 * Get JSON input from request body
 */
function get_json_input() {
    return json_decode(file_get_contents('php://input'), true) ?: [];
}
