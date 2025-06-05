<?php
// file: auth_required.php
header('Content-Type: application/json');

// Ambil token dari Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Token tidak ditemukan di header Authorization"
    ]);
    exit;
}

$idToken = $matches[1];

// Verifikasi token Firebase
$user = verifyFirebaseToken($idToken);
if (!$user || empty($user['uid'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Token tidak valid atau expired"
    ]);
    exit;
}

// UID siap digunakan
$uid = $user['uid'];
$email = $user['email'] ?? null;
