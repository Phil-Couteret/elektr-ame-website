<?php
/**
 * Local development config using OVH database via SSH tunnel
 * 
 * To use this:
 * 1. Start SSH tunnel: ./setup-ssh-tunnel.sh
 * 2. Rename this file to config.php (or update API files to use this)
 */

// Database configuration for OVH via SSH tunnel
// When SSH tunnel is active, connect to localhost:3306
$host = "127.0.0.1";
$port = "3306";
$dbname = "elektry2025";
$username = "elektry2025";
$password = "92Alcolea2025";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode([
        'success' => false, 
        'message' => 'Database connection failed',
        'hint' => 'Make sure SSH tunnel is running: ./setup-ssh-tunnel.sh'
    ]));
}
?>

