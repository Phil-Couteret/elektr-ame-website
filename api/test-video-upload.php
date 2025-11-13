<?php
/**
 * Test Video Upload Endpoint
 * This helps diagnose video upload issues
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $info = [
        'php_version' => PHP_VERSION,
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'max_file_uploads' => ini_get('max_file_uploads'),
        'file_uploads_enabled' => ini_get('file_uploads'),
        'upload_dir_writable' => is_writable(getUploadDirectory('gallery-images/')),
        'upload_dir_path' => getUploadDirectory('gallery-images/'),
        'ffmpeg_available' => !empty(trim(shell_exec('which ffmpeg 2>/dev/null'))),
        'ffprobe_available' => !empty(trim(shell_exec('which ffprobe 2>/dev/null'))),
        'database_connected' => false,
        'gallery_images_table_exists' => false,
        'media_type_column_exists' => false,
        'video_duration_column_exists' => false
    ];
    
    // Test database connection
    try {
        $testStmt = $pdo->query("SELECT 1");
        $info['database_connected'] = true;
        
        // Check if table exists
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'gallery_images'");
        $info['gallery_images_table_exists'] = $tableCheck->rowCount() > 0;
        
        if ($info['gallery_images_table_exists']) {
            // Check columns
            $columns = $pdo->query("SHOW COLUMNS FROM gallery_images LIKE 'media_type'");
            $info['media_type_column_exists'] = $columns->rowCount() > 0;
            
            $columns = $pdo->query("SHOW COLUMNS FROM gallery_images LIKE 'video_duration'");
            $info['video_duration_column_exists'] = $columns->rowCount() > 0;
            
            // Get recent uploads
            $recent = $pdo->query("SELECT id, filename, media_type, filepath FROM gallery_images ORDER BY uploaded_at DESC LIMIT 5");
            $info['recent_uploads'] = $recent->fetchAll(PDO::FETCH_ASSOC);
        }
    } catch (PDOException $e) {
        $info['database_error'] = $e->getMessage();
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

