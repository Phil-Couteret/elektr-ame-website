<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once 'config.php';

$uploadDir = '../public/artist-images/';
$thumbnailDir = '../public/artist-images/thumbnails/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!file_exists($thumbnailDir)) {
    mkdir($thumbnailDir, 0755, true);
}

try {
    $artistId = $_POST['artist_id'] ?? null;
    
    if (!$artistId) {
        throw new Exception('Artist ID is required');
    }

    $stmt = $pdo->prepare("SELECT id FROM artists WHERE id = ?");
    $stmt->execute([$artistId]);
    if (!$stmt->fetch()) {
        throw new Exception('Artist not found');
    }

    $uploadedCount = 0;
    $errors = [];

    foreach ($_FILES['images']['name'] as $index => $filename) {
        if (empty($filename)) continue;

        $file = [
            'name' => $_FILES['images']['name'][$index],
            'type' => $_FILES['images']['type'][$index],
            'tmp_name' => $_FILES['images']['tmp_name'][$index],
            'error' => $_FILES['images']['error'][$index],
            'size' => $_FILES['images']['size'][$index]
        ];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = "Error uploading {$filename}";
            continue;
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            $errors[] = "Invalid file type for {$filename}";
            continue;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            $errors[] = "File too large for {$filename}";
            continue;
        }

        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $uniqueFilename = uniqid() . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $uniqueFilename;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            $errors[] = "Failed to save {$filename}";
            continue;
        }

        $thumbnailPath = $thumbnailDir . 'thumb_' . $uniqueFilename;
        if (!createThumbnail($filePath, $thumbnailPath, 300, 300)) {
            $errors[] = "Failed to create thumbnail for {$filename}";
        }

        $imageInfo = getimagesize($filePath);
        $width = $imageInfo[0] ?? 0;
        $height = $imageInfo[1] ?? 0;

        $category = $_POST['images'][$index]['category'] ?? 'other';
        $description = $_POST['images'][$index]['description'] ?? '';
        $isProfilePicture = ($_POST['images'][$index]['is_profile_picture'] ?? '0') === '1';

        if ($isProfilePicture) {
            $stmt = $pdo->prepare("UPDATE artist_images SET is_profile_picture = 0 WHERE artist_id = ?");
            $stmt->execute([$artistId]);
        }

        $stmt = $pdo->prepare("
            INSERT INTO artist_images 
            (artist_id, filename, filepath, thumbnail_filepath, alt_text, description, category, is_profile_picture, width, height, uploaded_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $altText = $description ?: "Artist image - {$category}";
        $relativeFilePath = 'artist-images/' . $uniqueFilename;
        $relativeThumbnailPath = 'artist-images/thumbnails/thumb_' . $uniqueFilename;

        $stmt->execute([
            $artistId,
            $filename,
            $relativeFilePath,
            $relativeThumbnailPath,
            $altText,
            $description,
            $category,
            $isProfilePicture ? 1 : 0,
            $width,
            $height
        ]);

        $uploadedCount++;
    }

    if ($uploadedCount > 0) {
        echo json_encode([
            'success' => true,
            'uploaded_count' => $uploadedCount,
            'message' => "Successfully uploaded {$uploadedCount} images",
            'errors' => $errors
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No images were uploaded',
            'errors' => $errors
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function createThumbnail($sourcePath, $thumbnailPath, $maxWidth, $maxHeight) {
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) return false;

    $sourceWidth = $imageInfo[0];
    $sourceHeight = $imageInfo[1];
    $mimeType = $imageInfo['mime'];

    $ratio = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight);
    $thumbWidth = round($sourceWidth * $ratio);
    $thumbHeight = round($sourceHeight * $ratio);

    switch ($mimeType) {
        case 'image/jpeg':
            $sourceImage = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $sourceImage = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $sourceImage = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            $sourceImage = imagecreatefromwebp($sourcePath);
            break;
        default:
            return false;
    }

    if (!$sourceImage) return false;

    $thumbnail = imagecreatetruecolor($thumbWidth, $thumbHeight);
    
    if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
        imagealphablending($thumbnail, false);
        imagesavealpha($thumbnail, true);
        $transparent = imagecolorallocatealpha($thumbnail, 255, 255, 255, 127);
        imagefill($thumbnail, 0, 0, $transparent);
    }

    imagecopyresampled(
        $thumbnail, $sourceImage,
        0, 0, 0, 0,
        $thumbWidth, $thumbHeight,
        $sourceWidth, $sourceHeight
    );

    $result = false;
    switch ($mimeType) {
        case 'image/jpeg':
            $result = imagejpeg($thumbnail, $thumbnailPath, 85);
            break;
        case 'image/png':
            $result = imagepng($thumbnail, $thumbnailPath, 8);
            break;
        case 'image/gif':
            $result = imagegif($thumbnail, $thumbnailPath);
            break;
        case 'image/webp':
            $result = imagewebp($thumbnail, $thumbnailPath, 85);
            break;
    }

    imagedestroy($sourceImage);
    imagedestroy($thumbnail);

    return $result;
}
?>