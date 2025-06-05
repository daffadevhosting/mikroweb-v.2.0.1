<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/php/vendor/PEAR2/Autoload.php';

use Dotenv\Dotenv;
use PEAR2\Net\RouterOS;

// Load .env file hanya sekali
if (!defined('FIREBASE_ENV_LOADED')) {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/');
    $dotenv->load();

    define('FIREBASE_ENV_LOADED', true);
    define('IP_HOST', $_ENV['IP_HOST']);
    define('USER_HOST', $_ENV['USER_HOST']);
    define('PASS_HOST', $_ENV['PASS_HOST']);
}

$ip_host = $_ENV['IP_HOST'];
$user_host = $_ENV['USER_HOST'];
$pass_host = $_ENV['PASS_HOST'];

$statusMessage = '';
$statusClass = '';
$icon = '';
$routerInfo = [];

try {
    $client = new RouterOS\Client($ip_host, $user_host, $pass_host);
    
    $statusMessage = "Terhubung ke MikroTik!";
    $statusClass = 'success';
    $icon = 'bi-check-circle-fill';
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

$acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
if (strpos($acceptHeader, 'application/json') !== false) {
    respond([
        "success" => $statusClass === 'success',
        "message" => $statusMessage,
        "router" => $routerInfo
    ]);
    exit;
}

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