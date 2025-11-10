<?php
/**
 * File Location Diagnostic
 * Upload this to different locations to find the correct document root
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>File Location Diagnostic</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        .success { border-color: #28a745; }
        .error { border-color: #dc3545; }
        pre { background: #f8f9fa; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔍 File Location Diagnostic</h1>
    
    <div class="section success">
        <h2>✅ This File is Accessible!</h2>
        <p>If you can see this, PHP is working and files can be accessed.</p>
    </div>
    
    <div class="section">
        <h2>Current File Location</h2>
        <pre>
Script Path: <?php echo __FILE__; ?>

Document Root: <?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?>

Request URI: <?php echo $_SERVER['REQUEST_URI'] ?? 'Unknown'; ?>

Script Name: <?php echo $_SERVER['SCRIPT_NAME'] ?? 'Unknown'; ?>
        </pre>
    </div>
    
    <div class="section">
        <h2>Check for index.html</h2>
        <?php
        $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
        $indexPath = $docRoot . '/index.html';
        $indexExists = file_exists($indexPath);
        ?>
        <p><strong>Expected path:</strong> <?php echo htmlspecialchars($indexPath); ?></p>
        <p><strong>Exists:</strong> <?php echo $indexExists ? '✅ YES' : '❌ NO'; ?></p>
        
        <?php if (!$indexExists): ?>
            <p class="error">⚠️ index.html not found at expected location!</p>
            <p>Try checking these locations:</p>
            <ul>
                <li><?php echo htmlspecialchars($docRoot . '/index.html'); ?></li>
                <li><?php echo htmlspecialchars($docRoot . '/www/index.html'); ?></li>
                <li><?php echo htmlspecialchars($docRoot . '/public_html/index.html'); ?></li>
                <li><?php echo htmlspecialchars(dirname(__FILE__) . '/index.html'); ?></li>
            </ul>
        <?php endif; ?>
    </div>
    
    <div class="section">
        <h2>List Files in Document Root</h2>
        <?php
        if ($docRoot && is_dir($docRoot)) {
            $files = scandir($docRoot);
            $files = array_filter($files, function($f) {
                return $f !== '.' && $f !== '..';
            });
            echo '<pre>';
            foreach (array_slice($files, 0, 20) as $file) {
                $path = $docRoot . '/' . $file;
                $type = is_dir($path) ? '[DIR]' : '[FILE]';
                echo $type . ' ' . htmlspecialchars($file) . "\n";
            }
            echo '</pre>';
            echo '<p>Total: ' . count($files) . ' items</p>';
        } else {
            echo '<p class="error">Cannot read document root directory</p>';
        }
        ?>
    </div>
    
    <div class="section">
        <h2>Check for API Directory</h2>
        <?php
        $apiPath = $docRoot . '/api';
        $apiExists = is_dir($apiPath);
        ?>
        <p><strong>Expected path:</strong> <?php echo htmlspecialchars($apiPath); ?></p>
        <p><strong>Exists:</strong> <?php echo $apiExists ? '✅ YES' : '❌ NO'; ?></p>
        
        <?php if ($apiExists): ?>
            <?php
            $apiFiles = scandir($apiPath);
            $phpFiles = array_filter($apiFiles, function($f) {
                return pathinfo($f, PATHINFO_EXTENSION) === 'php';
            });
            ?>
            <p><strong>PHP files found:</strong> <?php echo count($phpFiles); ?></p>
        <?php endif; ?>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            <?php if (!$indexExists): ?>
                <li class="error">❌ <strong>Upload index.html</strong> to: <?php echo htmlspecialchars($docRoot); ?>/</li>
            <?php endif; ?>
            <?php if (!$apiExists): ?>
                <li class="error">❌ <strong>Create api/ directory</strong> at: <?php echo htmlspecialchars($apiPath); ?></li>
            <?php endif; ?>
            <li>✅ <strong>Document root is:</strong> <?php echo htmlspecialchars($docRoot); ?></li>
            <li>✅ <strong>Upload all files to:</strong> <?php echo htmlspecialchars($docRoot); ?>/</li>
        </ul>
    </div>
</body>
</html>

