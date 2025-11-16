<?php
/**
 * Search for image files across the server
 * This helps find where files might actually be stored
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/config-helper.php';

$results = [
    'searches' => [],
    'found_files' => []
];

// Get a few filepaths from database
$stmt = $pdo->prepare("SELECT filepath, filename FROM artist_images LIMIT 5");
$stmt->execute();
$dbFiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

$results['database_files'] = $dbFiles;

// Search locations
$searchLocations = [
    '/home/elektry/www/',
    '/home/elektry/www/public/',
    '/home/elektry/www/public/artist-images/',
    '/home/elektry/www/public/gallery-images/',
    '/www/',
    '/www/public/',
    '/www/public/artist-images/',
    '/www/public/gallery-images/',
    $_SERVER['DOCUMENT_ROOT'] ?? '',
    dirname($_SERVER['DOCUMENT_ROOT'] ?? '') . '/public/',
];

foreach ($dbFiles as $dbFile) {
    $filename = basename($dbFile['filepath']);
    $results['searches'][$filename] = [];
    
    foreach ($searchLocations as $location) {
        if (empty($location)) continue;
        
        $fullPath = rtrim($location, '/') . '/' . $filename;
        $results['searches'][$filename][] = [
            'path' => $fullPath,
            'exists' => file_exists($fullPath),
            'is_file' => is_file($fullPath),
            'readable' => is_readable($fullPath)
        ];
        
        // Also try with subdirectory
        if (strpos($dbFile['filepath'], 'artist-images') !== false) {
            $fullPath2 = rtrim($location, '/') . '/artist-images/' . $filename;
            $results['searches'][$filename][] = [
                'path' => $fullPath2,
                'exists' => file_exists($fullPath2),
                'is_file' => is_file($fullPath2),
                'readable' => is_readable($fullPath2)
            ];
        }
    }
    
    // Check if any path was found
    $found = false;
    foreach ($results['searches'][$filename] as $check) {
        if ($check['exists'] && $check['is_file']) {
            $found = true;
            $results['found_files'][$filename] = $check['path'];
            break;
        }
    }
    
    if (!$found) {
        $results['found_files'][$filename] = null;
    }
}

// Also list what's actually in the upload directories
$artistDir = getUploadDirectory('artist-images/');
$galleryDir = getUploadDirectory('gallery-images/');

$results['actual_files'] = [
    'artist-images' => [],
    'gallery-images' => []
];

if (is_dir($artistDir) && is_readable($artistDir)) {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($artistDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $results['actual_files']['artist-images'][] = [
                'name' => $file->getFilename(),
                'path' => $file->getPathname(),
                'size' => $file->getSize(),
                'modified' => date('Y-m-d H:i:s', $file->getMTime())
            ];
        }
    }
}

if (is_dir($galleryDir) && is_readable($galleryDir)) {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($galleryDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $results['actual_files']['gallery-images'][] = [
                'name' => $file->getFilename(),
                'path' => $file->getPathname(),
                'size' => $file->getSize(),
                'modified' => date('Y-m-d H:i:s', $file->getMTime())
            ];
        }
    }
}

echo json_encode($results, JSON_PRETTY_PRINT);

