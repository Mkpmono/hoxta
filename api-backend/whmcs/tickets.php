<?php
require_once __DIR__ . '/../_cors.php';
require_once __DIR__ . '/../_jwt.php';
require_once __DIR__ . '/../_whmcs.php';

$user = jwt_require_auth();
$method = $_SERVER['REQUEST_METHOD'];

// ============ GET ============
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    // GET /whmcs/tickets.php?id=X — single ticket with messages
    if ($id) {
        $result = whmcs_call('GetTicket', ['ticketid' => $id]);

        if ($result['result'] !== 'success') {
            http_response_code(404);
            echo json_encode(['error' => 'Ticket not found']);
            exit;
        }

        $messages = [];
        foreach (($result['replies']['reply'] ?? []) as $reply) {
            $messages[] = [
                'id'         => (string) ($reply['replyid'] ?? $reply['id'] ?? ''),
                'sender'     => $reply['name'] ?? $reply['admin'] ?? 'System',
                'senderType' => !empty($reply['admin']) ? 'admin' : (!empty($reply['name']) ? 'client' : 'system'),
                'message'    => strip_tags($reply['message'] ?? ''),
                'date'       => $reply['date'] ?? '',
            ];
        }

        echo json_encode([
            'id'           => (string) $result['ticketid'],
            'subject'      => $result['subject'] ?? '',
            'status'       => map_ticket_status($result['status'] ?? ''),
            'priority'     => strtolower($result['priority'] ?? 'medium'),
            'department'   => $result['deptname'] ?? '',
            'departmentId' => (string) ($result['deptid'] ?? ''),
            'lastReply'    => $result['lastreply'] ?? '',
            'createdAt'    => $result['date'] ?? '',
            'messages'     => $messages,
        ]);
        exit;
    }

    // GET /whmcs/tickets.php — list all
    $result = whmcs_call('GetTickets', [
        'clientid' => $user['userid'],
        'limitnum' => 100,
    ]);

    $tickets = [];
    foreach (($result['tickets']['ticket'] ?? []) as $t) {
        $tickets[] = [
            'id'           => (string) $t['id'],
            'subject'      => $t['subject'] ?? '',
            'status'       => map_ticket_status($t['status'] ?? ''),
            'priority'     => strtolower($t['priority'] ?? 'medium'),
            'department'   => $t['deptname'] ?? '',
            'departmentId' => (string) ($t['deptid'] ?? ''),
            'lastReply'    => $t['lastreply'] ?? '',
            'createdAt'    => $t['date'] ?? '',
        ];
    }
    echo json_encode(['tickets' => $tickets]);
    exit;
}

// ============ POST — Reply to ticket ============
if ($method === 'POST') {
    $input = get_json_input();
    $action = $input['action'] ?? '';

    if ($action === 'reply') {
        $result = whmcs_call('AddTicketReply', [
            'ticketid' => $input['ticketId'],
            'message'  => $input['message'],
            'clientid' => $user['userid'],
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

// ============ HELPERS ============
function map_ticket_status($status) {
    $map = [
        'Open'           => 'open',
        'Answered'       => 'answered',
        'Customer-Reply' => 'customer-reply',
        'Closed'         => 'closed',
        'On Hold'        => 'on-hold',
    ];
    return $map[$status] ?? strtolower($status);
}
