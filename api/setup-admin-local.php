<?php
/**
 * Local Admin Setup Script
 * Run this in your browser: http://localhost:8000/api/setup-admin-local.php
 * DELETE THIS FILE after setup!
 */

// Include database config
require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Local Admin Setup</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:50px auto;padding:20px;background:#1a1a1a;color:#fff;}";
echo "h1{color:#4CAF50;}h2{color:#2196F3;}p{margin:10px 0;}";
echo ".success{color:#4CAF50;}.error{color:#f44336;}.info{color:#2196F3;background:#333;padding:15px;border-radius:5px;margin:20px 0;}";
echo "a{color:#2196F3;text-decoration:none;}a:hover{text-decoration:underline;}";
echo "code{background:#000;padding:2px 6px;border-radius:3px;color:#4CAF50;}</style></head><body>";

echo "<h1>🔧 Local Admin Setup</h1>";

try {
    // Test database connection
    $pdo->query("SELECT 1");
    echo "<p class='success'>✅ Database connection: SUCCESS</p>";
    
    // Check/create admin_users table
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() == 0) {
        echo "<p class='info'>Creating admin_users table...</p>";
        
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role ENUM('superadmin', 'admin') DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_by INT NULL,
                INDEX idx_email (email),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        echo "<p class='success'>✅ admin_users table created</p>";
    } else {
        echo "<p class='success'>✅ admin_users table exists</p>";
    }
    
    // Create/update admin user
    $email = 'admin@elektr-ame.com';
    $password = 'admin123'; // Default local dev password
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user) {
        // Update password
        $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ?, is_active = 1 WHERE email = ?");
        $stmt->execute([$hash, $email]);
        echo "<p class='success'>✅ Admin user password updated</p>";
    } else {
        // Create user
        $stmt = $pdo->prepare("INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$email, $hash, 'Local Admin', 'superadmin', 1]);
        echo "<p class='success'>✅ Admin user created</p>";
    }
    
    echo "<div class='info'>";
    echo "<h2>📋 Local Admin Credentials</h2>";
    echo "<p><strong>🌐 Admin URL:</strong> <a href='http://localhost:8080/admin' target='_blank'>http://localhost:8080/admin</a></p>";
    echo "<p><strong>📧 Email:</strong> <code>$email</code></p>";
    echo "<p><strong>🔑 Password:</strong> <code>$password</code></p>";
    echo "<p><strong>⚠️ LOCAL DEVELOPMENT ONLY!</strong></p>";
    echo "</div>";
    
    echo "<hr>";
    echo "<h2>✅ Setup Complete!</h2>";
    echo "<p><a href='http://localhost:8080/admin' style='background:#4CAF50;color:white;padding:10px 20px;border-radius:5px;display:inline-block;margin-top:20px;'>Go to Admin Panel</a></p>";
    
    echo "<p class='error'><strong>⚠️ SECURITY:</strong> Delete this file (setup-admin-local.php) after use!</p>";
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ Database Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Make sure:</p>";
    echo "<ul>";
    echo "<li>MySQL is running: <code>brew services start mysql</code></li>";
    echo "<li>Database exists: <code>mysql -u root -p -e 'CREATE DATABASE elektr_ame;'</code></li>";
    echo "<li>config.php has correct credentials</li>";
    echo "</ul>";
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "</body></html>";
?>


