<?php
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;

header('Content-Type: application/json');

try {
    $idToken = getBearerToken();
    $verified = verifyFirebaseToken($idToken);
    $uid = $verified['uid'] ?? null;
    if (!$uid) throw new Exception("Token tidak valid");

    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'] ?? '';
    if (!$name) throw new Exception("Nama profile kosong");

    $router = getDefaultRouter($uid);
    $client = new RouterOS\Client($router['ip'], $router['username'], $router['password']);

    // Temukan ID
    $responses = $client->sendSync(new RouterOS\Request('/ip/hotspot/user/profile/print'));
    foreach ($responses as $r) {
        if ($r->getProperty('name') === $name) {
            $update = new RouterOS\Request('/ip/hotspot/user/profile/set');
            $update->setArgument('.id', $r->getProperty('.id'));

            if (isset($data['rate-limit'])) $update->setArgument('rate-limit', $data['rate-limit']);
            if (isset($data['shared-users'])) $update->setArgument('shared-users', $data['shared-users']);
            if (isset($data['session-timeout'])) $update->setArgument('session-timeout', $data['session-timeout']);
            if (isset($data['on-login'])) $update->setArgument('on-login', $data['on-login']);
            if (isset($data['scheduler'])) $update->setArgument('scheduler', $data['scheduler']);

            $client->sendSync($update);
            echo json_encode(['success' => true, 'message' => 'Profile berhasil diubah']);
            exit;
        }
    }

    echo json_encode(['success' => false, 'message' => 'Profile tidak ditemukan']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getBearerToken() {
    $headers = apache_request_headers();
    if (!empty($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}
