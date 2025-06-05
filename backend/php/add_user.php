<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;
use PEAR2\Net\Transmitter\SocketException;

header('Content-Type: application/json');

// Ambil input JSON
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Input kosong.']);
    exit;
}

// ✅ Verifikasi token Firebase
$token = $input['token'] ?? '';
$uid = verifyFirebaseToken($token);
if (!$uid) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Token tidak valid.']);
    exit;
}

// ✅ Ambil data router dari frontend (bukan Firebase)
$router = $input['router'] ?? [];
$host = $router['ip'] ?? '';
$user = $router['username'] ?? '';
$pass = $router['password'] ?? '';

$username = $input['username'] ?? '';
$password = $input['password'] ?? '123456';
$profile = $input['profile'] ?? 'default';
$rate_limit = $input['rate_limit'] ?? '1M/1M';
$session_input = $input['session_timeout'] ?? '1';
$shared_users = $input['shared_users'] ?? '1';

$session_timeout = str_pad($session_input, 2, '0', STR_PAD_LEFT) . ':00:00';

if (!$host || !$user || !$pass || !$username) {
    echo json_encode([
        'success' => false,
        'message' => 'Data router/user tidak lengkap.'
    ]);
    exit;
}

try {
    $client = new Client($host, $user, $pass);

    // Cek profile
    $checkProfile = new Request('/ip/hotspot/user/profile/print');
    $checkProfile->setArgument('.proplist', 'name');
    $checkProfile->setArgument('?name', $profile);
    $profileExists = false;

    foreach ($client->sendSync($checkProfile) as $resp) {
        if ($resp->getType() === Response::TYPE_DATA) {
            $profileExists = true;
            break;
        }
    }

    if (!$profileExists) {
        $addProfile = new Request('/ip/hotspot/user/profile/add');
        $addProfile->setArgument('name', $profile);
        $addProfile->setArgument('session-timeout', $session_timeout);
        $addProfile->setArgument('rate-limit', $rate_limit);
        $addProfile->setArgument('shared-users', $shared_users);
        $client->sendSync($addProfile);
    }

    // Cek user
    $checkUser = new Request('/ip/hotspot/user/print');
    $checkUser->setArgument('?name', $username);
    foreach ($client->sendSync($checkUser) as $resp) {
        if ($resp->getType() === Response::TYPE_DATA) {
            echo json_encode([
                'success' => false,
                'message' => "User '$username' sudah ada."
            ]);
            exit;
        }
    }

    // Tambah user
    $addUser = new Request('/ip/hotspot/user/add');
    $addUser->setArgument('name', $username);
    $addUser->setArgument('password', $password);
    $addUser->setArgument('profile', $profile);
    $addUser->setArgument('comment', "UID: $uid | via Dashboard");

    $responses = $client->sendSync($addUser);
    foreach ($responses as $resp) {
        if ($resp->getType() === Response::TYPE_ERROR) {
            echo json_encode([
                'success' => false,
                'message' => "❌ Gagal: " . $resp->getProperty('message')
            ]);
            exit;
        }
    }

    echo json_encode([
        'success' => true,
        'message' => "✅ User '$username' berhasil ditambahkan!"
    ]);
} catch (SocketException $e) {
    echo json_encode([
        'success' => false,
        'message' => "❌ Gagal konek ke MikroTik: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "❌ Error: " . $e->getMessage()
    ]);
}
