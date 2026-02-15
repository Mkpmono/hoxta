<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = get_json_input();

if (empty($input['deptid']) || empty($input['subject']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Department, subject and message are required']);
    exit;
}

$result = whmcs_call('OpenTicket', [
    'clientid' => $user['userid'],
    'deptid'   => $input['deptid'],
    'subject'  => $input['subject'],
    'message'  => $input['message'],
    'priority' => ucfirst($input['priority'] ?? 'medium'),
]);

if ($result['result'] !== 'success') {
    http_response_code(400);
    echo json_encode(['error' => $result['message'] ?? 'Failed to open ticket']);
    exit;
}

echo json_encode([
    'success'  => true,
    'ticketId' => (string) ($result['id'] ?? $result['tid'] ?? ''),
]);
