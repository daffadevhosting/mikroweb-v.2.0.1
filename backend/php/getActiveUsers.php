<?php
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

// Ambil token dari header Authorization Bearer
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
    // Request active hotspot users (sesuaikan jika menggunakan PPP, Hotspot, atau DHCP lease)
    $request = new RouterOS\Request('/ip/hotspot/active/print');
    $responses = $client->sendSync($request);

    $users = [];
    foreach ($responses as $response) {
        if ($response->getType() === RouterOS\Response::TYPE_DATA) {
            $user = [
                "username" => $response->getProperty('user'),
                "ip" => $response->getProperty('address'),
                "uptime" => $response->getProperty('uptime'),
                "download" => formatBytes($response->getProperty('bytes-in')),
                "upload" => formatBytes($response->getProperty('bytes-out'))
            ];
            $users[] = $user;
        }
    }

    echo json_encode($users);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

// Fungsi bantu format bytes ke MB atau KB
function formatBytes($bytes) {
    if ($bytes === null) return "0 MB";
    $bytes = (int)$bytes;
    if ($bytes >= 1048576) {
        return round($bytes / 1048576, 2) . " MB";
    } elseif ($bytes >= 1024) {
        return round($bytes / 1024, 2) . " KB";
    } else {
        return $bytes . " B";
    }
}
