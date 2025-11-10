<?php
/**
 * Simple API Access Test
 * This file tests if PHP files in /api/ are accessible
 * Does NOT require config.php
 */

header('Content-Type: application/json');

$result = [
    'status' => 'SUCCESS',
    'message' => 'API endpoint is accessible!',
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_path' => __FILE__,
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'api_directory_exists' => is_dir(__DIR__),
    'api_directory_path' => __DIR__,
    'files_in_api' => [],
    'timestamp' => date('Y-m-d H:i:s')
];

// List some files in the API directory
if (is_dir(__DIR__)) {
    $files = scandir(__DIR__);
    $phpFiles = array_filter($files, function($file) {
        return pathinfo($file, PATHINFO_EXTENSION) === 'php';
    });
    $result['files_in_api'] = array_slice($phpFiles, 0, 10); // First 10 PHP files
    $result['total_php_files'] = count($phpFiles);
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>

