<?php
/**
 * Update Admin User API
 * Only accessible by superadmin
 */

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
$host = 'localhost';
$dbname = 'elektr_ame';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['id'])) {
        throw new Exception('User ID is required');
    }
    
    $userId = (int)$input['id'];
    
    // Build update query dynamically based on provided fields
    $updates = [];
    $params = [':id' => $userId];
    
    if (isset($input['name']) && !empty($input['name'])) {
        $updates[] = "name = :name";
        $params[':name'] = trim($input['name']);
    }
    
    if (isset($input['is_active'])) {
        $updates[] = "is_active = :is_active";
        $params[':is_active'] = $input['is_active'] ? 1 : 0;
    }
    
    if (isset($input['role']) && in_array($input['role'], ['admin', 'superadmin'])) {
        $updates[] = "role = :role";
        $params[':role'] = $input['role'];
    }
    
    if (isset($input['password']) && !empty($input['password'])) {
        $updates[] = "password_hash = :password_hash";
        $params[':password_hash'] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    
    if (empty($updates)) {
        throw new Exception('No fields to update');
    }
    
    $sql = "UPDATE admin_users SET " . implode(', ', $updates) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin user updated successfully'
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in admin-users-update: " . $e->getMessage());
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

