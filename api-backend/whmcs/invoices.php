<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();
$method = $_SERVER['REQUEST_METHOD'];

// ============ GET ============
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $status = $_GET['status'] ?? null;

    // GET /whmcs/invoices.php?id=X — single invoice
    if ($id) {
        $result = whmcs_call('GetInvoice', ['invoiceid' => $id]);

        if ($result['result'] !== 'success') {
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
            exit;
        }

        // Verify ownership
        if ((string) $result['userid'] !== (string) $user['userid']) {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            exit;
        }

        $items = [];
        foreach (($result['items']['item'] ?? []) as $item) {
            $items[] = [
                'id'          => (string) ($item['id'] ?? ''),
                'description' => $item['description'] ?? '',
                'amount'      => (float) ($item['amount'] ?? 0),
                'taxed'       => (bool) ($item['taxed'] ?? false),
            ];
        }

        echo json_encode([
            'id'            => (string) $result['invoiceid'],
            'date'          => $result['date'] ?? '',
            'dueDate'       => $result['duedate'] ?? '',
            'datePaid'      => $result['datepaid'] ?? null,
            'status'        => strtolower($result['status'] ?? 'unpaid'),
            'subtotal'      => (float) ($result['subtotal'] ?? 0),
            'tax'           => (float) ($result['tax'] ?? 0),
            'total'         => (float) ($result['total'] ?? 0),
            'credit'        => (float) ($result['credit'] ?? 0),
            'items'         => $items,
            'paymentMethod' => $result['paymentmethod'] ?? '',
            'notes'         => $result['notes'] ?? '',
        ]);
        exit;
    }

    // GET /whmcs/invoices.php — list all
    $params = [
        'userid'   => $user['userid'],
        'limitnum' => 100,
    ];
    if ($status) {
        $params['status'] = ucfirst($status);
    }

    $result = whmcs_call('GetInvoices', $params);

    $invoices = [];
    foreach (($result['invoices']['invoice'] ?? []) as $inv) {
        $invoices[] = [
            'id'            => (string) $inv['id'],
            'date'          => $inv['date'] ?? '',
            'dueDate'       => $inv['duedate'] ?? '',
            'datePaid'      => $inv['datepaid'] ?? null,
            'status'        => strtolower($inv['status'] ?? 'unpaid'),
            'subtotal'      => (float) ($inv['subtotal'] ?? 0),
            'tax'           => (float) ($inv['tax'] ?? 0),
            'total'         => (float) ($inv['total'] ?? 0),
            'credit'        => (float) ($inv['credit'] ?? 0),
            'items'         => [],
            'paymentMethod' => $inv['paymentmethod'] ?? '',
        ];
    }
    echo json_encode(['invoices' => $invoices]);
    exit;
}

// ============ POST ============
if ($method === 'POST') {
    $input = get_json_input();
    $action = $input['action'] ?? '';

    if ($action === 'paylink') {
        // Generate a pay link — redirect to WHMCS invoice page
        $invoiceId = $input['invoiceId'] ?? '';
        // Standard WHMCS invoice URL pattern
        $whmcsBase = str_replace('/includes/api.php', '', WHMCS_API_URL);
        $url = "$whmcsBase/viewinvoice.php?id=$invoiceId";
        echo json_encode(['url' => $url]);
        exit;
    }

    if ($action === 'mark-paid') {
        $result = whmcs_call('AddTransaction', [
            'invoiceid'     => $input['invoiceId'],
            'transid'       => $input['transactionId'],
            'gateway'       => 'mailin',
            'amount'        => 0, // Will use invoice total
            'description'   => 'Manual payment',
        ]);
        echo json_encode(['success' => $result['result'] === 'success']);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
