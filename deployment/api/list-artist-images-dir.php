<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../public/artist-images/';

$result = [
    'upload_dir' => $uploadDir,
    'dir_exists' => is_dir($uploadDir),
    'dir_writable' => is_writable($uploadDir),
    'files' => []
];

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        
        $fullPath = $uploadDir . $file;
        if (is_file($fullPath)) {
            $result['files'][] = [
                'filename' => $file,
                'size' => filesize($fullPath),
                'type' => is_dir($fullPath) ? 'directory' : 'file',
                'extension' => pathinfo($file, PATHINFO_EXTENSION),
                'is_video' => in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['mp4', 'webm', 'mov', 'avi', 'ogg'])
            ];
        }
    }
}

$result['file_count'] = count($result['files']);
$result['video_count'] = count(array_filter($result['files'], fn($f) => $f['is_video']));

echo json_encode($result, JSON_PRETTY_PRINT);
?>

