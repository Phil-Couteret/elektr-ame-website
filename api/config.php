<?php
// Database configuration for Elektr-Âme
// Update these settings according to your environment

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
        'cors_origins' => ['http://localhost:8080', 'http://localhost:5173'], // Add your frontend URLs
        'rate_limit' => [
            'enabled' => true,
            'max_requests' => 10,
            'time_window' => 300 // 5 minutes
        ]
    ],
    'security' => [
        'encrypt_sensitive_data' => false, // Set to true in production
        'hash_passwords' => false, // Not needed for this simple form
        'validate_input' => true
    ]
];
?>





