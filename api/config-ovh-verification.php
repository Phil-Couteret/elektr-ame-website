<?php
/**
 * Config Verification Script
 * Upload this to /home/elektry/www/api/ and visit it to verify config.php
 * DELETE after verification!
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

$results = [
    'config_file_exists' => file_exists(__DIR__ . '/config.php'),
    'config_readable' => is_readable(__DIR__ . '/config.php'),
    'config_helper_exists' => file_exists(__DIR__ . '/config-helper.php'),
];

if ($results['config_file_exists']) {
    // Try to include and test connection
    try {
        require_once __DIR__ . '/config.php';
        
        // Check if variables are set
        $results['variables'] = [
            'host_set' => isset($host),
            'dbname_set' => isset($dbname),
            'username_set' => isset($username),
            'password_set' => isset($password),
            'host_value' => $host ?? 'NOT SET',
            'dbname_value' => $dbname ?? 'NOT SET',
            'username_value' => $username ?? 'NOT SET',
            'password_set' => !empty($password) ? 'SET (hidden)' : 'NOT SET'
        ];
        
        // Test connection
        if (isset($pdo)) {
            $pdo->query("SELECT 1");
            $results['database_connection'] = 'SUCCESS';
            
            // Test tables
            $tables = ['events', 'artists', 'galleries'];
            foreach ($tables as $table) {
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
                    $count = $stmt->fetch(PDO::FETCH_ASSOC);
                    $results['tables'][$table] = 'EXISTS (' . $count['count'] . ' rows)';
                } catch (Exception $e) {
                    $results['tables'][$table] = 'ERROR: ' . $e->getMessage();
                }
            }
        } else {
            $results['database_connection'] = 'FAILED - $pdo not set';
        }
    } catch (Exception $e) {
        $results['database_connection'] = 'FAILED: ' . $e->getMessage();
        $results['error_details'] = $e->getMessage();
    }
} else {
    $results['error'] = 'config.php file not found at: ' . __DIR__ . '/config.php';
}

echo json_encode($results, JSON_PRETTY_PRINT);
?>

