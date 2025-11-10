<?php
/**
 * Quick Admin Setup Fix Script
 * Run this ONCE to set up admin access
 * DELETE THIS FILE after use for security!
 */

// Include database config
require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Admin Setup Fix</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:50px auto;padding:20px;background:#1a1a1a;color:#fff;}";
echo "h1{color:#4CAF50;}h2{color:#2196F3;}p{margin:10px 0;}";
echo ".success{color:#4CAF50;}.error{color:#f44336;}.info{color:#2196F3;}";
echo "a{color:#2196F3;text-decoration:none;}a:hover{text-decoration:underline;}";
echo "code{background:#333;padding:2px 6px;border-radius:3px;}</style></head><body>";

echo "<h1>🔧 Admin Setup Diagnostic & Fix</h1>";

$errors = [];
$warnings = [];
$success = [];

try {
    // Test 1: Check if config.php exists and works
    if (!file_exists(__DIR__ . '/config.php')) {
        $errors[] = "config.php file not found! Create it from config-template.php";
    } else {
        $success[] = "config.php file exists";
        
        // Test 2: Database connection
        try {
            $testQuery = $pdo->query("SELECT 1");
            $success[] = "✅ Database connection: SUCCESS";
            
            // Get database info
            $dbInfo = $pdo->query("SELECT DATABASE() as db_name, VERSION() as version")->fetch();
            echo "<div class='info'><p>📊 Database: <code>" . htmlspecialchars($dbInfo['db_name']) . "</code></p>";
            echo "<p>📊 MySQL Version: <code>" . htmlspecialchars($dbInfo['version']) . "</code></p></div>";
            
        } catch (PDOException $e) {
            $errors[] = "❌ Database connection FAILED: " . htmlspecialchars($e->getMessage());
            echo "<p class='error'>Check your database credentials in config.php</p>";
        }
    }
    
    // Test 3: Check if admin_users table exists
    if (isset($pdo)) {
        try {
            $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
            if ($stmt->rowCount() == 0) {
                $warnings[] = "admin_users table doesn't exist";
                
                echo "<h2>Creating admin_users table...</h2>";
                
                // Create table
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
                
                $success[] = "✅ admin_users table created successfully";
            } else {
                $success[] = "✅ admin_users table exists";
            }
        } catch (PDOException $e) {
            $errors[] = "Error checking/creating admin_users table: " . htmlspecialchars($e->getMessage());
        }
    }
    
    // Test 4: Check if admin user exists
    if (isset($pdo)) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = ?");
            $stmt->execute(['tech@elektr-ame.com']);
            $user = $stmt->fetch();
            
            if (!$user) {
                $warnings[] = "Admin user 'tech@elektr-ame.com' doesn't exist";
                
                echo "<h2>Creating admin user...</h2>";
                
                // Default password (CHANGE THIS!)
                $password = '92Alcolea2025';
                $hash = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert admin user
                $stmt = $pdo->prepare("
                    INSERT INTO admin_users (email, password_hash, name, role) 
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([
                    'tech@elektr-ame.com',
                    $hash,
                    'Super Admin',
                    'superadmin'
                ]);
                
                $success[] = "✅ Admin user created";
                echo "<div class='success'>";
                echo "<p><strong>📧 Email:</strong> tech@elektr-ame.com</p>";
                echo "<p><strong>🔑 Password:</strong> $password</p>";
                echo "<p><strong>⚠️ IMPORTANT:</strong> Change this password after first login!</p>";
                echo "</div>";
            } else {
                $success[] = "✅ Admin user exists";
                echo "<div class='info'>";
                echo "<h2>Existing Admin User:</h2>";
                echo "<p><strong>📧 Email:</strong> " . htmlspecialchars($user['email']) . "</p>";
                echo "<p><strong>👤 Name:</strong> " . htmlspecialchars($user['name']) . "</p>";
                echo "<p><strong>🔐 Role:</strong> " . htmlspecialchars($user['role']) . "</p>";
                echo "<p><strong>✅ Active:</strong> " . ($user['is_active'] ? 'Yes' : 'No') . "</p>";
                if ($user['last_login']) {
                    echo "<p><strong>🕐 Last Login:</strong> " . htmlspecialchars($user['last_login']) . "</p>";
                }
                echo "</div>";
                
                // Check if user is active
                if (!$user['is_active']) {
                    $warnings[] = "Admin user is inactive";
                    echo "<h2>Activating admin user...</h2>";
                    $stmt = $pdo->prepare("UPDATE admin_users SET is_active = 1 WHERE email = ?");
                    $stmt->execute(['tech@elektr-ame.com']);
                    $success[] = "✅ Admin user activated";
                }
            }
        } catch (PDOException $e) {
            $errors[] = "Error checking/creating admin user: " . htmlspecialchars($e->getMessage());
        }
    }
    
    // Summary
    echo "<hr>";
    echo "<h2>📋 Summary</h2>";
    
    if (count($success) > 0) {
        echo "<div class='success'><h3>✅ Success:</h3><ul>";
        foreach ($success as $msg) {
            echo "<li>$msg</li>";
        }
        echo "</ul></div>";
    }
    
    if (count($warnings) > 0) {
        echo "<div class='info'><h3>⚠️ Warnings (Fixed):</h3><ul>";
        foreach ($warnings as $msg) {
            echo "<li>$msg</li>";
        }
        echo "</ul></div>";
    }
    
    if (count($errors) > 0) {
        echo "<div class='error'><h3>❌ Errors:</h3><ul>";
        foreach ($errors as $msg) {
            echo "<li>$msg</li>";
        }
        echo "</ul></div>";
    }
    
    if (count($errors) == 0) {
        echo "<div class='success'>";
        echo "<h2>✅ Setup Complete!</h2>";
        echo "<p><a href='/admin' style='background:#4CAF50;color:white;padding:10px 20px;border-radius:5px;display:inline-block;'>Go to Admin Panel</a></p>";
        echo "</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Fatal Error</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Check your config.php file and database credentials.</p>";
    echo "</div>";
}

echo "<hr>";
echo "<p class='info'><strong>⚠️ SECURITY:</strong> Delete this file (fix-admin-setup.php) after use!</p>";
echo "</body></html>";
?>


