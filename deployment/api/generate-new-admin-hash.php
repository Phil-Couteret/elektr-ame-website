<?php
/**
 * Temporary Password Hash Generator
 * Use this to generate a hash for your new admin password
 * DELETE THIS FILE after use for security!
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Generate Admin Password Hash</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
        h1 { color: #00d9ff; }
        input, button { width: 100%; padding: 12px; margin: 10px 0; font-size: 16px; }
        input { background: #0f0f1e; border: 1px solid #00d9ff; color: #fff; border-radius: 5px; }
        button { background: #00d9ff; color: #1a1a2e; border: none; cursor: pointer; font-weight: bold; border-radius: 5px; }
        button:hover { background: #00b8d4; }
        .result { background: #0f0f1e; padding: 15px; border-radius: 5px; border: 1px solid #00d9ff; margin-top: 20px; word-break: break-all; }
        .warning { background: #ff4444; color: white; padding: 10px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>🔐 Admin Password Hash Generator</h1>
    
    <form method="POST">
        <label for="password">Enter New Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your new admin password" required>
        <button type="submit">Generate Hash</button>
    </form>
    
    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['password'])) {
        $password = $_POST['password'];
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        echo '<div class="result">';
        echo '<h3>✅ Password Hash Generated</h3>';
        echo '<p><strong>Password:</strong> ' . htmlspecialchars($password) . '</p>';
        echo '<p><strong>Hash:</strong></p>';
        echo '<code style="font-size: 12px; display: block; padding: 10px; background: #000; border-radius: 3px;">' . htmlspecialchars($hash) . '</code>';
        echo '</div>';
        
        echo '<div class="result">';
        echo '<h3>📋 SQL to Run in phpMyAdmin:</h3>';
        echo '<code style="font-size: 12px; display: block; padding: 10px; background: #000; border-radius: 3px;">';
        echo "UPDATE admin_users SET password_hash = '" . htmlspecialchars($hash) . "' WHERE email = 'your-email@example.com';";
        echo '</code>';
        echo '<p style="font-size: 12px; color: #ffaa00;">⚠️ Replace <code>your-email@example.com</code> with your actual admin email</p>';
        echo '</div>';
        
        echo '<div class="warning">';
        echo '<strong>🚨 IMPORTANT: DELETE THIS FILE AFTER USE!</strong><br>';
        echo 'This file should not remain on your server for security reasons.';
        echo '</div>';
    }
    ?>
    
    <div style="margin-top: 30px; padding: 15px; background: #0f0f1e; border-radius: 5px;">
        <h3>📝 Instructions:</h3>
        <ol>
            <li>Enter your new password above</li>
            <li>Click "Generate Hash"</li>
            <li>Copy the SQL query shown</li>
            <li>Run it in phpMyAdmin</li>
            <li>🚨 DELETE this file from your server!</li>
        </ol>
    </div>
</body>
</html>

