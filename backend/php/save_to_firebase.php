<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Kreait\Firebase\Factory;

header("Content-Type: application/json");

$factory = (new Factory)
    ->withServiceAccount(__DIR__ . '/secret/firebase-adminsdk.json')
    ->withDatabaseUri('https://lalajo-bokep-default-rtdb.asia-southeast1.firebasedatabase.app');
$database = $factory->createDatabase();

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['user'], $data['paket'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$user  = $data['user'];
$paket = $data['paket'];

try {
    $database->getReference('customers/' . $user['username'])->set([
        'username' => $user['username'],
        'password' => $user['password'],
        'paket' => $paket['name'],
        'created_at' => date('c')
    ]);
    echo json_encode(['success' => true, 'message' => 'Data berhasil disimpan di Firebase']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Firebase Error: ' . $e->getMessage()]);
}
?>
