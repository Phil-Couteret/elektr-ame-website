<?php
/**
 * Debug script for Set Password functionality
 * Access directly in browser to see detailed error messages
 */

session_start();

header('Content-Type: text/plain');

echo "=== SET PASSWORD DEBUG ===\n\n";

// Step 1: Check session
echo "Step 1: Check Admin Session\n";
echo "Admin logged in: " . (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] ? 'YES' : 'NO') . "\n";
if (isset($_SESSION['admin_email'])) {
    echo "Admin email: " . $_SESSION['admin_email'] . "\n";
}
echo "\n";

// Step 2: Check database connection
echo "Step 2: Check Database Connection\n";
try {
    require_once __DIR__ . '/config.php';
    echo "✓ config.php loaded\n";
    echo "✓ PDO connection exists: " . (isset($pdo) ? 'YES' : 'NO') . "\n";
} catch (Exception $e) {
    echo "✗ Error loading config: " . $e->getMessage() . "\n";
    exit;
}
echo "\n";

// Step 3: Check if password_hash column exists
echo "Step 3: Check if password_hash column exists\n";
try {
    $stmt = $pdo->query("DESCRIBE members");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns in members table:\n";
    foreach ($columns as $col) {
        echo "  - $col\n";
    }
    
    if (in_array('password_hash', $columns)) {
        echo "✓ password_hash column EXISTS\n";
    } else {
        echo "✗ password_hash column MISSING!\n";
        echo "\nYou need to run this SQL:\n";
        echo "ALTER TABLE members ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;\n";
    }
} catch (Exception $e) {
    echo "✗ Error checking columns: " . $e->getMessage() . "\n";
}
echo "\n";

// Step 4: Check for members
echo "Step 4: Check Members\n";
try {
    $stmt = $pdo->query("SELECT id, email, first_name, last_name, password_hash FROM members LIMIT 5");
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Found " . count($members) . " members:\n";
    foreach ($members as $member) {
        $hasPassword = !empty($member['password_hash']) ? 'HAS PASSWORD' : 'NO PASSWORD';
        echo "  - ID: {$member['id']}, {$member['first_name']} {$member['last_name']} ({$member['email']}) - $hasPassword\n";
    }
} catch (Exception $e) {
    echo "✗ Error fetching members: " . $e->getMessage() . "\n";
}
echo "\n";

// Step 5: Test password generation
echo "Step 5: Test Password Generation\n";
try {
    $testPassword = bin2hex(random_bytes(4));
    echo "✓ Generated test password: $testPassword\n";
    
    $testHash = password_hash($testPassword, PASSWORD_DEFAULT);
    echo "✓ Hash created successfully\n";
    echo "✓ Verify works: " . (password_verify($testPassword, $testHash) ? 'YES' : 'NO') . "\n";
} catch (Exception $e) {
    echo "✗ Error generating password: " . $e->getMessage() . "\n";
}
echo "\n";

echo "=== DEBUG COMPLETE ===\n";
?>

