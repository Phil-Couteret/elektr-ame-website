<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            g.*,
            COUNT(gi.id) as image_count,
            gi_cover.filepath as cover_image_path
        FROM galleries g
        LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
        LEFT JOIN gallery_images gi_cover ON g.cover_image_id = gi_cover.id
        WHERE g.is_active = 1
        GROUP BY g.id
        ORDER BY g.display_order ASC, g.created_at DESC
    ");
    
    $stmt->execute();
    $galleries = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'galleries' => $galleries
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

