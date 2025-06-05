<?php // file: get_user.php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/firebase_init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;

header('Content-Type: application/json');

// Ambil token dari header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan di header Authorization"]);
    exit;
}
$idToken = $matches[1];

try {
    global $database;
    $verified = verifyFirebaseToken($idToken);
    $uid = $verified['uid'] ?? null;

    if (!$uid) {
        echo json_encode(["success" => false, "error" => "Token tidak valid"]);
        exit;
    }

    $mikrotikData = getDefaultRouter($uid);
    if (!$mikrotikData || !$mikrotikData['ip']) {
        echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
        exit;
    }

    $ip = $mikrotikData['ip'];
    $username = $mikrotikData['username'];
    $password = $mikrotikData['password'];

    $client = new RouterOS\Client($ip, $username, $password);
    $users = [];

    $allUsers = $client->sendSync(new RouterOS\Request('/ip/hotspot/user/print'));
    foreach ($allUsers as $res) {
        if ($res->getType() === RouterOS\Response::TYPE_DATA) {
            $user = [
                "username" => $res->getProperty('name') ?? '',
                "profile" => $res->getProperty('profile') ?? '',
                "limit_uptime" => $res->getProperty('limit-uptime') ?? '',
                "ip" => '',
                "uptime" => '',
                "download" => '',
                "upload" => '',
                "status" => "Offline"
            ];
            $users[$user['username']] = $user;
        }
    }

    echo json_encode(["success" => true, "users" => $users]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
