<?php // file: input_user
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
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

header('Content-Type: application/json');

// Ambil token dari header Authorization
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan."]);
    exit;
}
$idToken = $matches[1];

// Verifikasi token dan ambil UID user
$user = verifyFirebaseToken($idToken);
if (!$user) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Token tidak valid atau expired."]);
    exit;
}
$uid = $user['uid'];

// Ambil data POST (dari FormData, jadi bukan JSON!)
$username     = $_POST['username'] ?? '';
$password     = $_POST['password'] ?? '123456';
$profile      = $_POST['profile']  ?? 'default';
$rate_limit   = $_POST['rate_limit'] ?? '1M/1M';
$shared_users = $_POST['shared_users'] ?? '1';
$disable = $_POST['disabled'] ?? 'true';

if (!$username) {
    echo json_encode(["success" => false, "error" => "Username tidak boleh kosong"]);
    exit;
}

try {
    // Ambil router default dari Firebase
    $routersRef = $database->getReference("mikrotik_logins/{$uid}");
    $routers = $routersRef->getValue();

    $defaultRouter = null;
    foreach ($routers as $router) {
        if (!empty($router['isDefault'])) {
            $defaultRouter = $router;
            break;
        }
    }

    if (!$defaultRouter) {
        echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
        exit;
    }

    $client = new RouterOS\Client($defaultRouter['ip'], $defaultRouter['username'], $defaultRouter['password']);

    // Cek dan buat user-profile jika belum ada
    $checkProfile = new RouterOS\Request('/ip/hotspot/user/profile/print');
    $checkProfile->setArgument('.proplist', 'name');
    $checkProfile->setArgument('?name', $profile);
    $profileExists = false;
    foreach ($client->sendSync($checkProfile) as $resp) {
        if ($resp->getType() === RouterOS\Response::TYPE_DATA) {
            $profileExists = true;
            break;
        }
    }

    if (!$profileExists) {
        $addProfile = new RouterOS\Request('/ip/hotspot/user/profile/add');
        $addProfile->setArgument('name', $profile);
        $addProfile->setArgument('rate-limit', $rate_limit);
        $addProfile->setArgument('shared-users', $shared_users);
        $client->sendSync($addProfile);
    }
    
// Ambil semua user dari Mikrotik
$checkUser = new RouterOS\Request('/ip/hotspot/user/print');

$userExists = false;
$response = $client->sendSync($checkUser);
foreach ($response as $resp) {
    if ($resp->getType() === RouterOS\Response::TYPE_ERROR) {
        $name = $resp->getArgument('name');
        if (strtolower($name) === strtolower($username)) {
            $userExists = true;
            break;
        }
    }
}

    // Tambahkan user (karena belum ada)
    $addUser = new RouterOS\Request('/ip/hotspot/user/add');
    $addUser->setArgument('name', $username);
    $addUser->setArgument('password', $password);
    $addUser->setArgument('profile', $profile);
    $addUser->setArgument('disabled', $disable);
    $client->sendSync($addUser);

        echo json_encode(["success" => true, "message" => "✅ User '$username' berhasil ditambahkan."]);

    } catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Exception: " . $e->getMessage()]);
}
