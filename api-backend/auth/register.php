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

// Required fields
$required = ['firstname', 'lastname', 'email', 'password', 'address1', 'city', 'state', 'postcode', 'country', 'phonenumber'];
foreach ($required as $field) {
    if (empty(trim($input[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit;
    }
}

// Create client in WHMCS
$result = whmcs_call('AddClient', [
    'firstname'   => $input['firstname'],
    'lastname'    => $input['lastname'],
    'email'       => $input['email'],
    'password2'   => $input['password'],
    'address1'    => $input['address1'],
    'address2'    => $input['address2'] ?? '',
    'city'        => $input['city'],
    'state'       => $input['state'],
    'postcode'    => $input['postcode'],
    'country'     => $input['country'],
    'phonenumber' => $input['phonenumber'],
    'companyname' => $input['companyname'] ?? '',
]);

if ($result['result'] !== 'success') {
    http_response_code(400);
    echo json_encode(['error' => $result['message'] ?? 'Registration failed']);
    exit;
}

$clientId = $result['clientid'];

// Create JWT
$token = jwt_create([
    'userid' => $clientId,
    'email'  => $input['email'],
]);

echo json_encode([
    'ok'       => true,
    'clientid' => (int) $clientId,
    'token'    => $token,
    'email'    => $input['email'],
]);
