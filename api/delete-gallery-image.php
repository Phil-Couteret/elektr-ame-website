<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    $imageId = $_POST['image_id'] ?? $_GET['image_id'] ?? null;
    $imageIds = $_POST['image_ids'] ?? null;
    
    if (!$imageId && !$imageIds) {
        throw new Exception('Image ID(s) required');
    }

    if ($imageId) {
        $imageIds = [$imageId];
    }

    $deletedCount = 0;
    $errors = [];

    foreach ($imageIds as $id) {
        $stmt = $pdo->prepare("SELECT * FROM gallery_images WHERE id = ?");
        $stmt->execute([$id]);
        $image = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$image) {
            $errors[] = "Image with ID {$id} not found";
            continue;
        }

        $deleteStmt = $pdo->prepare("DELETE FROM gallery_images WHERE id = ?");
        $result = $deleteStmt->execute([$id]);

        if (!$result) {
            $errors[] = "Failed to delete image {$id} from database";
            continue;
        }

        $deletedFiles = [];

        $mainFilePath = '../public/' . $image['filepath'];
        if (file_exists($mainFilePath)) {
            if (unlink($mainFilePath)) {
                $deletedFiles[] = 'Main image file deleted';
            } else {
                $errors[] = "Failed to delete main image file for ID {$id}";
            }
        }

        $thumbnailFilePath = '../public/' . $image['thumbnail_filepath'];
        if (file_exists($thumbnailFilePath)) {
            if (unlink($thumbnailFilePath)) {
                $deletedFiles[] = 'Thumbnail file deleted';
            } else {
                $errors[] = "Failed to delete thumbnail file for ID {$id}";
            }
        }

        $deletedCount++;
    }

    echo json_encode([
        'success' => true,
        'deleted_count' => $deletedCount,
        'message' => "Successfully deleted {$deletedCount} image(s)",
        'errors' => $errors
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>