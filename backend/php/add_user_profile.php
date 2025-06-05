<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/firebase_init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;
use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;
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

// ✅ 2. Ambil data input dari POST

if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
  $data = json_decode(file_get_contents("php://input"), true);
} else {
  $data = $_POST;
}

$name = $data['name'] ?? '';
$rate_limit = $data['rate_limit'] ?? '';
$shared_users = $data['shared_users'] ?? '';
$session_timeout = $data['session_timeout'] ?? '';
$on_login = $data['on_login'] ?? '';
$scheduler = $data['scheduler'] ?? '';

// Validasi minimal
if (!$name) {
  echo json_encode(['success' => false, 'message' => 'Nama profile wajib diisi']);
  exit;
}

// ✅ 3. Ambil router default dari Firebase

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

// ✅ 5. Tambah profile ke Mikrotik
$request = new RouterOS\Request('/ip/hotspot/user/profile/add');
$request->setArgument('name', $name);
if ($rate_limit) $request->setArgument('rate-limit', $rate_limit);
if ($shared_users) $request->setArgument('shared-users', $shared_users);
if ($session_timeout) $request->setArgument('session-timeout', $session_timeout);
if ($on_login) $request->setArgument('on-login', $on_login);

// Kirim ke Mikrotik
$response = $client->sendSync($request);

// Periksa apakah salah satu response adalah TRAP (error)
foreach ($response as $res) {
  if ($res->getType() === 'trap') {
    echo json_encode([
      'success' => false,
      'message' => 'Mikrotik Error: ' . $res->getProperty('message')
    ]);
    exit;
  }
}

// ✅ 5.1 Tambah scheduler kalau ada.
if ($scheduler) {
  $schedRequest = new RouterOS\Request('/system/scheduler/add');
  $schedRequest->setArgument('name', 'scheduler_' . $name);
  $schedRequest->setArgument('start-time', 'startup');
  $schedRequest->setArgument('interval', '1d');
  $schedRequest->setArgument('on-event', $scheduler);
  $client->sendSync($schedRequest);
}

    echo json_encode([
        'success' => true,
        'message' => "✅ User '$username' berhasil ditambahkan!"
    ]);

