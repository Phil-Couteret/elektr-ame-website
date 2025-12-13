<?php
header('Content-Type: application/json');

$videoPath = 'public/artist-images/69163602ecbfe_1763063298.mp4';
$fullPath = __DIR__ . '/../' . $videoPath;

$info = [
    'video_path' => $videoPath,
    'full_path' => $fullPath,
    'file_exists' => file_exists($fullPath),
    'file_size' => file_exists($fullPath) ? filesize($fullPath) : 0,
    'is_readable' => file_exists($fullPath) && is_readable($fullPath),
    'mime_type' => file_exists($fullPath) ? mime_content_type($fullPath) : null,
    'web_url' => '/' . $videoPath,
    'permissions' => file_exists($fullPath) ? substr(sprintf('%o', fileperms($fullPath)), -4) : null
];

// Check if we can read the file
if (file_exists($fullPath)) {
    $handle = fopen($fullPath, 'rb');
    if ($handle) {
        $header = fread($handle, 12);
        fclose($handle);
        $info['file_header'] = bin2hex($header);
        $info['is_valid_mp4'] = (substr($header, 4, 4) === 'ftyp'); // MP4 signature
    }
}

echo json_encode($info, JSON_PRETTY_PRINT);
?>

