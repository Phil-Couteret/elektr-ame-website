<?php
// GoDaddy Database Configuration for Elektr-Âme
// 
// INSTRUCTIONS:
// 1. Copy this file to config.php: cp config-godaddy-template.php config.php
// 2. Get your database credentials from GoDaddy cPanel > MySQL Databases
// 3. Update the credentials below with your GoDaddy database credentials
// 4. NEVER commit config.php to git! (it's in .gitignore)
//
// GoDaddy Database Setup:
// - Log into GoDaddy cPanel
// - Go to "MySQL Databases" section
// - Create a new database (e.g., "elektr_ame_db")
// - Create a new MySQL user (e.g., "elektr_user")
// - Add the user to the database with ALL PRIVILEGES
// - Note the full hostname (usually "localhost" or "yourdomain.com")
//
// Common GoDaddy Database Host Formats:
// - localhost (most common)
// - yourdomain.com
// - mysql.yourdomain.com
// - Check your cPanel for the exact hostname

// Database configuration
$host = 'localhost';                    // ⚠️ UPDATE: Usually "localhost" on GoDaddy, check cPanel
$dbname = 'YOUR_DATABASE_NAME';         // ⚠️ UPDATE: Your GoDaddy database name (e.g., "elektr_ame_db")
$username = 'YOUR_DATABASE_USERNAME';   // ⚠️ UPDATE: Your GoDaddy MySQL username (e.g., "elektr_user")
$password = 'YOUR_DATABASE_PASSWORD';   // ⚠️ UPDATE: Your GoDaddy MySQL password

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>

