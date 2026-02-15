<?php
require_once __DIR__ . '/../_cors.php';

// JWT is stateless — logout is handled client-side by removing the token
// This endpoint exists for API consistency
echo json_encode(['ok' => true]);
