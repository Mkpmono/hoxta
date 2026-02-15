<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();
$method = $_SERVER['REQUEST_METHOD'];

// ============ GET ============
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? null;

    // GET /whmcs/services.php?id=X&action=upgrades
    if ($id && $action === 'upgrades') {
        $result = whmcs_call('GetProductUpgrades', [
            'serviceid' => $id,
        ]);
        $upgrades = [];
        if (!empty($result['upgrades'])) {
            foreach ($result['upgrades'] as $u) {
                $upgrades[] = [
                    'id'              => (string) ($u['id'] ?? ''),
                    'name'            => $u['name'] ?? '',
                    'description'     => $u['description'] ?? '',
                    'price'           => (float) ($u['recurringamount'] ?? 0),
                    'priceDifference' => (float) ($u['pricedifference'] ?? 0),
                    'billingCycle'    => $u['billingcycle'] ?? '',
                ];
            }
        }
        echo json_encode($upgrades);
        exit;
    }

    // GET /whmcs/services.php?id=X — single service
    if ($id) {
        $result = whmcs_call('GetClientsProducts', [
            'clientid'  => $user['userid'],
            'serviceid' => $id,
        ]);
        $products = $result['products']['product'] ?? [];
        if (empty($products)) {
            http_response_code(404);
            echo json_encode(['error' => 'Service not found']);
            exit;
        }
        $p = $products[0];
        echo json_encode([
            'id'          => (string) $p['id'],
            'name'        => $p['name'] ?? $p['groupname'] . ' - ' . $p['product'],
            'type'        => detect_service_type($p),
            'status'      => strtolower($p['status'] ?? 'active'),
            'price'       => (float) ($p['recurringamount'] ?? 0),
            'billingCycle' => $p['billingcycle'] ?? '',
            'nextDue'     => $p['nextduedate'] ?? '',
            'domain'      => $p['domain'] ?? '',
            'ip'          => $p['dedicatedip'] ?? '',
            'description' => $p['product'] ?? '',
            'createdAt'   => $p['regdate'] ?? '',
            'packageId'   => (string) ($p['pid'] ?? ''),
            'packageName' => $p['product'] ?? '',
            'serverId'    => (string) ($p['serverid'] ?? ''),
            'serverName'  => $p['servername'] ?? '',
        ]);
        exit;
    }

    // GET /whmcs/services.php — list all
    $result = whmcs_call('GetClientsProducts', [
        'clientid' => $user['userid'],
        'limitnum' => 100,
    ]);

    $services = [];
    $products = $result['products']['product'] ?? [];
    foreach ($products as $p) {
        $services[] = [
            'id'          => (string) $p['id'],
            'name'        => $p['name'] ?? ($p['groupname'] . ' - ' . ($p['product'] ?? '')),
            'type'        => detect_service_type($p),
            'status'      => strtolower($p['status'] ?? 'active'),
            'price'       => (float) ($p['recurringamount'] ?? 0),
            'billingCycle' => $p['billingcycle'] ?? '',
            'nextDue'     => $p['nextduedate'] ?? '',
            'domain'      => $p['domain'] ?? '',
            'ip'          => $p['dedicatedip'] ?? '',
        ];
    }
    echo json_encode(['services' => $services]);
    exit;
}

// ============ POST ============
if ($method === 'POST') {
    $input = get_json_input();
    $action = $input['action'] ?? '';

    if ($action === 'upgrade') {
        $result = whmcs_call('UpgradeProduct', [
            'serviceid'   => $input['serviceId'],
            'type'        => 'product',
            'newproductid' => $input['upgradeOptionId'],
            'paymentmethod' => 'mailin',
        ]);
        echo json_encode([
            'success' => $result['result'] === 'success',
            'orderId' => (string) ($result['orderid'] ?? ''),
        ]);
        exit;
    }

    if ($action === 'cancel') {
        $result = whmcs_call('AddCancelRequest', [
            'serviceid' => $input['serviceId'],
            'type'      => $input['type'] === 'immediate' ? 'Immediate' : 'End of Billing Period',
            'reason'    => $input['reason'] ?? 'Client requested cancellation',
        ]);
        echo json_encode([
            'success'  => $result['result'] === 'success',
            'ticketId' => (string) ($result['ticketid'] ?? ''),
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

// ============ HELPERS ============
function detect_service_type($product) {
    $group = strtolower($product['groupname'] ?? '');
    $name = strtolower($product['product'] ?? $product['name'] ?? '');
    
    if (strpos($group, 'game') !== false || strpos($name, 'minecraft') !== false || strpos($name, 'fivem') !== false) return 'game';
    if (strpos($group, 'vps') !== false || strpos($name, 'vps') !== false) return 'vps';
    if (strpos($group, 'web') !== false || strpos($name, 'hosting') !== false) return 'web';
    if (strpos($group, 'dedicated') !== false) return 'dedicated';
    return 'vps';
}
