<?php
/**
 * OVH Server Diagnosis
 * Upload this file to the ROOT of your website (same location as index.html)
 * Then visit: https://www.elektr-ame.com/diagnose-ovh.php
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>OVH Server Diagnosis</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        .success { border-color: #28a745; }
        .error { border-color: #dc3545; }
        .warning { border-color: #ffc107; }
        pre { background: #f8f9fa; padding: 10px; overflow-x: auto; }
        h2 { margin-top: 0; }
    </style>
</head>
<body>
    <h1>🔍 OVH Server Diagnosis</h1>
    
    <?php
    $results = [];
    
    // 1. Document Root
    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown';
    $results['document_root'] = $docRoot;
    
    // 2. Current Script Location
    $scriptPath = __FILE__;
    $results['script_path'] = $scriptPath;
    
    // 3. Check if /api/ directory exists
    $apiPath = $docRoot . '/api';
    $apiExists = is_dir($apiPath);
    $results['api_directory_exists'] = $apiExists;
    $results['api_directory_path'] = $apiPath;
    
    // 4. List files in /api/ if it exists
    $apiFiles = [];
    if ($apiExists) {
        $files = scandir($apiPath);
        $apiFiles = array_filter($files, function($f) {
            return $f !== '.' && $f !== '..' && pathinfo($f, PATHINFO_EXTENSION) === 'php';
        });
        $results['api_files_count'] = count($apiFiles);
        $results['api_files'] = array_slice($apiFiles, 0, 20); // First 20
    }
    
    // 5. Check if test-api-access.php exists
    $testFile = $apiPath . '/test-api-access.php';
    $testFileExists = file_exists($testFile);
    $results['test_file_exists'] = $testFileExists;
    $results['test_file_path'] = $testFile;
    
    // 6. Check .htaccess
    $htaccessPath = $docRoot . '/.htaccess';
    $htaccessExists = file_exists($htaccessPath);
    $results['htaccess_exists'] = $htaccessExists;
    $results['htaccess_path'] = $htaccessPath;
    
    // 7. Check .htaccess content
    $htaccessContent = '';
    if ($htaccessExists) {
        $htaccessContent = file_get_contents($htaccessPath);
        $hasApiRule = strpos($htaccessContent, '/api/') !== false;
        $results['htaccess_has_api_rule'] = $hasApiRule;
    }
    
    // 8. Server Info
    $results['php_version'] = phpversion();
    $results['server_software'] = $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown';
    $results['request_uri'] = $_SERVER['REQUEST_URI'] ?? 'Unknown';
    $results['script_name'] = $_SERVER['SCRIPT_NAME'] ?? 'Unknown';
    
    // 9. Check if mod_rewrite is available
    $results['mod_rewrite_available'] = function_exists('apache_get_modules') 
        ? in_array('mod_rewrite', apache_get_modules()) 
        : 'Cannot determine';
    ?>
    
    <div class="section <?php echo $apiExists ? 'success' : 'error'; ?>">
        <h2>1. API Directory</h2>
        <p><strong>Path:</strong> <?php echo htmlspecialchars($apiPath); ?></p>
        <p><strong>Exists:</strong> <?php echo $apiExists ? '✅ YES' : '❌ NO'; ?></p>
        <?php if ($apiExists): ?>
            <p><strong>PHP Files Found:</strong> <?php echo count($apiFiles); ?></p>
            <?php if (count($apiFiles) > 0): ?>
                <p><strong>Sample Files:</strong></p>
                <pre><?php echo implode("\n", array_slice($apiFiles, 0, 10)); ?></pre>
            <?php endif; ?>
        <?php else: ?>
            <p class="error">⚠️ API directory does not exist! Files need to be uploaded.</p>
        <?php endif; ?>
    </div>
    
    <div class="section <?php echo $testFileExists ? 'success' : 'error'; ?>">
        <h2>2. Test File</h2>
        <p><strong>Path:</strong> <?php echo htmlspecialchars($testFile); ?></p>
        <p><strong>Exists:</strong> <?php echo $testFileExists ? '✅ YES' : '❌ NO'; ?></p>
        <?php if (!$testFileExists): ?>
            <p class="error">⚠️ test-api-access.php not found! Upload it to: <?php echo htmlspecialchars($apiPath); ?>/</p>
        <?php endif; ?>
    </div>
    
    <div class="section <?php echo $htaccessExists ? 'success' : 'warning'; ?>">
        <h2>3. .htaccess File</h2>
        <p><strong>Path:</strong> <?php echo htmlspecialchars($htaccessPath); ?></p>
        <p><strong>Exists:</strong> <?php echo $htaccessExists ? '✅ YES' : '❌ NO'; ?></p>
        <?php if ($htaccessExists): ?>
            <p><strong>Has API Rule:</strong> <?php echo $results['htaccess_has_api_rule'] ? '✅ YES' : '❌ NO'; ?></p>
            <?php if (!$results['htaccess_has_api_rule']): ?>
                <p class="error">⚠️ .htaccess does not contain API passthrough rule!</p>
            <?php endif; ?>
        <?php else: ?>
            <p class="warning">⚠️ .htaccess not found! This might be needed for API routing.</p>
        <?php endif; ?>
    </div>
    
    <div class="section">
        <h2>4. Server Information</h2>
        <pre><?php print_r([
            'Document Root' => $docRoot,
            'Script Path' => $scriptPath,
            'PHP Version' => phpversion(),
            'Server Software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'Request URI' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
        ]); ?></pre>
    </div>
    
    <div class="section">
        <h2>5. Recommendations</h2>
        <ul>
            <?php if (!$apiExists): ?>
                <li class="error">❌ <strong>Create API directory:</strong> <?php echo htmlspecialchars($apiPath); ?></li>
            <?php endif; ?>
            <?php if ($apiExists && !$testFileExists): ?>
                <li class="error">❌ <strong>Upload test-api-access.php</strong> to <?php echo htmlspecialchars($apiPath); ?>/</li>
            <?php endif; ?>
            <?php if (!$htaccessExists): ?>
                <li class="warning">⚠️ <strong>Upload .htaccess</strong> to <?php echo htmlspecialchars($docRoot); ?>/</li>
            <?php endif; ?>
            <?php if ($htaccessExists && !$results['htaccess_has_api_rule']): ?>
                <li class="error">❌ <strong>Update .htaccess</strong> to include API passthrough rule</li>
            <?php endif; ?>
            <?php if ($apiExists && $testFileExists && $htaccessExists && $results['htaccess_has_api_rule']): ?>
                <li class="success">✅ Everything looks good! Try: <a href="/api/test-api-access.php">/api/test-api-access.php</a></li>
            <?php endif; ?>
        </ul>
    </div>
    
    <div class="section">
        <h2>6. Full Results (JSON)</h2>
        <pre><?php echo json_encode($results, JSON_PRETTY_PRINT); ?></pre>
    </div>
</body>
</html>

