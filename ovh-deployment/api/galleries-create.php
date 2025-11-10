<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $displayOrder = (int)($data['display_order'] ?? 0);
    
    if (empty($title)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title is required']);
        exit();
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO galleries (title, description, display_order, is_active)
        VALUES (?, ?, ?, 1)
    ");
    
    $stmt->execute([$title, $description ?: null, $displayOrder]);
    
    $galleryId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'gallery' => [
            'id' => $galleryId,
            'title' => $title,
            'description' => $description,
            'display_order' => $displayOrder,
            'image_count' => 0
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

