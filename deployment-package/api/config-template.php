<?php
// Database configuration TEMPLATE for Elektr-Âme
// Copy this to config.php and update with your real credentials
// NEVER commit config.php to git!

return [
    'database' => [
        'host' => 'localhost',
        'dbname' => 'elektr_ame',
        'username' => 'root', // Change this to your database username
        'password' => '', // Change this to your database password
        'charset' => 'utf8mb4',
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    ],
    'api' => [
        'cors_origins' => ['http://localhost:8080', 'http://localhost:5173'],
        'rate_limit' => [
            'enabled' => true,
            'max_requests' => 10,
            'time_window' => 300
        ]
    ],
    'security' => [
        'encrypt_sensitive_data' => false,
        'hash_passwords' => false,
        'validate_input' => true
    ]
];
?>

