<?php
/**
 * Move existing images to public/ directory structure
 * This script moves gallery images from /www/gallery-images/ to /www/public/gallery-images/
 * Run this once via browser or CLI to fix the file structure
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$baseDir = dirname(__DIR__);
$results = [
    'moved' => [],
    'errors' => [],
    'skipped' => []
];

try {
    // Create public directories if they don't exist
    $publicGalleryDir = $baseDir . '/public/gallery-images/';
    $publicGalleryThumbDir = $baseDir . '/public/gallery-images/thumbnails/';
    $publicArtistDir = $baseDir . '/public/artist-images/';
    $publicArtistThumbDir = $baseDir . '/public/artist-images/thumbnails/';
    
    if (!file_exists($publicGalleryDir)) {
        mkdir($publicGalleryDir, 0755, true);
    }
    if (!file_exists($publicGalleryThumbDir)) {
        mkdir($publicGalleryThumbDir, 0755, true);
    }
    if (!file_exists($publicArtistDir)) {
        mkdir($publicArtistDir, 0755, true);
    }
    if (!file_exists($publicArtistThumbDir)) {
        mkdir($publicArtistThumbDir, 0755, true);
    }
    
    // Move gallery images
    $galleryDir = $baseDir . '/gallery-images/';
    if (is_dir($galleryDir)) {
        $files = scandir($galleryDir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..' || $file === '.DS_Store') continue;
            
            $sourcePath = $galleryDir . $file;
            $destPath = $publicGalleryDir . $file;
            
            if (is_file($sourcePath)) {
                if (file_exists($destPath)) {
                    $results['skipped'][] = "Gallery image already exists: $file";
                } else if (rename($sourcePath, $destPath)) {
                    $results['moved'][] = "Gallery image: $file";
                } else {
                    $results['errors'][] = "Failed to move gallery image: $file";
                }
            }
        }
        
        // Move thumbnails
        $thumbDir = $galleryDir . 'thumbnails/';
        if (is_dir($thumbDir)) {
            $thumbFiles = scandir($thumbDir);
            foreach ($thumbFiles as $file) {
                if ($file === '.' || $file === '..' || $file === '.DS_Store') continue;
                
                $sourcePath = $thumbDir . $file;
                $destPath = $publicGalleryThumbDir . $file;
                
                if (is_file($sourcePath)) {
                    if (file_exists($destPath)) {
                        $results['skipped'][] = "Thumbnail already exists: $file";
                    } else if (rename($sourcePath, $destPath)) {
                        $results['moved'][] = "Thumbnail: $file";
                    } else {
                        $results['errors'][] = "Failed to move thumbnail: $file";
                    }
                }
            }
        }
    }
    
    // Update database filepaths for moved files
    if (count($results['moved']) > 0) {
        $stmt = $pdo->prepare("UPDATE gallery_images SET filepath = REPLACE(filepath, 'gallery-images/', 'public/gallery-images/') WHERE filepath LIKE 'gallery-images/%'");
        $stmt->execute();
        
        $stmt = $pdo->prepare("UPDATE gallery_images SET thumbnail_filepath = REPLACE(thumbnail_filepath, 'gallery-images/', 'public/gallery-images/') WHERE thumbnail_filepath LIKE 'gallery-images/%'");
        $stmt->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Images moved successfully',
        'moved_count' => count($results['moved']),
        'errors_count' => count($results['errors']),
        'skipped_count' => count($results['skipped']),
        'details' => $results
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

