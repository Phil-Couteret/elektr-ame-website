<?php
/**
 * Check Authentication Status API
 * Verifies if the user is currently logged in
 */

// Start session
session_start();

header('Content-Type: application/json');
// Allow both production and local development
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://www.elektr-ame.com', 'http://localhost:8080', 'http://127.0.0.1:8080'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Check if user is logged in
    $isAuthenticated = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    
    if ($isAuthenticated) {
        // Optional: Check session timeout (e.g., 24 hours)
        $sessionTimeout = 24 * 60 * 60; // 24 hours in seconds
        $loginTime = $_SESSION['login_time'] ?? 0;
        
        if ((time() - $loginTime) > $sessionTimeout) {
            // Session expired
            session_destroy();
            echo json_encode([
                'authenticated' => false,
                'message' => 'Session expired'
            ]);
            exit();
        }
        
        // Return authenticated user info
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'email' => $_SESSION['admin_email'] ?? null,
                'name' => $_SESSION['admin_name'] ?? null,
                'role' => $_SESSION['admin_role'] ?? 'admin'
            ]
        ]);
    } else {
        echo json_encode([
            'authenticated' => false
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'authenticated' => false,
        'message' => 'Error checking authentication'
    ]);
}
?>

