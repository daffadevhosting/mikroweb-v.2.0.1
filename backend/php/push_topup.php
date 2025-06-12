<?php
// file: push_topup.php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;
use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;

date_default_timezone_set("Asia/Jakarta");

header('Content-Type: application/json');

function convertTimeLimit($limit) {
    // Contoh: '1h', '30m', '2d'
    $matches = [];
    if (preg_match('/^(\d+)([hdm])$/i', $limit, $matches)) {
        $value = (int) $matches[1];
        $unit = strtolower($matches[2]);
        switch ($unit) {
            case 'h': return "{$value}h";
            case 'd': return "{$value}d";
            case 'm': return "{$value}m";
            default: return '1h'; // fallback
        }
    }
    return '1h';
}

function convertQuotaToBytes($quota) {
    // Contoh: '100M', '1G', '500K'
    $matches = [];
    if (preg_match('/^(\d+)([KMG])B?$/i', strtoupper($quota), $matches)) {
        $value = (int) $matches[1];
        $unit = strtoupper($matches[2]);
        switch ($unit) {
            case 'K': return $value * 1024;
            case 'M': return $value * 1024 * 1024;
            case 'G': return $value * 1024 * 1024 * 1024;
        }
    }
    return 100 * 1024 * 1024; // fallback: 100MB
}

function parseSessionTimeout($timeout) {
    if (preg_match('/^(\d+)([hdm])$/i', $timeout, $matches)) {
        $value = (int)$matches[1];
        $unit = strtolower($matches[2]);
        switch ($unit) {
            case 'h': return $value * 3600;
            case 'd': return $value * 86400;
            case 'm': return $value * 60;
        }
    }
    return 3600; // Default 1 jam
}

try {
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

    $input = json_decode(file_get_contents("php://input"), true);
    $usernameHotspot = trim($input['username'] ?? '');
    $server = $input['server'] ?? '';
    $user_profile = $input['user_profile'] ?? '';

    if (!$usernameHotspot || !$server || !$user_profile) {
        throw new Exception("Semua field wajib diisi");
    }

    $allProfiles = $database->getReference("user_profiles/{$uid}")->getValue();
    $profileData = $allProfiles[$user_profile] ?? null;
    if (!$profileData) throw new Exception("User-profile tidak ditemukan");

    $price = (int)($profileData['price'] ?? 0);
    $sessionTimeout = ($profileData['session_timeout'] ?? '1h');
    $sessionTimeoutStr = $paket['session_timeout'] ?? '1h'; // Ambil dari Firebase
    $timeoutSeconds = parseSessionTimeout($sessionTimeoutStr);
    $startTimestamp = time(); // sekarang (UNIX time)
    $expireTimestamp = $startTimestamp + $timeoutSeconds;

    $startTimeFormatted = date("Y-m-d H:i:s", $startTimestamp);
    $expireTimeFormatted = date("Y-m-d H:i:s", $expireTimestamp);

    $masaAktif = $paket['masa_aktif'] ?? 1;
    $jenis = strtolower($paket['jenis_paket'] ?? 'time');
    $limit = $jenis === 'time' ? ($paket['session_timeout'] ?? '1h') : ($paket['quota_limit'] ?? '100M');

    if ($jenis === 'time') {
        $limitUptime = convertTimeLimit($limit); // contoh: "1h"
        $mikrotikCmds = [
            "/ip hotspot user set [find where name=\"$username\"] limit-uptime=$limitUptime",
            "/ip hotspot user reset-counters [find where name=\"$username\"]"
        ];
    } else {
        $limitBytes = convertQuotaToBytes($limit); // contoh: 104857600
        $mikrotikCmds = [
            "/ip hotspot user set [find where name=\"$username\"] limit-uptime=0s",
            "/ip hotspot user set [find where name=\"$username\"] limit-bytes-total=$limitBytes",
            "/ip hotspot user reset-counters [find where name=\"$username\"]"
        ];
    }

    $response = $client->sendSync(new Request('/ip/hotspot/user/print'));
    $userFound = false;
    $userId = null;

    foreach ($response as $item) {
        if ($item->getType() === Response::TYPE_DATA) {
            if (strtolower(trim($item->getProperty('name'))) === strtolower($usernameHotspot)) {
                $userFound = true;
                $userId = $item->getProperty('.id');
                break;
            }
        }
    }
    if (!$userFound) throw new Exception("User '{$usernameHotspot}' tidak ditemukan di Mikrotik");

    $client->sendSync((new Request('/ip/hotspot/user/set'))
        ->setArgument('server', $server)
        ->setArgument('.id', $userId)
        ->setArgument('profile', $user_profile)
        ->setArgument('comment', '')
        ->setArgument('disabled', 'no')
    );

    $scriptName = "exp-{$usernameHotspot}";
    $scriptBody = <<<SCR
    [/ip hotspot active remove [find where user={$usernameHotspot}]];
    [/ip hotspot user disable [find where name={$usernameHotspot}]];
    [/ip hotspot cookie remove [find user={$usernameHotspot}]];
    [/system scheduler remove [find where name={$scriptName}]];
    SCR;

// 1. Cek scheduler lama
$requestFind = new RouterOS\Request('/system/scheduler/print');
$requestFind->setQuery(RouterOS\Query::where('name', $scriptName));
$response = $client->sendSync($requestFind);

// 2. Hapus jika ada
foreach ($response as $item) {
    if ($item->getType() === RouterOS\Response::TYPE_DATA) {
        $id = $item->getProperty('.id');
        $client->sendSync((new RouterOS\Request('/system/scheduler/remove'))
            ->setArgument('.id', $id));
    }
}

// 3. Tambahkan scheduler baru
$client->sendSync((new RouterOS\Request('/system/scheduler/add'))
    ->setArgument('name', $scriptName)
    ->setArgument('start-date', $expiredDateFormatted)
    ->setArgument('interval', $sessionTimeout)
    ->setArgument('on-event', $scriptBody));

    $logId = uniqid();
    $logData = [
        "username" => $usernameHotspot,
        "server" => $server,
        "user_profile" => $user_profile,
        "price" => $price,
        "session_timeout" => $sessionTimeoutStr,
        "start_time" => $startTimeFormatted,
        "expired_time" => $expireTimeFormatted,
        "status" => "active",
        "tanggal" => $startTimeFormatted,
    ];
    $database->getReference("topup_logs/{$uid}/{$logId}")->set($logData);

    echo json_encode([
        "success" => true,
        "message" => "TopUp berhasil",
        "username" => $usernameHotspot,
        "profile" => $user_profile,
        "server" => $server,
        "harga" => $price,
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "line" => $e->getLine(),
        "file" => basename($e->getFile()),
    ]);
    exit;
}
