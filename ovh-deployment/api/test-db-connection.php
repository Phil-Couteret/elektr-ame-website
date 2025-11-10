<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include database configuration
require_once __DIR__ . '/config.php';

try {
    
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

