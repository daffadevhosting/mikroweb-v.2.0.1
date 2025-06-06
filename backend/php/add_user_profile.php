<?php
// file: add_user_profile.php
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

header('Content-Type: application/json');

// ✅ Ambil & verifikasi token Firebase
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan"]);
    exit;
}
$idToken = $matches[1];
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid"]);
    exit;
}
$uid = $user['uid'];

// ✅ Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$rate_limit = $data['rate_limit'] ?? '';
$shared_users = $data['shared_users'] ?? '';
$session_timeout = $data['session_timeout'] ?? '';
$price = $data['price'] ?? 0;

if (!$name) {
    echo json_encode(['success' => false, 'message' => 'Nama profile wajib diisi']);
    exit;
}
if (!is_numeric($price) || $price < 0) {
    echo json_encode(['success' => false, 'message' => 'Harga tidak valid']);
    exit;
}

// ✅ Ambil router default user
$routers = $database->getReference("mikrotik_logins/{$uid}")->getValue();
$defaultRouter = null;
foreach ($routers ?? [] as $router) {
    if (!empty($router['isDefault'])) {
        $defaultRouter = $router;
        break;
    }
}
if (!$defaultRouter) {
    echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
    exit;
}

// ✅ Koneksi ke MikroTik
try {
    $client = new Client($defaultRouter['ip'], $defaultRouter['username'], $defaultRouter['password']);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Gagal konek ke MikroTik: " . $e->getMessage()]);
    exit;
}

// ✅ Cek profile apakah sudah ada
$check = $client->sendSync(new Request('/ip/hotspot/user/profile/print'));
foreach ($check as $item) {
    if (strtolower($item->getArgument('name')) === strtolower($name)) {
        echo json_encode(['success' => false, 'message' => "Profile '$name' sudah ada"]);
        exit;
    }
}

// ✅ Hapus scheduler sebelumnya jika ada
$oldSched = $client->sendSync(new Request('/system/scheduler/print'));
foreach ($oldSched as $sched) {
    if ($sched->getArgument('name') === 'AutoKiller_' . $name) {
        $client->sendSync((new Request('/system/scheduler/remove'))->setArgument('.id', $sched->getArgument('.id')));
    }
}

// ✅ Script Otomatis
$onLoginScript = <<<RSC
:put (",ntf,,enable,"); {:local date [ /system clock get date ];:local year [ :pick \$date 7 11 ];:local month [ :pick \$date 0 3 ];:local comment [ /ip hotspot user get [/ip hotspot user find where name="\$user"] comment]; :local ucode [:pic \$comment 0 2]; :if (\$ucode = "vc" or \$ucode = "up" or \$comment = "") do={ /sys sch add name="\$user" disable=no start-date=\$date interval="1d"; :delay 2s; :local exp [ /sys sch get [ /sys sch find where name="\$user" ] next-run]; :local getxp [len \$exp]; :if (\$getxp = 15) do={ :local d [:pic \$exp 0 6]; :local t [:pic \$exp 7 16]; :local s ("/"); :local exp ("\$d\$s\$year \$t"); /ip hotspot user set comment=\$exp [find where name="\$user"];}; :if (\$getxp = 8) do={ /ip hotspot user set comment="\$date \$exp" [find where name="\$user"];}; :if (\$getxp > 15) do={ /ip hotspot user set comment=\$exp [find where name="\$user"];}; /sys sch remove [find where name="\$user"]; [:local mac $"mac-address"; /ip hotspot user set mac-address=\$mac [find where name=\$user]]}}
RSC;

$onEventScript = <<<RSC
:local dateint do={:local montharray ( "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec" );:local days [ :pick \$d 4 6 ];:local month [ :pick \$d 0 3 ];:local year [ :pick \$d 7 11 ];:local monthint ([ :find \$montharray \$month]);:local month (\$monthint + 1);:if ( [len \$month] = 1) do={:local zero ("0");:return [:tonum ("\$year\$zero\$month\$days")];} else={:return [:tonum ("\$year\$month\$days")];}}; :local timeint do={ :local hours [ :pick \$t 0 2 ]; :local minutes [ :pick \$t 3 5 ]; :return (\$hours * 60 + \$minutes) ; }; :local date [ /system clock get date ]; :local time [ /system clock get time ]; :local today [\$dateint d=\$date] ; :local curtime [\$timeint t=\$time] ; :foreach i in [ /ip hotspot user find where profile="{$name}" ] do={ :local comment [ /ip hotspot user get \$i comment]; :local name [ /ip hotspot user get \$i name]; :local gettime [:pic \$comment 12 20]; :if ([:pic \$comment 3] = "/" and [:pic \$comment 6] = "/") do={:local expd [\$dateint d=\$comment] ; :local expt [\$timeint t=\$gettime] ; :if ((\$expd < \$today and \$expt < \$curtime) or (\$expd < \$today and \$expt > \$curtime) or (\$expd = \$today and \$expt < \$curtime)) do={ [ /ip hotspot user set limit-uptime=1s \$i ]; [ /ip hotspot active remove [find where user=\$user] ];}}}
RSC;

    // Hapus scheduler sebelumnya
    $oldSched = $client->sendSync(new Request('/system/scheduler/print'));
    foreach ($oldSched as $sched) {
        if ($sched->getType() === Response::TYPE_DATA && $sched->getProperty('name') === $scriptName) {
            $client->sendSync((new Request('/system/scheduler/remove'))->setArgument('.id', $sched->getProperty('.id')));
        }
    }

// ✅ Tambahkan ke MikroTik
$addProfile = new Request('/ip/hotspot/user/profile/add');
$addProfile->setArgument('name', $name);
if ($rate_limit) $addProfile->setArgument('rate-limit', $rate_limit);
if ($shared_users) $addProfile->setArgument('shared-users', $shared_users);
if ($session_timeout) $addProfile->setArgument('session-timeout', $session_timeout);
$addProfile->setArgument('on-login', $onLoginScript);
$client->sendSync($addProfile);

// ✅ Tambahkan scheduler auto killer
$schedRequest = new Request('/system/scheduler/add');
$schedRequest->setArgument('name', 'AutoKiller_' . $name);
$schedRequest->setArgument('interval', '30s');
$schedRequest->setArgument('start-time', 'startup');
$schedRequest->setArgument('on-event', $onEventScript);
$client->sendSync($schedRequest);

// ✅ Simpan juga ke Firebase
$ref = $database->getReference("user_profiles/{$uid}/" . $name);
$ref->set([
    'name' => $name,
    'rate_limit' => $rate_limit,
    'shared_users' => $shared_users,
    'session_timeout' => $session_timeout,
    'price' => (int)$price,
    'created_at' => date('c') // waktu sekarang ISO format
]);

// ✅ Balasan
echo json_encode([
    'success' => true,
    'message' => "✅ Profile '$name' berhasil ditambahkan ke MikroTik dan Firebase!"
]);
exit;