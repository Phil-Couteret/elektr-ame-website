<?php
/**
 * Auto-create config.php if it doesn't exist
 * Include this at the top of API files instead of require_once 'config.php'
 * 
 * Usage: require_once __DIR__ . '/config-auto-create.php';
 * Then use $pdo as normal
 */

$configFile = __DIR__ . '/config.php';

// If config.php doesn't exist, create it
if (!file_exists($configFile)) {
    // OVH Production database credentials
    $ovhConfig = [
        'host' => 'elektry2025.mysql.db',
        'dbname' => 'elektry2025',
        'username' => 'elektry2025',
        'password' => '92Alcolea2025'
    ];
    
    // Detect environment
    $isLocal = (
        strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false ||
        strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') !== false ||
        strpos(__DIR__, '/Users/') !== false
    );
    
    // Create config.php content
    if ($isLocal) {
        // Local development
        $configContent = <<<'PHP'
<?php
$host = 'localhost';
$dbname = 'elektr_ame';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
PHP;
    } else {
        // OVH Production
        $configContent = <<<PHP
<?php
\$host = "{$ovhConfig['host']}";
\$dbname = "{$ovhConfig['dbname']}";
\$username = "{$ovhConfig['username']}";
\$password = "{$ovhConfig['password']}";

try {
    \$pdo = new PDO("mysql:host=\$host;dbname=\$dbname;charset=utf8mb4", \$username, \$password);
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    \$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    \$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException \$e) {
    error_log("Database connection failed: " . \$e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
PHP;
    }
    
    // Write config.php
    file_put_contents($configFile, $configContent);
    chmod($configFile, 0600);
}

// Now require the config file (either existing or just created)
require_once $configFile;
?>

