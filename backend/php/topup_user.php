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

use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;

header('Content-Type: application/json');

try {
    // === [1] Token & User Verification ===
    $headers = getallheaders();
    if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'] ?? '', $matches)) {
        throw new Exception("Token tidak ditemukan");
    }

    $idToken = $matches[1];
    $user = verifyFirebaseToken($idToken);
    if (!$user) throw new Exception("Token tidak valid atau expired");
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

    // === [3] Ambil Input ===
    $input = json_decode(file_get_contents("php://input"), true);
    $usernameHotspot = strtolower(trim($input['username'] ?? ''));
    $passwordHotspot = $input['password'] ?? '';
    $server = $input['server'] ?? '';
    $userProfiles = $input['user_profile'] ?? '';
    $harga = (int) str_replace('.', '', $input['price'] ?? 0);

    if (!$usernameHotspot || !$server || !$userProfiles) {
        throw new Exception("Semua field wajib diisi");
    }

    // === [4] Ambil Data Paket dari Firebase ===
    $plans = $database->getReference("user_profiles/{$uid}")->getValue();
    $paket = null;

    if ($plans && is_array($plans)) {
        foreach ($plans as $plan) {
            if (!is_array($plan) || !isset($plan['name'])) continue;
            if (strtolower(trim($plan['name'])) === strtolower(trim($userProfiles))) {
                $paket = $plan;
                break;
            }
        }
    }

    if (!$paket) throw new Exception("Paket '{$userProfiles}' tidak ditemukan");

    $masaAktif = $paket['masa_aktif'] ?? 1;
    $jenis = strtolower($paket['jenis_paket'] ?? 'time');
    $limit = $jenis === 'time' ? ($paket['time_limit'] ?? '1h') : ($paket['quota_limit'] ?? '100M');
    $rate_limit = $paket['rate_limit'] ?? '';
    $shared_users = $paket['shared_users'] ?? '1';
    $session_timeout = $paket['session_timeout'] ?? '1h';

    // === [5] Cek user dan update/tambahkan ===
    $response = $client->sendSync(new Request('/ip/hotspot/user/print'));
    $userFound = false;
    $userId = null;
    foreach ($response as $item) {
        if ($item->getType() === Response::TYPE_DATA && $item->getProperty('name') === $usernameHotspot) {
            $userFound = true;
            $userId = $item->getProperty('.id');
            break;
        }
    }

    $req = $userFound
        ? (new Request('/ip/hotspot/user/set'))->setArgument('.id', $userId)
        : new Request('/ip/hotspot/user/add');

    $req->setArgument('name', $usernameHotspot)
        ->setArgument('password', $passwordHotspot)
        ->setArgument('profile', $userProfiles)
        ->setArgument('server', $server)
        ->setArgument('disabled', 'no');

    $client->sendSync($req);

    // === [6] Simpan ke Firebase ===
    $start_time = date('c');
    $expired_time = date('c', strtotime("+{$masaAktif} days"));

    $database->getReference("hotspot_users/{$uid}/{$usernameHotspot}")
        ->set([
            'username' => $usernameHotspot,
            'password' => $passwordHotspot,
            'profile' => $userProfiles,
            'server' => $server,
            'start_time' => $start_time,
            'expired_time' => $expired_time,
            'limit' => $limit,
            'status' => 'enabled',
            'price' => $harga,
            'created_at' => $start_time
        ]);

    echo json_encode(['success' => true, 'message' => 'TopUp berhasil']);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
