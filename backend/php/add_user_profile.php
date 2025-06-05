<?php // file: add_user_profile.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/firebase_init.php';
require_once __DIR__ . '/vendor/PEAR2/Autoload.php';

use PEAR2\Net\RouterOS;
use PEAR2\Net\RouterOS\Client;
use PEAR2\Net\RouterOS\Request;
use PEAR2\Net\RouterOS\Response;
header('Content-Type: application/json');

// ✅ 1. Ambil dan verifikasi token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan di header Authorization"]);
    exit;
}
$idToken = $matches[1];
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid atau expired"]);
    exit;
}
$uid = $user['uid'];

// ✅ 2. Ambil data input
$data = ($_SERVER['CONTENT_TYPE'] === 'application/json')
    ? json_decode(file_get_contents("php://input"), true)
    : $_POST;

$name = $data['name'] ?? '';
$rate_limit = $data['rate_limit'] ?? '';
$shared_users = $data['shared_users'] ?? '';
$session_timeout = $data['session_timeout'] ?? '';

if (!$name) {
  echo json_encode(['success' => false, 'message' => 'Nama profile wajib diisi']);
  exit;
}

// ✅ 3. Ambil router default user dari Firebase
$routersRef = $database->getReference("mikrotik_logins/{$uid}");
$routers = $routersRef->getValue();
$defaultRouter = null;
foreach ($routers ?? [] as $routerId => $router) {
    if (!empty($router['isDefault'])) {
        $defaultRouter = $router;
        break;
    }
}
if (!$defaultRouter) {
    echo json_encode(["success" => false, "error" => "Router default tidak ditemukan"]);
    exit;
}

$client = new Client($defaultRouter['ip'], $defaultRouter['username'], $defaultRouter['password']);

// ✅ 4. Definisikan script on-login dan scheduler
$onLoginScript = <<<RSC
:local date [/system clock get date];
:local year [:pick \$date 7 11];
:local comment [/ip hotspot user get [find where name=\$user] comment];
:local ucode [:pick \$comment 0 2];
:if (\$ucode = "up" or \$comment = "") do={
  /system scheduler add name=\$user disable=no start-date=\$date interval="1d";
  :delay 2s;
  :local exp [/system scheduler get [find where name=\$user] next-run];
  :local len [:len \$exp];
  :if (\$len = 15) do={
    :local d [:pick \$exp 0 6];
    :local t [:pick \$exp 7 16];
    /ip hotspot user set comment=("exp:" . \$d . "/" . \$year . " " . \$t) [find where name=\$user];
  } else={
    /ip hotspot user set comment=("exp:" . \$exp) [find where name=\$user];
  }
  /system scheduler disable [find where name=\$user];
  :local mac [/ip hotspot active get [find where user=\$user] mac-address];
  /ip hotspot user set mac-address=\$mac [find where name=\$user];
}
RSC;

$onEventScript = <<<RSC
:foreach u in=[/ip hotspot user find] do={
  :local c [/ip hotspot user get \$u comment];
  :if ([:len \$c] > 4 && [:pick \$c 0 4] = "exp:") do={
    :local now [/system clock get time];
    :local date [/system clock get date];
    :local year [:pick \$date 7 11];
    :local fullNow ("\$date/\$year " . \$now);
    :local exp [:pick \$c 4 999];
    :if (\$fullNow > \$exp) do={
      :local uname [/ip hotspot user get \$u name];
      /ip hotspot active disable [find user=\$uname];
      /ip hotspot user set limit-uptime=1s [find name=\$uname];
    }
  }
}
RSC;

// ✅ 5. Tambah profile ke Mikrotik
$request = new Request('/ip/hotspot/user/profile/add');
$request->setArgument('name', $name);
if ($rate_limit) $request->setArgument('rate-limit', $rate_limit);
if ($shared_users) $request->setArgument('shared-users', $shared_users);
if ($session_timeout) $request->setArgument('session-timeout', $session_timeout);
$request->setArgument('on-login', $onLoginScript);
$client->sendSync($request);

// ✅ 6. Tambah scheduler global auto kill user expired
$schedRequest = new Request('/system/scheduler/add');
$schedRequest->setArgument('name', 'AutoKiller_' . $name);
$schedRequest->setArgument('interval', '30s');
$schedRequest->setArgument('start-time', 'startup');
$schedRequest->setArgument('on-event', $onEventScript);
$client->sendSync($schedRequest);

// ✅ 7. Sukses
echo json_encode([
  'success' => true,
  'message' => "✅ User profile '$name' berhasil ditambahkan dengan script otomatis!"
]);
