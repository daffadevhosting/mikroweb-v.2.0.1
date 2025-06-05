<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

$idToken = $matches[1];
$user = verifyFirebaseToken($idToken);
if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid token']);
    exit();
}

$uid = $user['uid'] ?? null;
if (!$uid) {
    echo json_encode(['success' => false, 'error' => 'User ID tidak ditemukan']);
    exit();
}

// Ambil action dari query string
$action = $_GET['action'] ?? null;
if (!$action || !in_array($action, ['ping', 'reboot'])) {
    echo json_encode(['success' => false, 'error' => 'Aksi tidak valid']);
    exit();
}

// Ambil data router
$ref = $database->getReference("mikrotik_logins/$uid");
$routers = $ref->getValue();
if (!$routers) {
    echo json_encode(['success' => false, 'error' => 'Router tidak ditemukan']);
    exit();
}

$first = reset($routers);
$ip = $first['ip'];
$username = $first['username'];
$password = $first['password'];

try {
    $client = new Client([
        'host' => $ip,
        'user' => $username,
        'pass' => $password,
    ]);

    if ($action === 'ping') {
        // Ping IP router-nya sendiri
        $ping = new Query('/ping');
        $ping->equal('address', $ip);
        $result = $client->query($ping)->read();
        echo json_encode([
            'success' => true,
            'message' => 'Ping berhasil',
            'result' => $result
        ]);
    } elseif ($action === 'reboot') {
        $reboot = new Query('/system/reboot');
        $client->query($reboot)->read();
        echo json_encode([
            'success' => true,
            'message' => 'Perintah reboot dikirim'
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
