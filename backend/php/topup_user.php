<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;


try {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        throw new Exception("Token tidak ditemukan di header Authorization");
    }

    $idToken = $matches[1];
    $user = verifyFirebaseToken($idToken);
    if (!$user) throw new Exception("Token tidak valid");

    $uid = $user['uid'];
    $input = json_decode(file_get_contents('php://input'), true);

    $username = $input['username'] ?? '';
    $paketId = $input['paketId'] ?? '';
    $routerId = $input['routerId'] ?? '';
    $paymentMethod = $input['paymentMethod'] ?? 'Tunai';

    if (!$username || !$paketId || !$routerId) throw new Exception("Data tidak lengkap");

    // Ambil data router
    $routerConfig = $database->getReference("mikrotik_logins/$uid/$routerId")->getValue();
    if (!$routerConfig) throw new Exception("Router tidak ditemukan");

    // Ambil data paket
    $paket = $database->getReference("hotspot_plans/$uid/$paketId")->getValue();
    if (!$paket) throw new Exception("Paket tidak ditemukan");

    // Kirim perintah ke Mikrotik
    $client = new PEAR2\Net\RouterOS\Client($routerConfig['ip'], $routerConfig['username'], $routerConfig['password']);

    // Set user profile
    $request = new PEAR2\Net\RouterOS\Request('/ip/hotspot/user/set');
    $request->setArgument('numbers', $username);
    $request->setArgument('profile', $paket['user_profile']);
    $client->sendSync($request);

    // Simpan ke transaksi
    $today = date('Y-m-d');
    $month = date('Y-m');

    $dataTransaksi = [
        'username' => $username,
        'paketId' => $paketId,
        'nama_paket' => $paket['nama_paket'],
        'harga' => $paket['harga'],
        'payment_method' => $paymentMethod,
        'timestamp' => time(),
        'uid' => $uid,
        'routerId' => $routerId
    ];

    $database->getReference("transactions/harian/$today")->push($dataTransaksi);
    $database->getReference("transactions/bulanan/$month")->push($dataTransaksi);

    echo json_encode(['success' => true, 'message' => 'Topup berhasil']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
