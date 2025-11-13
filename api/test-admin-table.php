<?php
/**
 * Test Admin Users Table Structure
 * Diagnose admin_users table issues
 */

header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

try {
    // Check if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            'success' => false,
            'error' => 'Table admin_users does not exist',
            'fix' => 'Run the SQL to create the table'
        ]);
        exit();
    }
    
    // Get table structure
    $stmt = $pdo->query("DESCRIBE admin_users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check for name vs full_name
    $hasName = false;
    $hasFullName = false;
    $columnNames = [];
    
    foreach ($columns as $col) {
        $columnNames[] = $col['Field'];
        if ($col['Field'] === 'name') $hasName = true;
        if ($col['Field'] === 'full_name') $hasFullName = true;
    }
    
    // Check if table has any users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Try to query with full_name
    $testQuery = false;
    $testError = null;
    try {
        $stmt = $pdo->query("SELECT id, email, full_name FROM admin_users LIMIT 1");
        $testQuery = true;
    } catch (PDOException $e) {
        $testError = $e->getMessage();
    }
    
    echo json_encode([
        'success' => true,
        'table_exists' => true,
        'columns' => $columnNames,
        'has_name_column' => $hasName,
        'has_full_name_column' => $hasFullName,
        'user_count' => $count,
        'full_name_query_works' => $testQuery,
        'full_name_query_error' => $testError,
        'issue' => $hasName && !$hasFullName ? 'Table has "name" but code expects "full_name"' : ($hasFullName ? 'Table has "full_name" - OK' : 'Unknown column structure'),
        'database_host' => $host ?? 'unknown'
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'database_host' => $host ?? 'unknown'
    ], JSON_PRETTY_PRINT);
}
?>

