<?php // file: firebase_init.php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Composer autoload
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Database;

// Load .env file hanya sekali
if (!defined('FIREBASE_ENV_LOADED')) {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    define('FIREBASE_ENV_LOADED', true);
    define('FIREBASE_API_KEY', $_ENV['FIREBASE_API_KEY']);
    define('FIREBASE_PROJECT_ID', $_ENV['FIREBASE_PROJECT_ID']);
    define('FIREBASE_DB_URL', $_ENV['FIREBASE_DB_URL']);
    define('FIREBASE_CREDENTIAL_PATH', $_ENV['FIREBASE_CREDENTIAL_PATH']);
}

// Inisialisasi Firebase hanya jika belum ada
if (!isset($auth) || !isset($database)) {
    try {
        $factory = (new Factory)
            ->withServiceAccount(__DIR__ . '/' . FIREBASE_CREDENTIAL_PATH)
            ->withDatabaseUri(FIREBASE_DB_URL);

        $auth = $factory->createAuth();
        $database = $factory->createDatabase();
    } catch (Exception $e) {
        http_response_code(500);
        die(json_encode([
            "success" => false,
            "error" => "Firebase initialization error: " . $e->getMessage()
        ]));
    }
}

// Fungsi untuk verifikasi ID token Firebase
function verifyFirebaseToken(string $idToken)
{
    global $auth;

    try {
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        return [
            'uid' => $verifiedIdToken->claims()->get('sub'),
            'email' => $verifiedIdToken->claims()->get('email') ?? null,
        ];
    } catch (\Kreait\Firebase\Exception\Auth\FailedToVerifyToken $e) {
        return null;
    }
}

function getDefaultRouter(string $uid)
{
    global $database;

    try {
        $ref = $database->getReference("mikrotik_logins/$uid");
        $routers = $ref->getValue();

        if (!$routers) return null;

        foreach ($routers as $router) {
            if (!empty($router['isDefault'])) {
                return [
                    'ip' => $router['ip'] ?? '',
                    'username' => $router['username'] ?? '',
                    'password' => $router['password'] ?? '',
                    'routerName' => $router['routerName'] ?? '',
                ];
            }
        }

        $auth = $factory->createAuth();
        $database = $factory->createDatabase();
        $db = $database;

        return null;
    } catch (Exception $e) {
        return null;
    }
}
