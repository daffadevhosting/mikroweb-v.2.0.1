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
  $request = new RouterOS\Request('/ip/hotspot/user/profile/print');
  $responses = $client->sendSync($request);
  
  $result = [];
  foreach ($responses as $r) {
    $result[] = [
      'name' => $r->getProperty('name'),
      'rate_imit' => $r->getProperty('rate-limit'),
      'shared_users' => $r->getProperty('shared-users'),
      'session_timeout' => $r->getProperty('session-timeout'),
    ];
  }

  echo json_encode($result);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
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
