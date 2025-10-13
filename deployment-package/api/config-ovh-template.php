<?php
// OVH Database Configuration for Elektr-Âme
// 
// INSTRUCTIONS:
// 1. Get your database credentials from OVH Control Panel > Databases
// 2. Replace the placeholder values below with your actual credentials
// 3. Rename this file to config.php (or copy these values to api/config.php)
// 4. Commit and push to GitHub to deploy

return [
    'database' => [
        'host' => 'YOUR_MYSQL_HOST.ovh.net',     // e.g., mysql.cluster0XX.hosting.ovh.net
        'dbname' => 'YOUR_DATABASE_NAME',         // Your OVH database name
        'username' => 'YOUR_DATABASE_USERNAME',   // Your OVH database username
        'password' => 'YOUR_DATABASE_PASSWORD',   // Your OVH database password
        'charset' => 'utf8mb4',
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    ],
    'api' => [
        'cors_origins' => ['https://www.elektr-ame.com', 'https://elektr-ame.com'], 
        'rate_limit' => [
            'enabled' => true,
            'max_requests' => 10,
            'time_window' => 300 // 5 minutes
        ]
    ],
    'security' => [
        'encrypt_sensitive_data' => false,
        'hash_passwords' => false,
        'validate_input' => true
    ]
];
?>









