<?php
/**
 * Comprehensive Diagnostic Tool
 * Upload this to /home/elektry/www/ and visit it
 * It will show exactly what's wrong
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Comprehensive Diagnostic</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        .success { border-color: #28a745; }
        .error { border-color: #dc3545; }
        .warning { border-color: #ffc107; }
        pre { background: #f8f9fa; padding: 10px; overflow-x: auto; }
        h2 { margin-top: 0; }
        .fix { background: #fff3cd; padding: 10px; margin: 10px 0; border: 1px solid #ffc107; }
    </style>
</head>
<body>
    <h1>🔍 Comprehensive Diagnostic</h1>
    
    <?php
    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown';
    $scriptPath = __FILE__;
    $requestUri = $_SERVER['REQUEST_URI'] ?? 'Unknown';
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? 'Unknown';
    ?>
    
    <div class="section success">
        <h2>✅ PHP is Working!</h2>
        <p>If you can see this page, PHP is functioning correctly.</p>
    </div>
    
    <div class="section">
        <h2>1. Server Information</h2>
        <pre>
Document Root: <?php echo htmlspecialchars($docRoot); ?>

Script Path: <?php echo htmlspecialchars($scriptPath); ?>

Request URI: <?php echo htmlspecialchars($requestUri); ?>

Script Name: <?php echo htmlspecialchars($scriptName); ?>

PHP Version: <?php echo phpversion(); ?>
        </pre>
    </div>
    
    <div class="section">
        <h2>2. Critical Files Check</h2>
        <?php
        $files = [
            'index.html' => $docRoot . '/index.html',
            '.htaccess' => $docRoot . '/.htaccess',
            'api folder' => $docRoot . '/api',
            'assets folder' => $docRoot . '/assets',
        ];
        
        foreach ($files as $name => $path) {
            $exists = file_exists($path);
            $readable = $exists ? is_readable($path) : false;
            $isDir = $exists ? is_dir($path) : false;
            
            echo '<p>';
            echo $exists ? '✅' : '❌';
            echo ' <strong>' . htmlspecialchars($name) . ':</strong> ';
            echo htmlspecialchars($path);
            if ($exists) {
                echo ' - EXISTS';
                if ($isDir) {
                    echo ' (Directory)';
                    $contents = scandir($path);
                    $fileCount = count(array_filter($contents, function($f) { return $f !== '.' && $f !== '..'; }));
                    echo ' - ' . $fileCount . ' items';
                } else {
                    echo ' (File)';
                    echo ' - ' . filesize($path) . ' bytes';
                }
            } else {
                echo ' - NOT FOUND';
            }
            echo '</p>';
        }
        ?>
    </div>
    
    <div class="section">
        <h2>3. API Directory Contents</h2>
        <?php
        $apiPath = $docRoot . '/api';
        if (is_dir($apiPath)) {
            $apiFiles = scandir($apiPath);
            $phpFiles = array_filter($apiFiles, function($f) {
                return pathinfo($f, PATHINFO_EXTENSION) === 'php';
            });
            echo '<p><strong>PHP files in api/:</strong> ' . count($phpFiles) . '</p>';
            echo '<p><strong>Sample files:</strong></p>';
            echo '<pre>';
            foreach (array_slice($phpFiles, 0, 10) as $file) {
                echo htmlspecialchars($file) . "\n";
            }
            echo '</pre>';
            
            // Check for config.php
            $configExists = file_exists($apiPath . '/config.php');
            echo '<p>';
            echo $configExists ? '✅' : '❌';
            echo ' <strong>config.php:</strong> ';
            echo $configExists ? 'EXISTS' : 'MISSING - MUST CREATE THIS!';
            echo '</p>';
        } else {
            echo '<p class="error">❌ API directory does not exist!</p>';
        }
        ?>
    </div>
    
    <div class="section">
        <h2>4. File Permissions</h2>
        <?php
        $checkFiles = [
            'index.html' => $docRoot . '/index.html',
            '.htaccess' => $docRoot . '/.htaccess',
            'api' => $docRoot . '/api',
        ];
        
        foreach ($checkFiles as $name => $path) {
            if (file_exists($path)) {
                $perms = fileperms($path);
                $permsOct = substr(sprintf('%o', $perms), -4);
                $readable = is_readable($path);
                $writable = is_writable($path);
                
                echo '<p><strong>' . htmlspecialchars($name) . ':</strong> ';
                echo 'Permissions: ' . $permsOct . ' ';
                echo $readable ? '✅ Readable' : '❌ Not Readable';
                echo ' ';
                echo $writable ? '✅ Writable' : '❌ Not Writable';
                echo '</p>';
            }
        }
        ?>
    </div>
    
    <div class="section">
        <h2>5. .htaccess Content Check</h2>
        <?php
        $htaccessPath = $docRoot . '/.htaccess';
        if (file_exists($htaccessPath)) {
            $htaccessContent = file_get_contents($htaccessPath);
            $hasApiRule = strpos($htaccessContent, '/api/') !== false;
            $hasRewriteEngine = strpos($htaccessContent, 'RewriteEngine') !== false;
            
            echo '<p><strong>File exists:</strong> ✅</p>';
            echo '<p><strong>Has API rule:</strong> ' . ($hasApiRule ? '✅ YES' : '❌ NO') . '</p>';
            echo '<p><strong>Has RewriteEngine:</strong> ' . ($hasRewriteEngine ? '✅ YES' : '❌ NO') . '</p>';
            
            if (!$hasApiRule) {
                echo '<div class="fix">';
                echo '<strong>⚠️ FIX NEEDED:</strong> .htaccess is missing the API passthrough rule!';
                echo '</div>';
            }
        } else {
            echo '<p class="error">❌ .htaccess does not exist!</p>';
        }
        ?>
    </div>
    
    <div class="section">
        <h2>6. Directory Structure</h2>
        <pre>
<?php
if (is_dir($docRoot)) {
    $items = scandir($docRoot);
    $items = array_filter($items, function($item) {
        return $item !== '.' && $item !== '..';
    });
    foreach ($items as $item) {
        $path = $docRoot . '/' . $item;
        $type = is_dir($path) ? '[DIR]' : '[FILE]';
        $size = is_file($path) ? ' (' . filesize($path) . ' bytes)' : '';
        echo $type . ' ' . htmlspecialchars($item) . $size . "\n";
    }
}
?>
        </pre>
    </div>
    
    <div class="section">
        <h2>7. Recommendations</h2>
        <ul>
            <?php
            if (!file_exists($docRoot . '/index.html')) {
                echo '<li class="error">❌ <strong>Upload index.html</strong> to: ' . htmlspecialchars($docRoot) . '/</li>';
            }
            if (!is_dir($docRoot . '/api')) {
                echo '<li class="error">❌ <strong>Upload api/ folder</strong> to: ' . htmlspecialchars($docRoot) . '/</li>';
            }
            if (!file_exists($docRoot . '/api/config.php')) {
                echo '<li class="error">❌ <strong>Create config.php</strong> in: ' . htmlspecialchars($docRoot) . '/api/</li>';
            }
            if (!file_exists($docRoot . '/.htaccess')) {
                echo '<li class="error">❌ <strong>Upload .htaccess</strong> to: ' . htmlspecialchars($docRoot) . '/</li>';
            }
            ?>
            <li>✅ <strong>Document root is:</strong> <?php echo htmlspecialchars($docRoot); ?></li>
            <li>✅ <strong>Files should be in:</strong> <?php echo htmlspecialchars($docRoot); ?>/</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>8. Test Links</h2>
        <p>Try these after fixing issues:</p>
        <ul>
            <li><a href="/index.html" target="_blank">/index.html</a></li>
            <li><a href="/api/test-api-access.php" target="_blank">/api/test-api-access.php</a></li>
            <li><a href="/simple-test.html" target="_blank">/simple-test.html</a></li>
        </ul>
    </div>
</body>
</html>

