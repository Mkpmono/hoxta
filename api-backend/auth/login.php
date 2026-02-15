<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = get_json_input();
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

// Validate login with WHMCS
$result = whmcs_call('ValidateLogin', [
    'email'     => $email,
    'password2' => $password,
]);

if ($result['result'] !== 'success') {
    http_response_code(401);
    echo json_encode(['error' => $result['message'] ?? 'Invalid email or password']);
    exit;
}

$userId = $result['userid'];

// Create JWT
$token = jwt_create([
    'userid' => $userId,
    'email'  => $email,
]);

echo json_encode([
    'ok'     => true,
    'token'  => $token,
    'userid' => (int) $userId,
    'email'  => $email,
]);
