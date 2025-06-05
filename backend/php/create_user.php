<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;
use Dotenv\Dotenv;

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Ambil dari .env
$host = $_ENV['MT_IP'];
$user = $_ENV['MT_USER'];
$pass = $_ENV['MT_PASS'];

try {
    $client = new RouterOS\Client($host, $user, $pass);

    $username     = $_POST['username'] ?? 'testuser';
    $password     = $_POST['password'] ?? '123456';
    $profile      = $_POST['profile']  ?? 'default';
    $rate_limit   = $_POST['rate_limit'] ?? '1M/1M';
    $shared_users = $_POST['shared_users'] ?? '1';

    // Cek apakah profile sudah ada
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

    // Jika belum ada, buat profile
    if (!$profileExists) {
        $addProfile = new RouterOS\Request('/ip/hotspot/user/profile/add');
        $addProfile->setArgument('name', $profile);
        $addProfile->setArgument('rate-limit', $rate_limit);
        $addProfile->setArgument('shared-users', $shared_users);
        $client->sendSync($addProfile);
    }

    // Buat user hotspot
    $addUser = new RouterOS\Request('/ip/hotspot/user/add');
    $addUser->setArgument('name', $username);
    $addUser->setArgument('password', $password);
    $addUser->setArgument('profile', $profile);

    $responses = $client->sendSync($addUser);
    foreach ($responses as $resp) {
        if ($resp->getType() === RouterOS\Response::TYPE_ERROR) {
            echo "Gagal: " . $resp->getProperty('message');
            exit;
        }
    }

    echo "User hotspot berhasil dibuat!";

} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
}
