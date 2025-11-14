<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

try {
    // Search for the video file
    $searchTerm = 'IMG_0938';
    
    $stmt = $pdo->prepare("
        SELECT id, filename, filepath, media_type, gallery_id, file_size, video_duration
        FROM gallery_images 
        WHERE filename LIKE ? 
        ORDER BY id DESC
        LIMIT 10
    ");
    $stmt->execute(["%{$searchTerm}%"]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($results)) {
        echo json_encode([
            'success' => false,
            'message' => 'No video found with filename containing IMG_0938',
            'suggestion' => 'Check if the file was uploaded correctly'
        ], JSON_PRETTY_PRINT);
        exit;
    }
    
    // Check if file exists on server
    foreach ($results as &$result) {
        $fullPath = __DIR__ . '/../' . $result['filepath'];
        $result['file_exists'] = file_exists($fullPath);
        $result['file_path_full'] = $fullPath;
        $result['file_path_web'] = '/' . $result['filepath'];
        
        if ($result['file_exists']) {
            $result['file_size_actual'] = filesize($fullPath);
            $result['file_size_match'] = $result['file_size_actual'] == $result['file_size'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($results),
        'videos' => $results
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

