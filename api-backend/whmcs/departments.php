<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();

$result = whmcs_call('GetSupportDepartments');

$departments = [];
foreach (($result['departments']['department'] ?? []) as $dept) {
    $departments[] = [
        'id'   => (string) $dept['id'],
        'name' => $dept['name'] ?? '',
    ];
}

echo json_encode(['departments' => $departments]);
