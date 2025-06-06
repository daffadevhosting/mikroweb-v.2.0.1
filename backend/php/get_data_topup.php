<?php
// file: get_data_topup.php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;

header('Content-Type: application/json');

// === [1] Ambil Token & Verifikasi ===
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan"]);
    exit;
}
$idToken = $matches[1];
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid atau expired"]);
    exit;
}
$uid = $user['uid'];

try {
    // === [2] Ambil Router Default ===
    $routers = $database->getReference("mikrotik_logins/{$uid}")->getValue();
    if (!$routers) throw new Exception("Data router kosong");

    $defaultRouter = null;
    foreach ($routers as $router) {
        if (!empty($router['isDefault'])) {
            $defaultRouter = $router;
            break;
        }
    }
    if (!$defaultRouter) throw new Exception("Router default tidak ditemukan");

    $client = new Client($defaultRouter['ip'], $defaultRouter['username'], $defaultRouter['password']);

    // === [3] Ambil Data User Mikrotik ===
    $users = [];
    $resUsers = $client->sendSync(new Request('/ip/hotspot/user/print'));
    foreach ($resUsers as $item) {
        if ($item->getType() === Response::TYPE_DATA) {
            $users[] = ['name' => $item->getProperty('name')];
        }
    }

    // === [4] Ambil Server Hotspot ===
    $servers = [];
    $resServers = $client->sendSync(new Request('/ip/hotspot/profile/print'));
    foreach ($resServers as $item) {
        if ($item->getType() === Response::TYPE_DATA) {
            $servers[] = ['name' => $item->getProperty('name')];
        }
    }

    // === [5] Ambil Paket Profile ===
    $profiles = [];
    $resProfiles = $client->sendSync(new Request('/ip/hotspot/user/profile/print'));
    foreach ($resProfiles as $item) {
        if ($item->getType() === Response::TYPE_DATA) {
            $profiles[] = [
                'name' => $item->getProperty('name'),
                'rate_limit' => $item->getProperty('rate-limit'),
                'session_timeout' => $item->getProperty('session-timeout'),
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => [
            "users" => $users,
            "servers" => $servers,
            "profiles" => $profiles
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
