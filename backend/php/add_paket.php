<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
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
    if (!$user) throw new Exception("Token tidak valid atau expired");

    $uid = $user['uid'];
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) throw new Exception("Input tidak valid");

    $namaPaket = trim($input['namaPaket'] ?? '');
    $userProfile = trim($input['userProfile'] ?? '');
    $harga = floatval($input['harga'] ?? 0);
    if (!$namaPaket || !$userProfile || $harga <= 0) {
        throw new Exception("Semua field wajib diisi");
    }

    $paketId = strtolower(str_replace(' ', '_', $namaPaket));
    $database->getReference("hotspot_plans/$uid/$paketId")->set([
        'nama_paket' => $namaPaket,
        'user_profile' => $userProfile,
        'harga' => $harga,
        'created_at' => time()
    ]);

    echo json_encode(['success' => true, 'message' => 'Paket berhasil disimpan']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
