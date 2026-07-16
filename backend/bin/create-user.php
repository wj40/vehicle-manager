<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config.php';

use Wjagusiak\VehicleManager\Database\Database;

if($argc !== 3){
    die("Usage: php bin/create-user.php <login> <password> \n");
}

$login = $argv[1];
$password = $argv[2];

$db = new Database("localhost", "root", "vehicle_manager", "");
$pdo = $db->connect();

// sprawdzanie czy istnieje
$statement = $pdo->prepare("SELECT id FROM users WHERE login = ?");
$statement->execute([$login]);
if($statement->fetch()){
    die("User '{$login}' already exists.\n");
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$statement = $pdo->prepare("INSERT INTO users (login, password_hash) VALUES (?, ?)");
$statement->execute([$login, $hash]);

echo "User '{$login}' created successfully.\n";
?>