<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

try {
    // Find the gallery
    $stmt = $pdo->prepare("
        SELECT id, title, image_count 
        FROM galleries 
        WHERE title LIKE '%Soninca%' OR title LIKE '%Freedonia%'
        ORDER BY id DESC
    ");
    $stmt->execute();
    $galleries = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($galleries)) {
        echo json_encode([
            'success' => false,
            'message' => 'Gallery not found'
        ], JSON_PRETTY_PRINT);
        exit;
    }
    
    $results = [];
    foreach ($galleries as $gallery) {
        // Get images for this gallery
        $imgStmt = $pdo->prepare("
            SELECT id, filename, filepath, media_type, gallery_id, file_size
            FROM gallery_images 
            WHERE gallery_id = ?
            ORDER BY uploaded_at DESC
        ");
        $imgStmt->execute([$gallery['id']]);
        $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $results[] = [
            'gallery' => $gallery,
            'images_count' => count($images),
            'images' => $images
        ];
    }
    
    echo json_encode([
        'success' => true,
        'galleries' => $results
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>

