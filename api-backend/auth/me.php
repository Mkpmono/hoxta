<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();

// Get client details from WHMCS
$result = whmcs_call('GetClientsDetails', [
    'clientid' => $user['userid'],
    'stats'    => true,
]);

if ($result['result'] !== 'success') {
    http_response_code(404);
    echo json_encode(['error' => 'Client not found']);
    exit;
}

echo json_encode([
    'ok'     => true,
    'client' => [
        'id'          => (string) $result['id'],
        'email'       => $result['email'] ?? '',
        'firstName'   => $result['firstname'] ?? '',
        'lastName'    => $result['lastname'] ?? '',
        'companyName' => $result['companyname'] ?? '',
        'address1'    => $result['address1'] ?? '',
        'city'        => $result['city'] ?? '',
        'state'       => $result['state'] ?? '',
        'postcode'    => $result['postcode'] ?? '',
        'country'     => $result['country'] ?? '',
        'phone'       => $result['phonenumber'] ?? '',
        'status'      => $result['status'] ?? '',
        'credit'      => (float) ($result['credit'] ?? 0),
        'currency'    => $result['currency_code'] ?? 'EUR',
    ],
]);
