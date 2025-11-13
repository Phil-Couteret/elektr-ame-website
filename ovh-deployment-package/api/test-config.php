<?php
/**
 * Test Database Configuration
 * This helps you find the right MySQL password
 */

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Test Database Config</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#1a1a1a;color:#fff;}";
echo ".success{color:#4CAF50;}.error{color:#f44336;}.info{color:#2196F3;background:#333;padding:15px;border-radius:5px;margin:20px 0;}";
echo "input{padding:8px;width:200px;margin:5px;}button{background:#4CAF50;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;}</style></head><body>";

echo "<h1>🔧 Test Database Connection</h1>";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $host = $_POST['host'] ?? 'localhost';
    $dbname = $_POST['dbname'] ?? 'elektr_ame';
    $username = $_POST['username'] ?? 'root';
    $password = $_POST['password'];
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        echo "<div class='success'>";
        echo "<h2>✅ Connection Successful!</h2>";
        echo "<p>Your credentials work! Update api/config.php with:</p>";
        echo "<pre style='background:#000;padding:10px;border-radius:5px;'>";
        echo "\$host = '$host';\n";
        echo "\$dbname = '$dbname';\n";
        echo "\$username = '$username';\n";
        echo "\$password = '$password';";
        echo "</pre>";
        echo "</div>";
        
        // Test if admin_users table exists
        $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
        if ($stmt->rowCount() > 0) {
            echo "<p class='success'>✅ admin_users table exists</p>";
        } else {
            echo "<p class='info'>⚠️ admin_users table doesn't exist yet. Run setup-admin-local.php after fixing config.php</p>";
        }
        
    } catch (PDOException $e) {
        echo "<div class='error'>";
        echo "<h2>❌ Connection Failed</h2>";
        echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<p>Try a different password or check your MySQL credentials.</p>";
        echo "</div>";
    }
} else {
    echo "<div class='info'>";
    echo "<p>Enter your MySQL credentials to test the connection:</p>";
    echo "</div>";
    
    echo "<form method='POST'>";
    echo "<p><label>Host:<br><input type='text' name='host' value='localhost' required></label></p>";
    echo "<p><label>Database:<br><input type='text' name='dbname' value='elektr_ame' required></label></p>";
    echo "<p><label>Username:<br><input type='text' name='username' value='root' required></label></p>";
    echo "<p><label>Password:<br><input type='password' name='password' placeholder='Enter MySQL password' required></label></p>";
    echo "<p><button type='submit'>Test Connection</button></p>";
    echo "</form>";
    
    echo "<hr>";
    echo "<p class='info'>";
    echo "<strong>Common MySQL setups:</strong><br>";
    echo "• If you installed via Homebrew: Usually no password (empty)<br>";
    echo "• If you set a password during mysql_secure_installation: Use that password<br>";
    echo "• If you forgot: Reset it or check your MySQL setup";
    echo "</p>";
}

echo "</body></html>";
?>


