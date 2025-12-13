<?php
/**
 * Check Authentication Status API
 * Verifies if the user is currently logged in
 */

// Prevent any output before headers - MUST be first
ob_start();

// Use config helper for environment-aware CORS
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();

// Start session - after output buffering to prevent any session output
session_start();

header('Content-Type: application/json');
// Prevent caching of API responses
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

// Clear any output buffer before JSON output
ob_end_clean();

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
    
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error in auth-check: " . $e->getMessage());
    echo json_encode([
        'authenticated' => false,
        'message' => 'Error checking authentication',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error in auth-check: " . $e->getMessage());
    echo json_encode([
        'authenticated' => false,
        'message' => 'Error checking authentication'
    ]);
}
?>

