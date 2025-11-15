<?php
/**
 * OVH Production Database Configuration
 * 
 * ⚠️ INSTRUCTIONS:
 * 1. Copy this file to config.php on OVH server
 * 2. Location: /home/elektry/www/api/config.php
 * 3. Set permissions: chmod 600 config.php
 * 4. NEVER commit config.php to git (it's in .gitignore)
 * 
 * OVH Database Credentials:
 * - Host: elektry2025.mysql.db
 * - Database: elektry2025
 * - Username: elektry
 * - Password: 92Alcolea2025
 */

$host = "elektry2025.mysql.db";
$dbname = "elektry2025";
$username = "elektry";
$password = "92Alcolea2025";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    // Set headers before output
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    die(json_encode([
        'success' => false, 
        'message' => 'Database connection failed',
        'error' => $e->getMessage(),
        'host' => $host,
        'dbname' => $dbname,
        'username' => $username
    ]));
}
?>

