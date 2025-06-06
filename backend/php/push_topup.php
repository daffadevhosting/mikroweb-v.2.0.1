<?php
// file: push_topup.php
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
use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;

header('Content-Type: application/json');

try {
    // === [1] Token & User Verification ===
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        throw new Exception("Token tidak ditemukan");
    }

    $idToken = $matches[1];
    $user = verifyFirebaseToken($idToken);
    if (!$user) {
        throw new Exception("Token tidak valid atau expired");
    }
    $uid = $user['uid'];

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

    // === [3] Ambil Input dari Frontend ===
    $input = json_decode(file_get_contents("php://input"), true);
    $usernameHotspot = trim($input['username'] ?? '');
    $server = $input['server'] ?? '';
    $user_profile = $input['user_profile'] ?? '';
    $harga = (int) str_replace('.', '', $input['harga'] ?? 0);

    if (!$usernameHotspot || !$server || !$user_profile) {
        throw new Exception("Semua field wajib diisi");
    }

    // === [4] Ambil Data Paket dari Firebase ===
    $plans = $database->getReference("hotspot_plans/{$uid}")->getValue();
    $paket = null;
    foreach ($plans as $plan) {
        if ($plan['user_profile'] === $user_profile) {
            $paket = $plan;
            break;
        }
    }
    if (!$paket) throw new Exception("Paket '{$user_profile}' tidak ditemukan");

    $masaAktif = $paket['masa_aktif'] ?? 1;
    $jenis = strtolower($paket['jenis_paket'] ?? 'time');
    $limit = $jenis === 'time' ? ($paket['time_limit'] ?? '1h') : ($paket['quota_limit'] ?? '100M');

    // === [5] Cek User di Mikrotik ===
    $response = $client->sendSync(new Request('/ip/hotspot/user/print'));
    $userFound = false;
    $userId = null;

    $targetUsername = strtolower(trim($usernameHotspot));
    foreach ($response as $item) {
        if ($item->getType() === Response::TYPE_DATA) {
            $mikrotikUser = strtolower(trim($item->getProperty('name')));
            if ($mikrotikUser === $targetUsername) {
                $userFound = true;
                $userId = $item->getProperty('.id');
                break;
            }
        }
    }

    if (!$userFound) {
        throw new Exception("User '{$usernameHotspot}' tidak ditemukan di Mikrotik");
    }

    // === [6] Update Profile User ===
    $client->sendSync((new Request('/ip/hotspot/user/set'))
        ->setArgument('.id', $userId)
        ->setArgument('profile', $user_profile)
        ->setArgument('disabled', 'no')
    );

    // === [7] Tambah Scheduler untuk Expired ===
    $expireDate = date("M/d/Y", strtotime("+{$masaAktif} days"));
    $scriptName = "exp-{$usernameHotspot}";
    $scriptBody = "/ip hotspot active remove [find where user=\"{$usernameHotspot}\"]";
    $scriptBody = "/ip hotspot user disable [find where name=\"{$usernameHotspot}\"]";
    $scriptBody = "/ip hotspot cookie remove [find user=\"{$usernameHotspot}\"]";
    $scriptBody = "/sys sch re [find where name=\"{$usernameHotspot}\"]";

    $client->sendSync((new RouterOS\Request('/system/scheduler/add'))
        ->setArgument('name', $scriptName)
        ->setArgument('start-date', $expireDate)
        ->setArgument('interval', '20s')
        ->setArgument('on-event', $scriptBody));

    // === [8] Simpan Log ke Firebase ===
    $logId = uniqid();
    $logData = [
        "username" => $usernameHotspot,
        "server" => $server,
        "user_profile" => $user_profile,
        "harga" => (float)$harga,
        "masa_aktif" => $masaAktif,
        "jenis_paket" => $jenis,
        "limit" => $limit,
        "tanggal" => date("Y-m-d H:i:s"),
    ];
    $database->getReference("topup_logs/{$uid}/{$logId}")->set($logData);

    // === [9] Kirim Respon Final ke Frontend ===
    echo json_encode([
        "success" => true,
        "message" => "TopUp berhasil",
        "username" => $usernameHotspot,
        "profile" => $user_profile,
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "line" => $e->getLine(),
        "file" => basename($e->getFile()),
    ]);
    exit;
}
