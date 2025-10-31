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
    
    if (!$imageId) {
        throw new Exception('Image ID is required');
    }

    $stmt = $pdo->prepare("SELECT * FROM artist_images WHERE id = ?");
    $stmt->execute([$imageId]);
    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$image) {
        throw new Exception('Image not found');
    }

    $deleteStmt = $pdo->prepare("DELETE FROM artist_images WHERE id = ?");
    $result = $deleteStmt->execute([$imageId]);

    if (!$result) {
        throw new Exception('Failed to delete image from database');
    }

    $deletedFiles = [];
    $errors = [];

    $mainFilePath = '../public/' . $image['filepath'];
    if (file_exists($mainFilePath)) {
        if (unlink($mainFilePath)) {
            $deletedFiles[] = 'Main image file deleted';
        } else {
            $errors[] = 'Failed to delete main image file';
        }
    }

    $thumbnailFilePath = '../public/' . $image['thumbnail_filepath'];
    if (file_exists($thumbnailFilePath)) {
        if (unlink($thumbnailFilePath)) {
            $deletedFiles[] = 'Thumbnail file deleted';
        } else {
            $errors[] = 'Failed to delete thumbnail file';
        }
    }

    if ($image['is_profile_picture']) {
        $updateStmt = $pdo->prepare("
            UPDATE artist_images 
            SET is_profile_picture = TRUE 
            WHERE artist_id = ? AND id != ? 
            ORDER BY uploaded_at DESC 
            LIMIT 1
        ");
        $updateStmt->execute([$image['artist_id'], $imageId]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Image deleted successfully',
        'deleted_files' => $deletedFiles,
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