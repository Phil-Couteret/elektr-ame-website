<?php
/**
 * Database Setup Script for Elektr-Âme
 * Run this script to set up the database and tables
 * 
 * Usage: php setup-database.php
 */

require_once 'api/config.php';

$config = include 'api/config.php';
$dbConfig = $config['database'];

echo "Elektr-Âme Database Setup\n";
echo "========================\n\n";

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};charset={$dbConfig['charset']}", 
        $dbConfig['username'], 
        $dbConfig['password'],
        $dbConfig['options']
    );
    
    echo "✓ Connected to MySQL server\n";
    
    // Read and execute schema file
    $schemaFile = 'database/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }
    
    $schema = file_get_contents($schemaFile);
    
    // Split schema into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $schema)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^--/', $stmt);
        }
    );
    
    echo "✓ Schema file loaded\n";
    
    // Execute each statement
    foreach ($statements as $statement) {
        if (!empty(trim($statement))) {
            $pdo->exec($statement);
        }
    }
    
    echo "✓ Database and tables created successfully\n";
    
    // Test the connection to the new database
    $testPdo = new PDO(
        "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}", 
        $dbConfig['username'], 
        $dbConfig['password'],
        $dbConfig['options']
    );
    
    // Check if tables exist
    $tables = $testPdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "✓ Database connection test successful\n";
    echo "✓ Tables created: " . implode(', ', $tables) . "\n";
    
    // Check member count
    $memberCount = $testPdo->query("SELECT COUNT(*) FROM members")->fetchColumn();
    echo "✓ Sample data inserted: $memberCount members\n";
    
    echo "\n🎉 Database setup completed successfully!\n";
    echo "\nNext steps:\n";
    echo "1. Update the database credentials in api/config.php if needed\n";
    echo "2. Start your web server (Apache/Nginx)\n";
    echo "3. Test the API endpoint: POST to /api/join-us.php\n";
    echo "4. Start your React development server: npm run dev\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "\nPlease check your database credentials in api/config.php\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>

