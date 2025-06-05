<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

// Tangani preflight request
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

// Validasi method dan input
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Hanya menerima metode POST"]);
    exit;
}

$cmd = $_POST['command'] ?? '';
if (!$cmd) {
    echo json_encode(["success" => false, "error" => "Perintah kosong"]);
    exit;
}

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

    $request = new RouterOS\Request($cmd);
    $responses = $client->sendSync($request);

    $output = "";
    foreach ($responses as $response) {
        if ($response->getType() === RouterOS\Response::TYPE_DATA) {
            foreach ($response->getIterator() as $key => $value) {
                $output .= "$key: $value\n";
            }
            $output .= "----\n";
        } elseif ($response->getType() === RouterOS\Response::TYPE_ERROR) {
            $output .= "Error: " . $response->getMessage() . "\n";
        }
    }

    echo json_encode([
        "success" => true,
        "output" => trim($output)
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Koneksi gagal: " . $e->getMessage()
    ]);
}
