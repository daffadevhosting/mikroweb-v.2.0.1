<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");

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
    // Ambil log dari Mikrotik
    $logs = $client->sendSync(new RouterOS\Request('/log/print'));

    $logData = [];
    foreach ($logs as $log) {
        if ($log->getType() === RouterOS\Response::TYPE_DATA) {
            $logData[] = [
                'time' => $log->getProperty('time'),
                'topics' => $log->getProperty('topics'),
                'message' => $log->getProperty('message')
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $logData
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
