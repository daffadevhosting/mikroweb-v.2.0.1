<?php // file: mikrotikinfo.php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/vendor/PEAR2/Autoload.php';
require_once __DIR__ . '/firebase_init.php';

use PEAR2\Net\RouterOS;


// Ambil token dari header Authorization: Bearer ...
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["success" => false, "error" => "Token tidak ditemukan di header Authorization"]);
    exit;
}
$idToken = $matches[1];

// Verifikasi token dan ambil UID user
$user = verifyFirebaseToken($idToken);
if (!$user) {
    echo json_encode(["success" => false, "error" => "Token tidak valid atau expired"]);
    exit;
}
$uid = $user['uid'];

$statusMessage = '';
$statusClass = '';
$icon = '';
$routerInfo = [];

try {
    $routersRef = $database->getReference("mikrotik_logins/{$uid}");
    $routers = $routersRef->getValue();

    if (!$routers || !is_array($routers)) {
        echo json_encode(["success" => false, "error" => "Router tidak ditemukan"]);
        exit;
    }

    // Cari router yang memiliki isDefault === true
    $defaultRouter = null;
    foreach ($routers as $routerId => $router) {
        if (isset($router['isDefault']) && $router['isDefault'] === true) {
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
    $statusMessage = "Terhubung ke MikroTik!";
    $statusClass = 'success';
    $icon = 'bi-check-circle-fill';

    
    $client = new RouterOS\Client($ip, $username, $password);
    $responses = $client->sendSync(new RouterOS\Request('/system/resource/print'));
    foreach ($responses as $response) {
        if ($response->getType() === RouterOS\Response::TYPE_DATA) {
            $routerInfo['version'] = $response->getProperty('version');
            $routerInfo['board_name'] = $response->getProperty('board-name');
            $routerInfo['uptime'] = $response->getProperty('uptime');
        }
    }

    $responses = $client->sendSync(new RouterOS\Request('/system/identity/print'));
    foreach ($responses as $response) {
        if ($response->getType() === RouterOS\Response::TYPE_DATA) {
            $routerInfo['identity'] = $response->getProperty('name');
        }
    }

} catch (Exception $e) {
    $statusMessage = "Gagal terhubung: " . $e->getMessage();
    $statusClass = 'danger';
    $icon = 'bi-x-circle-fill';
}

// Deteksi apakah harus tampilkan JSON
// Jika request minta JSON atau berasal dari fetch/XHR, kirim JSON
$acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
$isJsonRequest = strpos($acceptHeader, 'application/json') !== false
    || isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

if ($isJsonRequest) {
    respond([
        "success" => $statusClass === 'success',
        "message" => $statusMessage,
        "router" => $routerInfo
    ]);
    exit;
}

// Fungsi bantu JSON
function respond($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
}

?>
<!DOCTYPE html>
<html lang="id" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>Status Koneksi MikroTik</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
        }
        .card {
            background-color: var(--bs-card-bg, #1c1f26);
            border-radius: 20px;
            box-shadow: 0 15px 25px rgba(0,0,0,0.4);
            padding: 30px;
            max-width: 550px;
            width: 100%;
        }
        .status-box {
            padding: 15px;
            border-radius: 12px;
            font-weight: 600;
            text-align: center;
            margin-top: 20px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .status-box.success {
            background-color: #28a74533;
            color: #28a745;
        }
        .status-box.danger {
            background-color: #dc354533;
            color: #dc3545;
        }
        .router-info dt { font-weight: 600; }
    </style>
</head>
<body>
    <div class="card text-center">
        <h1>Status Koneksi MikroTik</h1>
        <div class="status-box <?= $statusClass ?>">
            <i class="bi <?= $icon ?>"></i>
            <?= htmlspecialchars($statusMessage) ?>
        </div>

        <?php if (!empty($routerInfo)): ?>
        <dl class="router-info mt-4 text-start">
            <dt>Identity:</dt>
            <dd><?= htmlspecialchars($routerInfo['identity'] ?? '-') ?></dd>
            <dt>Versi RouterOS:</dt>
            <dd><?= htmlspecialchars($routerInfo['version'] ?? '-') ?></dd>
            <dt>Board:</dt>
            <dd><?= htmlspecialchars($routerInfo['board_name'] ?? '-') ?></dd>
            <dt>Uptime:</dt>
            <dd><?= htmlspecialchars($routerInfo['uptime'] ?? '-') ?></dd>
        </dl>
        <?php endif; ?>
    </div>
</body>
</html>
