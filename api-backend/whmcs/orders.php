<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();
$method = $_SERVER['REQUEST_METHOD'];

// ============ GET — List orders ============
if ($method === 'GET') {
    $result = whmcs_call('GetOrders', [
        'userid'   => $user['userid'],
        'limitnum' => 100,
    ]);

    $orders = [];
    $orderList = $result['orders']['order'] ?? [];
    foreach ($orderList as $o) {
        $orders[] = [
            'id'            => (string) $o['id'],
            'date'          => $o['date'] ?? '',
            'product'       => $o['name'] ?? '',
            'status'        => strtolower($o['status'] ?? 'pending'),
            'total'         => (float) ($o['amount'] ?? 0),
            'paymentMethod' => $o['paymentmethod'] ?? '',
            'invoiceId'     => (string) ($o['invoiceid'] ?? ''),
        ];
    }
    echo json_encode(['orders' => $orders]);
    exit;
}

// ============ POST — Create order ============
if ($method === 'POST') {
    $input = get_json_input();

    if (empty($input['planId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'planId is required']);
        exit;
    }

    $result = whmcs_call('AddOrder', [
        'clientid'      => $user['userid'],
        'pid'           => [$input['planId']],
        'billingcycle'  => [$input['billingCycle'] ?? 'monthly'],
        'paymentmethod' => $input['paymentMethod'] ?? 'mailin',
    ]);

    if ($result['result'] !== 'success') {
        http_response_code(400);
        echo json_encode(['error' => $result['message'] ?? 'Order creation failed']);
        exit;
    }

    echo json_encode([
        'success'   => true,
        'orderId'   => (string) ($result['orderid'] ?? ''),
        'invoiceId' => (string) ($result['invoiceid'] ?? ''),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
