<?php // file: get_user_profiles.php
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

// 🔰 Inisialisasi dan Autoload
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;

try {
    // 🔐 Ambil dan verifikasi token Firebase
    $idToken = getBearerToken();
    if (!$idToken) {
        echo json_encode(["success" => false, "message" => "Unauthorized: Token tidak ditemukan"]);
        exit;
    }

    $verified = verifyFirebaseToken($idToken);
    $uid = $verified['uid'] ?? null;

    if (!$uid) {
        echo json_encode(["success" => false, "message" => "Token tidak valid"]);
        exit;
    }

    // 📡 Ambil router default user dari Firebase
    $mikrotikData = getDefaultRouter($uid);
    if (!$mikrotikData || !$mikrotikData['ip']) {
        echo json_encode(["success" => false, "message" => "Router default tidak ditemukan"]);
        exit;
    }

    $ip = $mikrotikData['ip'];
    $username = $mikrotikData['username'];
    $password = $mikrotikData['password'];

    // 🔌 Koneksi ke MikroTik
    $client = new RouterOS\Client($ip, $username, $password);
    $profiles = [];

    
// Ambil semua profile dari Firebase dan normalisasi key-nya (lowercase tanpa spasi)
$firebaseProfilesRaw = $database->getReference("user_profiles/{$uid}")->getValue();
$firebaseProfiles = [];

foreach ($firebaseProfilesRaw as $key => $data) {
    $normalizedKey = strtolower(trim($key));
    $firebaseProfiles[$normalizedKey] = $data;
}

    // 🧾 Ambil semua user-profiles
    $responses = $client->sendSync(new RouterOS\Request('/ip/hotspot/user/profile/print'));

    foreach ($responses as $res) {
        if ($res->getType() === RouterOS\Response::TYPE_DATA) {

        // Normalisasi nama agar cocok
        $normalizedName = strtolower(trim($name));
        $price = isset($firebaseProfiles[$normalizedName]['price']) ? (int)$firebaseProfiles[$normalizedName]['price'] : null;

            $profile = [
                'keyId' => $res->getProperty('.id') ?? '',
                'name' => $res->getProperty('name') ?? '',
                'rate_limit' => $res->getProperty('rate-limit') ?? '',
                'session_timeout' => $res->getProperty('session-timeout') ?? '',
                'shared_users' => $res->getProperty('shared-users') ?? '',
                'on-login' => $res->getProperty('on-login') ?? '',
                'on-logout' => $res->getProperty('on-logout') ?? '',
                'address-pool' => $res->getProperty('address-pool') ?? '',
                'idle-timeout' => $res->getProperty('idle-timeout') ?? '',
                'keepalive-timeout' => $res->getProperty('keepalive-timeout') ?? '',
                'status-autorefresh' => $res->getProperty('status-autorefresh') ?? '',
                'price' =>  $res->getProperty('price') ?? '',
            ];
            $profiles[] = $profile;
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $profiles
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data: " . $e->getMessage()
    ]);
    exit;
}

// 🔧 Fungsi bantu ambil token dari header Authorization
function getBearerToken() {
    $headers = apache_request_headers();
    if (!empty($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}
