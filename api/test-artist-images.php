<?php
/**
 * Test Artist Images Endpoint
 * Diagnostic tool to check artist images in database
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

try {
    // Check if artist_images table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'artist_images'");
    $tableExists = $tableCheck->rowCount() > 0;
    
    $info = [
        'table_exists' => $tableExists,
        'artists_count' => 0,
        'images_count' => 0,
        'artists' => [],
        'all_images' => []
    ];
    
    if ($tableExists) {
        // Get all artists
        $artistsStmt = $pdo->query("SELECT id, name FROM artists ORDER BY id ASC");
        $info['artists'] = $artistsStmt->fetchAll(PDO::FETCH_ASSOC);
        $info['artists_count'] = count($info['artists']);
        
        // Get all artist images
        $imagesStmt = $pdo->query("
            SELECT 
                ai.id,
                ai.artist_id,
                ai.filename,
                ai.filepath,
                ai.media_type,
                ai.is_profile_picture,
                ai.uploaded_at,
                a.name as artist_name
            FROM artist_images ai
            LEFT JOIN artists a ON ai.artist_id = a.id
            ORDER BY ai.uploaded_at DESC
            LIMIT 20
        ");
        $info['all_images'] = $imagesStmt->fetchAll(PDO::FETCH_ASSOC);
        $info['images_count'] = count($info['all_images']);
        
        // Get image count per artist
        $countStmt = $pdo->query("
            SELECT artist_id, COUNT(*) as count
            FROM artist_images
            GROUP BY artist_id
        ");
        $info['images_per_artist'] = $countStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'info' => $info
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

