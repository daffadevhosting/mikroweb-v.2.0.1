<?php // file: save_to_firebase
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS\Client;

header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

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
    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi']);
        exit;
    }

    $ref = $database->getReference("hotspot_users/{$uid}/{$username}");
    $ref->set([
        'username' => $username,
        'password' => $password,
        'created_at' => date('c')
    ]);

    echo json_encode(['success' => true, 'message' => 'Data berhasil disimpan di Firebase']);
    exit;
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Firebase Error: ' . $e->getMessage()]);
    exit;
}
?>
