<?php
/**
 * Diagnostic script to check where image files are located
 * This helps debug file path issues
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/config-helper.php';

$results = [
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'not set',
    'script_dir' => __DIR__,
    'upload_dirs' => [],
    'sample_file' => null,
    'file_checks' => []
];

// Check upload directories
$artistDir = getUploadDirectory('artist-images/');
$galleryDir = getUploadDirectory('gallery-images/');

$results['upload_dirs'] = [
    'artist-images' => [
        'path' => $artistDir,
        'exists' => file_exists($artistDir),
        'is_dir' => is_dir($artistDir),
        'readable' => is_readable($artistDir),
        'file_count' => 0
    ],
    'gallery-images' => [
        'path' => $galleryDir,
        'exists' => file_exists($galleryDir),
        'is_dir' => is_dir($galleryDir),
        'readable' => is_readable($galleryDir),
        'file_count' => 0
    ]
];

// Count files in directories (including subdirectories)
if (is_dir($artistDir) && is_readable($artistDir)) {
    $files = array_filter(scandir($artistDir), function($f) use ($artistDir) {
        return $f !== '.' && $f !== '..' && is_file($artistDir . $f);
    });
    $results['upload_dirs']['artist-images']['file_count'] = count($files);
    $results['upload_dirs']['artist-images']['sample_files'] = array_slice($files, 0, 10);
    
    // Check subdirectories
    $subdirs = array_filter(scandir($artistDir), function($f) use ($artistDir) {
        return $f !== '.' && $f !== '..' && is_dir($artistDir . $f);
    });
    $results['upload_dirs']['artist-images']['subdirectories'] = array_values($subdirs);
    
    // Check all files recursively
    $allFiles = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($artistDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $allFiles[] = str_replace($artistDir, '', $file->getPathname());
        }
    }
    $results['upload_dirs']['artist-images']['all_files'] = array_slice($allFiles, 0, 20);
}

if (is_dir($galleryDir) && is_readable($galleryDir)) {
    $files = array_filter(scandir($galleryDir), function($f) use ($galleryDir) {
        return $f !== '.' && $f !== '..' && is_file($galleryDir . $f);
    });
    $results['upload_dirs']['gallery-images']['file_count'] = count($files);
    $results['upload_dirs']['gallery-images']['sample_files'] = array_slice($files, 0, 10);
    
    // Check subdirectories
    $subdirs = array_filter(scandir($galleryDir), function($f) use ($galleryDir) {
        return $f !== '.' && $f !== '..' && is_dir($galleryDir . $f);
    });
    $results['upload_dirs']['gallery-images']['subdirectories'] = array_values($subdirs);
    
    // Check all files recursively
    $allFiles = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($galleryDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $allFiles[] = str_replace($galleryDir, '', $file->getPathname());
        }
    }
    $results['upload_dirs']['gallery-images']['all_files'] = array_slice($allFiles, 0, 20);
}

// Check a specific file from database
$stmt = $pdo->prepare("SELECT filepath FROM artist_images LIMIT 1");
$stmt->execute();
$sample = $stmt->fetch(PDO::FETCH_ASSOC);

if ($sample) {
    $dbPath = $sample['filepath'];
    $results['sample_file'] = [
        'db_path' => $dbPath,
        'checks' => []
    ];
    
    // Try various path resolutions
    $pathsToCheck = [
        'getUploadDirectory' => getUploadDirectory('artist-images/') . basename($dbPath),
        'document_root' => ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/' . ltrim($dbPath, '/'),
        'script_relative' => __DIR__ . '/../' . ltrim($dbPath, '/'),
        'ovh_path_1' => '/home/elektry/www/' . ltrim($dbPath, '/'),
        'ovh_path_2' => '/www/' . ltrim($dbPath, '/'),
    ];
    
    foreach ($pathsToCheck as $name => $path) {
        $results['sample_file']['checks'][$name] = [
            'path' => $path,
            'exists' => file_exists($path),
            'is_file' => is_file($path),
            'readable' => is_readable($path)
        ];
    }
}

echo json_encode($results, JSON_PRETTY_PRINT);

