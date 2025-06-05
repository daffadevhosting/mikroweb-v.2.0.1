<?php
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;

header('Content-Type: application/json');
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan"]);
    exit;
}
$idToken = $matches[1];

$user = verifyFirebaseToken($idToken);
$uid = $user['uid'] ?? null;
if (!$uid) {
    echo json_encode(["success" => false, "error" => "Token tidak valid"]);
    exit;
}

// Ambil default router
$routerData = getDefaultRouter($uid);
if (!$routerData) {
    echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
    exit;
}

$client = new RouterOS\Client($routerData['ip'], $routerData['username'], $routerData['password']);

$users = [];
$userProfiles = [];
$servers = [];

// Ambil users
$resUsers = $client->sendSync(new RouterOS\Request('/ip/hotspot/user/print'));
foreach ($resUsers as $item) {
    if ($item->getType() === RouterOS\Response::TYPE_DATA) {
        $users[] = [
            'name' => $item->getProperty('name'),
        ];
    }
}

// Ambil user-profiles
$resProfiles = $client->sendSync(new RouterOS\Request('/ip/hotspot/user/profile/print'));
foreach ($resProfiles as $item) {
    if ($item->getType() === RouterOS\Response::TYPE_DATA) {
        $userProfiles[] = [
            'name' => $item->getProperty('name'),
            'rate-limit' => $item->getProperty('rate-limit') ?? '',
            'shared-users' => $item->getProperty('shared-users') ?? '',
        ];
    }
}

// Ambil server
$resServers = $client->sendSync(new RouterOS\Request('/ip/hotspot/print'));
foreach ($resServers as $item) {
    if ($item->getType() === RouterOS\Response::TYPE_DATA) {
        $servers[] = [
            'name' => $item->getProperty('name'),
        ];
    }
}

echo json_encode([
    "success" => true,
    "data" => [
        "users" => $users,
        "profiles" => $userProfiles,
        "servers" => $servers
    ]
]);
