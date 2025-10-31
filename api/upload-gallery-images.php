<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Include database configuration
require_once 'config.php';

// Create upload directory if it doesn't exist
$uploadDir = '../public/gallery-images/';
$thumbnailDir = '../public/gallery-images/thumbnails/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!file_exists($thumbnailDir)) {
    mkdir($thumbnailDir, 0755, true);
}

try {
    $uploadedCount = 0;
    $errors = [];

    // Process each uploaded image
    foreach ($_FILES['images']['name'] as $index => $filename) {
        if (empty($filename)) continue;

        $file = [
            'name' => $_FILES['images']['name'][$index],
            'type' => $_FILES['images']['type'][$index],
            'tmp_name' => $_FILES['images']['tmp_name'][$index],
            'error' => $_FILES['images']['error'][$index],
            'size' => $_FILES['images']['size'][$index]
        ];

        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = "Error uploading {$filename}";
            continue;
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            $errors[] = "Invalid file type for {$filename}";
            continue;
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            $errors[] = "File too large for {$filename}";
            continue;
        }

        // Generate unique filename
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $uniqueFilename = uniqid() . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $uniqueFilename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            $errors[] = "Failed to save {$filename}";
            continue;
        }

        // Create thumbnail
        $thumbnailPath = $thumbnailDir . 'thumb_' . $uniqueFilename;
        if (!createThumbnail($filePath, $thumbnailPath, 300, 300)) {
            $errors[] = "Failed to create thumbnail for {$filename}";
        }

        // Get image metadata
        $imageInfo = getimagesize($filePath);
        $width = $imageInfo[0] ?? 0;
        $height = $imageInfo[1] ?? 0;

        // Get form data
        $category = $_POST['images'][$index]['category'] ?? 'other';
        $description = $_POST['images'][$index]['description'] ?? '';

        // Insert into database
        $stmt = $pdo->prepare("
            INSERT INTO gallery_images 
            (filename, filepath, thumbnail_filepath, alt_text, description, category, width, height, file_size, uploaded_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $altText = $description ?: "Gallery image - {$category}";
        $relativeFilePath = 'gallery-images/' . $uniqueFilename;
        $relativeThumbnailPath = 'gallery-images/thumbnails/thumb_' . $uniqueFilename;

        $stmt->execute([
            $filename,
            $relativeFilePath,
            $relativeThumbnailPath,
            $altText,
            $description,
            $category,
            $width,
            $height,
            $file['size']
        ]);

        $uploadedCount++;
    }

    // Return response
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

/**
 * Create a thumbnail image
 */
function createThumbnail($sourcePath, $thumbnailPath, $maxWidth, $maxHeight) {
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) return false;

    $sourceWidth = $imageInfo[0];
    $sourceHeight = $imageInfo[1];
    $mimeType = $imageInfo['mime'];

    // Calculate thumbnail dimensions
    $ratio = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight);
    $thumbWidth = round($sourceWidth * $ratio);
    $thumbHeight = round($sourceHeight * $ratio);

    // Create source image resource
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

    // Create thumbnail
    $thumbnail = imagecreatetruecolor($thumbWidth, $thumbHeight);
    
    // Preserve transparency for PNG and GIF
    if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
        imagealphablending($thumbnail, false);
        imagesavealpha($thumbnail, true);
        $transparent = imagecolorallocatealpha($thumbnail, 255, 255, 255, 127);
        imagefill($thumbnail, 0, 0, $transparent);
    }

    // Resize image
    imagecopyresampled(
        $thumbnail, $sourceImage,
        0, 0, 0, 0,
        $thumbWidth, $thumbHeight,
        $sourceWidth, $sourceHeight
    );

    // Save thumbnail
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

    // Clean up
    imagedestroy($sourceImage);
    imagedestroy($thumbnail);

    return $result;
}
?>
