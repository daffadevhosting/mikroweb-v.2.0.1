<?php // file: add_router.php
require_once __DIR__ . '/init.php'; // memuat Firebase Auth dan $uid

$data = json_decode(file_get_contents("php://input"), true);
$ip = $data['ip'] ?? '';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$routerName = $data['routerName'] ?? '';

if (!$routerName || !$ip || !$username || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Semua field harus diisi."]);
    exit;
}

// Referensi root data router user
$userRouterRef = $database->getReference("mikrotik_logins/{$uid}");

// Tes koneksi ke MikroTik
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

try {
    $client = new \PEAR2\Net\RouterOS\Client($ip, $username, $password);
    $responses = $client->sendSync(new \PEAR2\Net\RouterOS\Request('/system/identity/print'));
    $identity = 'MikroTik';

    foreach ($responses as $r) {
        if ($r->getType() === \PEAR2\Net\RouterOS\Response::TYPE_DATA) {
            $identity = $r->getProperty('name') ?? 'MikroTik';
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Router berhasil disimpan dan terhubung ke: $identity",
        "routerId" => $routerId
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Router tidak tersimpan, koneksi gagal: " . $e->getMessage(),
        "routerId" => $routerId
    ]);
}
