<?php
/**
 * Create Admin User API
 * Only accessible by superadmin
 */

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Check if user is superadmin
if ($_SESSION['admin_role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied. Superadmin only.']);
    exit();
}

// Database configuration
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = '92Alcolea2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['email']) || empty($input['password']) || empty($input['name'])) {
        throw new Exception('Email, password, and name are required');
    }
    
    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $name = trim($input['name']);
    $role = $input['role'] ?? 'admin';
    $passwordInput = $input['password'];
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Restrict to @elektr-ame.com domain
    $emailDomain = substr(strrchr($email, "@"), 1);
    if (strtolower($emailDomain) !== 'elektr-ame.com') {
        throw new Exception('Only @elektr-ame.com email addresses are allowed');
    }
    
    // Validate role
    if (!in_array($role, ['admin', 'superadmin'])) {
        throw new Exception('Invalid role');
    }
    
    // Check if email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM admin_users WHERE email = :email");
    $checkStmt->execute([':email' => $email]);
    if ($checkStmt->fetch()) {
        throw new Exception('Email already exists');
    }
    
    // Hash password
    $passwordHash = password_hash($passwordInput, PASSWORD_DEFAULT);
    
    // Insert new admin user
    $stmt = $pdo->prepare("
        INSERT INTO admin_users (email, password_hash, name, role, created_by)
        VALUES (:email, :password_hash, :name, :role, :created_by)
    ");
    
    $stmt->execute([
        ':email' => $email,
        ':password_hash' => $passwordHash,
        ':name' => $name,
        ':role' => $role,
        ':created_by' => $_SESSION['admin_id']
    ]);
    
    $newUserId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin user created successfully',
        'user_id' => $newUserId
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in admin-users-create: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

