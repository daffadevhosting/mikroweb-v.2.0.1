<?php
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

use PEAR2\Net\RouterOS;
header('Content-Type: application/json');

// Ambil token dari header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "message" => "Token tidak ditemukan"]);
    exit;
}
$idToken = $matches[1];

// Verifikasi token Firebase
$tokenData = verifyFirebaseToken($idToken);
if (!$tokenData || !isset($tokenData['uid'])) {
    echo json_encode(["success" => false, "message" => "Token tidak valid"]);
    exit;
}
$uid = $tokenData['uid'];

try {
    global $database;
    $routers = $database->getReference("mikrotik_logins/{$uid}")->getValue();

    if (!$routers || !is_array($routers)) {
        throw new Exception("Data router tidak ditemukan.");
    }

    $mikrotikData = null;

    // Ambil router yang isDefault == true
    foreach ($routers as $routerId => $router) {
        if (!empty($router['isDefault'])) {
            $mikrotikData = $router;
            break;
        }
    }

    if (!$mikrotikData) {
        throw new Exception("Router default tidak ditemukan.");
    }

    $client = new RouterOS\Client(
        $mikrotikData['ip'],
        $mikrotikData['username'],
        $mikrotikData['password']
    );

    // Dapatkan semua interface
    $interfaces = $client->sendSync(new RouterOS\Request('/interface/print'));
    $selectedInterface = null;
error_log("Verifikasi token: " . json_encode($tokenData));

    foreach ($interfaces as $intf) {
        if ($intf->getType() === RouterOS\Response::TYPE_DATA) {
            $name = $intf->getProperty('name');

            // Monitor traffic untuk interface ini
            $req = new RouterOS\Request('/interface/monitor-traffic');
            $req->setArgument('interface', $name);
            $req->setArgument('once', '');

            $res = $client->sendSync($req);

            foreach ($res as $r) {
                if ($r->getType() === RouterOS\Response::TYPE_DATA) {
                    $rx = (int)$r->getProperty('rx-bits-per-second');
                    $tx = (int)$r->getProperty('tx-bits-per-second');

                    if ($rx > 0 || $tx > 0) {
                        $selectedInterface = [
                            'name' => $name,
                            'rx' => round($rx / 1024 / 1024, 2),
                            'tx' => round($tx / 1024 / 1024, 2)
                        ];
                        break 2;
                    }
                }
            }
        }
    }

    if (!$selectedInterface) {
        throw new Exception("Tidak ada interface dengan trafik aktif.");
    }

    echo json_encode([
        "success" => true,
        "interface" => $selectedInterface['name'],
        "download" => $selectedInterface['rx'],
        "upload" => $selectedInterface['tx']
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal ambil data: " . $e->getMessage()
    ]);
}
