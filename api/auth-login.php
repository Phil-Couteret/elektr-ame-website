<?php
/**
 * Admin Login API
 * Handles secure authentication with password hashing
 */

// Start session
session_start();

header('Content-Type: application/json');
// Allow both production and local development
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://www.elektr-ame.com', 'http://localhost:8080', 'http://127.0.0.1:8080'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Include database configuration
require_once __DIR__ . '/config.php';

try {
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['email']) || empty($input['password'])) {
        throw new Exception('Email and password are required');
    }
    
    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $inputPassword = $input['password'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Restrict to @elektr-ame.com domain only
    $allowedDomain = 'elektr-ame.com';
    $emailDomain = substr(strrchr($email, "@"), 1);
    
    if (strtolower($emailDomain) !== strtolower($allowedDomain)) {
        throw new Exception('Only @elektr-ame.com email addresses are allowed');
    }
    
    // Get user from database
    $stmt = $pdo->prepare("SELECT id, email, password_hash, name, role, is_active FROM admin_users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if user exists and is active
    if (!$user) {
        // Don't reveal if user exists or not
        throw new Exception('Invalid email or password');
    }
    
    if (!$user['is_active']) {
        throw new Exception('Account is disabled');
    }
    
    // Verify password
    if (!password_verify($inputPassword, $user['password_hash'])) {
        // Log failed attempt (you could implement rate limiting here)
        throw new Exception('Invalid email or password');
    }
    
    // Update last login time
    $updateStmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id");
    $updateStmt->execute([':id' => $user['id']]);
    
    // Create session
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_email'] = $user['email'];
    $_SESSION['admin_name'] = $user['name'];
    $_SESSION['admin_role'] = $user['role'];
    $_SESSION['login_time'] = time();
    
    // Regenerate session ID for security
    session_regenerate_id(true);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in auth-login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred'
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

