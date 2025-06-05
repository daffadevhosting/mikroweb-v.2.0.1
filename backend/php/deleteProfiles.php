<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ini_set('display_errors', 0);

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

// Ambil token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan di header Authorization"]);
    exit;
}
$idToken = $matches[1];

// Verifikasi token
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid"]);
    exit;
}
$uid = $user['uid'];

// Ambil data .id dari body
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['.id'])) {
    echo json_encode(["success" => false, "error" => "ID profile tidak ditemukan"]);
    exit;
}
$profileId = $data['.id'];

try {
    // Ambil router default
    $routersRef = $database->getReference("mikrotik_logins/{$uid}");
    $routers = $routersRef->getValue();
    $defaultRouter = null;
    foreach ($routers as $router) {
        if (!empty($router['isDefault'])) {
            $defaultRouter = $router;
            break;
        }
    }

    if (!$defaultRouter) {
        echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
        exit;
    }

    $client = new RouterOS\Client($defaultRouter['ip'], $defaultRouter['username'], $defaultRouter['password']);

    // Kirim perintah hapus
    $request = new RouterOS\Request('/ip/hotspot/user/profile/remove');
    $request->setArgument('.id', $profileId);
    $client->sendSync($request);

    echo json_encode(['success' => true, 'message' => 'Profile berhasil dihapus']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
