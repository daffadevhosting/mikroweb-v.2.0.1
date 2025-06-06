
<?php // file: add-user-profile.php
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

// ✅ 1. Ambil router default user dari Firebase
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

$ip = $defaultRouter['ip'];
$username = $defaultRouter['username'];
$password = $defaultRouter['password'];

if (isset($_POST['name'])) {
    $name         = preg_replace('/\s+/', '-', $_POST['name']);
    $sharedusers  = $_POST['sharedusers'];
    $ratelimit    = $_POST['ratelimit'];
    $expmode      = $_POST['expmode'];
    $validity     = $_POST['validity'];
    $graceperiod  = $_POST['graceperiod'];
    $price        = $_POST['price']  !== '' ? $_POST['price'] : '0';
    $sprice       = $_POST['sprice'] !== '' ? $_POST['sprice'] : '0';
    $addrpool     = $_POST['ppool'];
    $getlock      = $_POST['lockunlock'];
    $parent       = $_POST['parent'];

    // Lock MAC Address jika Enable
    $lock = ($getlock == "Enable") 
        ? '; [:local mac $"mac-address"; /ip hotspot user set mac-address=$mac [find where name=$user]]'
        : '';

    // Random scheduler time
    $randstarttime = "0" . rand(1, 5) . ":" . rand(10, 59) . ":" . rand(10, 59);
    $randinterval  = "00:02:" . rand(10, 59);

    // Script log pembuatan user
    $record = '; :local mac $"mac-address"; :local time [/system clock get time ]; /system script add name="$date-|-$time-|-$user-|-'.$price.'-|-$address-|-$mac-|-' . $validity . '-|-'.$name.'-|-$comment" owner="$month$year" source=$date comment=mikhmon';

    // On-login script
    if (in_array($expmode, ["rem", "ntf", "remc", "ntfc"])) {
        $onlogin = ':put (",'.$expmode.',' . $price . ',' . $validity . ',' . $sprice . ',,' . $getlock . ',"); ';
        $onlogin .= '{:local date [ /system clock get date ];:local year [ :pick $date 7 11 ];:local month [ :pick $date 0 3 ];';
        $onlogin .= ':local comment [ /ip hotspot user get [/ip hotspot user find where name="$user"] comment]; ';
        $onlogin .= ':local ucode [:pic $comment 0 2]; ';
        $onlogin .= ':if ($ucode = "up" or $comment = "") do={ ';
        $onlogin .= '/sys sch add name="$user" disable=no start-date=$date interval="' . $validity . '"; ';
        $onlogin .= ':delay 2s; :local exp [ /sys sch get [ /sys sch find where name="$user" ] next-run]; ';
        $onlogin .= ':local getxp [len $exp]; ';
        $onlogin .= ':if ($getxp = 15) do={ :local d [:pic $exp 0 6]; :local t [:pic $exp 7 16]; ';
        $onlogin .= ':local s ("/"); :local exp ("$d$s$year $t"); /ip hotspot user set comment=$exp [find where name="$user"];}; ';
        $onlogin .= ':if ($getxp = 8) do={ /ip hotspot user set comment="$date $exp" [find where name="$user"];}; ';
        $onlogin .= ':if ($getxp > 15) do={ /ip hotspot user set comment=$exp [find where name="$user"];}; ';
        if (in_array($expmode, ["remc", "ntfc"])) $onlogin .= $record;
        $onlogin .= $lock . "}}";
        $mode = (in_array($expmode, ["rem", "remc"])) ? "remove" : "set limit-uptime=1s";
    } elseif ($expmode == "0" && $price != "") {
        $onlogin = ':put (",,' . $price . ',,,noexp,' . $getlock . ',")' . $lock;
    } else {
        $onlogin = '';
    }

    // Background service (monitoring script)
    $bgservice = ':local dateint do={:local montharray ( "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec" );';
    $bgservice .= ':local days [ :pick $d 4 6 ];:local month [ :pick $d 0 3 ];:local year [ :pick $d 7 11 ];';
    $bgservice .= ':local monthint ([ :find $montharray $month]);:local month ($monthint + 1);';
    $bgservice .= ':if ( [len $month] = 1) do={:local zero ("0");:return [:tonum ("$year$zero$month$days")];} ';
    $bgservice .= 'else={:return [:tonum ("$year$month$days")];}};';
    $bgservice .= ':local timeint do={ :local hours [ :pick $t 0 2 ]; :local minutes [ :pick $t 3 5 ]; :return ($hours * 60 + $minutes) ; };';
    $bgservice .= ':local date [ /system clock get date ]; :local time [ /system clock get time ];';
    $bgservice .= ':local today [$dateint d=$date] ; :local curtime [$timeint t=$time] ;';
    $bgservice .= ':foreach i in [ /ip hotspot user find where profile="'.$name.'" ] do={ ';
    $bgservice .= ':local comment [ /ip hotspot user get $i comment]; :local name [ /ip hotspot user get $i name];';
    $bgservice .= ':local gettime [:pic $comment 12 20]; ';
    $bgservice .= ':if ([:pic $comment 3] = "/" and [:pic $comment 6] = "/") do={:local expd [$dateint d=$comment] ; ';
    $bgservice .= ':local expt [$timeint t=$gettime] ; ';
    $bgservice .= ':if (($expd < $today and $expt < $curtime) or ($expd < $today and $expt > $curtime) or ($expd = $today and $expt < $curtime)) do={ ';
    $bgservice .= '[ /ip hotspot user '.$mode.' $i ]; [ /ip hotspot active remove [find where user=$name] ];}}}';

    try {
        // Connect to MikroTik
        $client = new RouterOS\Client($ip, $username, $password);

        // Add user profile
        $request = new RouterOS\Request('/ip/hotspot/user/profile/add');
        $request->setArgument('name', $name);
        $request->setArgument('address-pool', $addrpool);
        $request->setArgument('rate-limit', $ratelimit);
        $request->setArgument('shared-users', $sharedusers);
        $request->setArgument('status-autorefresh', '1m');
        $request->setArgument('on-login', $onlogin);
        $request->setArgument('parent-queue', $parent);
        $client->sendSync($request);

        // Tambah scheduler monitoring jika dibutuhkan
        if ($expmode != "0") {
            $schedReq = new RouterOS\Request('/system/scheduler/add');
            $schedReq->setArgument('name', $name);
            $schedReq->setArgument('start-time', $randstarttime);
            $schedReq->setArgument('interval', $randinterval);
            $schedReq->setArgument('on-event', $bgservice);
            $schedReq->setArgument('disabled', 'no');
            $schedReq->setArgument('comment', "Monitor Profile $name");
            $client->sendSync($schedReq);
        }

        // Get profile ID for redirect
        $printReq = new RouterOS\Request('/ip/hotspot/user/profile/print');
        $printReq->setArgument('?.name', $name);
        $res = $client->sendSync($printReq);

        if ($res->getType() === RouterOS\Response::TYPE_DATA) {
            $pid = $res->getProperty('.id');
            echo "<script>window.location='./?user-profile=" . $pid . "&session=" . $session . "'</script>";
        }

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}