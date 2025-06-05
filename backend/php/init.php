<?php // file: init.php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/PEAR2/Autoload.php';
require_once __DIR__ . '/firebase_init.php';
require_once __DIR__ . '/auth_required.php';

use PEAR2\Net\RouterOS;

function getMikrotikClient($uid) {
    global $database;

    $routersRef = $database->getReference("mikrotik_logins/{$uid}");
    $routers = $routersRef->getValue();

    foreach ($routers as $router) {
        if (!empty($router['isDefault'])) {
            return new \PEAR2\Net\RouterOS\Client(
                $router['ip'],
                $router['username'],
                $router['password']
            );
        }
    }

    throw new Exception('Router default tidak ditemukan');
}

