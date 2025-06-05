<?php
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;

try {
    global $database;
    $db = $database;

    // Ambil data router dari Firebase path mikrotik_config/{uid}
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

    // Ambil user aktif
    $activeUsers = $client->sendSync(new RouterOS\Request('/ip/hotspot/active/print'));
    foreach ($activeUsers as $res) {
        if ($res->getType() === RouterOS\Response::TYPE_DATA) {
            $username = $res->getProperty('user');
            if (isset($users[$username])) {
                $users[$username]['status'] = "Online";
                $users[$username]['ip'] = $res->getProperty('address');
                $users[$username]['uptime'] = $res->getProperty('uptime');
                $users[$username]['download'] = formatBytes($res->getProperty('bytes-in'));
                $users[$username]['upload'] = formatBytes($res->getProperty('bytes-out'));
            }
        }
    }

    // Bersihkan dan urutkan
    $cleaned = array_filter($users, fn($u) => !empty($u['username']));
    usort($cleaned, fn($a, $b) => $a['status'] === 'Online' ? -1 : 1);

    echo json_encode([
        "success" => true,
        "users" => array_values($cleaned)
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data: " . $e->getMessage()
    ]);
}

function formatBytes($bytes) {
    if ($bytes === null) return '';
    $bytes = (int)$bytes;
    if ($bytes >= 1048576) {
        return round($bytes / 1048576, 2) . " MB";
    } elseif ($bytes >= 1024) {
        return round($bytes / 1024, 2) . " KB";
    } else {
        return $bytes . " B";
    }
}
