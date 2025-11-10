<?php
/**
 * Diagnostic Script for Production API Testing
 * Upload this to www/api/ on OVH and visit: https://www.elektr-ame.com/api/test-all-endpoints.php
 * DELETE THIS FILE after debugging!
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'tests' => []
];

// Test 1: Check if config.php exists
$results['tests']['config_file'] = [
    'exists' => file_exists(__DIR__ . '/config.php'),
    'readable' => is_readable(__DIR__ . '/config.php')
];

// Test 2: Check if config-helper.php exists
$results['tests']['config_helper'] = [
    'exists' => file_exists(__DIR__ . '/config-helper.php'),
    'readable' => is_readable(__DIR__ . '/config-helper.php')
];

// Test 3: Database connection
try {
    require_once __DIR__ . '/config.php';
    $pdo->query("SELECT 1");
    $results['tests']['database_connection'] = [
        'status' => 'OK',
        'host' => $host ?? 'unknown',
        'database' => $dbname ?? 'unknown'
    ];
} catch (Exception $e) {
    $results['tests']['database_connection'] = [
        'status' => 'FAILED',
        'error' => $e->getMessage()
    ];
}

// Test 4: Check if tables exist
if (isset($pdo)) {
    try {
        $tables = ['events', 'artists', 'galleries', 'gallery_images', 'artist_images', 'admin_users'];
        foreach ($tables as $table) {
            try {
                $stmt = $pdo->query("SELECT 1 FROM $table LIMIT 1");
                $results['tests']['tables'][$table] = 'EXISTS';
            } catch (Exception $e) {
                $results['tests']['tables'][$table] = 'MISSING: ' . $e->getMessage();
            }
        }
    } catch (Exception $e) {
        $results['tests']['tables'] = 'ERROR: ' . $e->getMessage();
    }
}

// Test 5: Test events-list.php logic
if (isset($pdo)) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM events");
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        $results['tests']['events_query'] = [
            'status' => 'OK',
            'count' => $count['count'] ?? 0
        ];
    } catch (Exception $e) {
        $results['tests']['events_query'] = [
            'status' => 'FAILED',
            'error' => $e->getMessage()
        ];
    }
}

// Test 6: Test artists-list.php logic
if (isset($pdo)) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM artists");
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        $results['tests']['artists_query'] = [
            'status' => 'OK',
            'count' => $count['count'] ?? 0
        ];
    } catch (Exception $e) {
        $results['tests']['artists_query'] = [
            'status' => 'FAILED',
            'error' => $e->getMessage()
        ];
    }
}

// Test 7: Test galleries-list.php logic
if (isset($pdo)) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM galleries WHERE is_active = 1");
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        $results['tests']['galleries_query'] = [
            'status' => 'OK',
            'count' => $count['count'] ?? 0
        ];
    } catch (Exception $e) {
        $results['tests']['galleries_query'] = [
            'status' => 'FAILED',
            'error' => $e->getMessage()
        ];
    }
}

// Test 8: Check file permissions
$results['tests']['file_permissions'] = [
    'api_dir' => substr(sprintf('%o', fileperms(__DIR__)), -4),
    'config_readable' => is_readable(__DIR__ . '/config.php')
];

// Test 9: Check PHP version and extensions
$results['tests']['php_info'] = [
    'version' => phpversion(),
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'json' => extension_loaded('json')
];

echo json_encode($results, JSON_PRETTY_PRINT);
?>

