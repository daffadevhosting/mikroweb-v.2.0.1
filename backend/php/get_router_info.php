<?php // file: get_router_info.php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/PEAR2/Autoload.php';
require_once __DIR__ . '/firebase_init.php';
use PEAR2\Net\RouterOS;

header('Content-Type: application/json');

// Ambil token dari header Authorization: Bearer ...
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan di header Authorization"]);
    exit;
}
$idToken = $matches[1];

// Verifikasi token dan ambil UID user
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid atau expired"]);
    exit;
}
$uid = $user['uid'];

try {
    $routersRef = $database->getReference("mikrotik_logins/{$uid}");
    $routers = $routersRef->getValue();

    if (!$routers || !is_array($routers)) {
        echo json_encode(["success" => false, "error" => "Router tidak ditemukan"]);
        exit;
    }

    // Cari router yang memiliki isDefault === true
    $defaultRouter = null;
    foreach ($routers as $routerId => $router) {
        if (isset($router['isDefault']) && $router['isDefault'] === true) {
            $defaultRouter = $router;
            break;
        }
    }

    if (!$defaultRouter) {
        echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
        exit;
    }

    $ip = $defaultRouter['ip'];
    $username = $defaultRouter['username'];
    $password = $defaultRouter['password'];

    $client = new RouterOS\Client($ip, $username, $password);
    $response = $client->sendSync(new RouterOS\Request('/system/resource/print'));

    $data = [];
    foreach ($response as $item) {
        foreach ($item as $k => $v) {
            $data[$k] = $v;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Berhasil ambil info Mikrotik",
        "info" => [
            "model" => $data['platform'] ?? '',
            "version" => $data['version'] ?? '',
            "uptime" => $data['uptime'] ?? '',
            "board" => $data['board-name'] ?? '',
            "cpuLoad" => $data['cpu-load'] ?? '',
            "cpu" => $data['cpu'] ?? '',
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Gagal ambil info Mikrotik: " . $e->getMessage()]);
}
