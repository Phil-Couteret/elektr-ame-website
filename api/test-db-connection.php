<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = '92Alcolea2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if members table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'members'");
    $tableExists = $stmt->rowCount() > 0;
    
    // If table exists, get column info
    $columns = [];
    if ($tableExists) {
        $stmt = $pdo->query("DESCRIBE members");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'database_connected' => true,
        'members_table_exists' => $tableExists,
        'table_structure' => $columns,
        'php_version' => phpversion()
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
}
?>

