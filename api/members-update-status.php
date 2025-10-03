<?php
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

// Check if user is authenticated
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
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
    
    if (!isset($input['member_id']) || !isset($input['status'])) {
        throw new Exception('Missing required fields');
    }
    
    $memberId = $input['member_id'];
    $status = $input['status'];
    
    // Validate status
    $validStatuses = ['pending', 'approved', 'rejected'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception('Invalid status value');
    }
    
    // Update member status
    $stmt = $pdo->prepare("
        UPDATE members 
        SET status = :status, updated_at = NOW() 
        WHERE id = :id
    ");
    
    $stmt->execute([
        ':status' => $status,
        ':id' => $memberId
    ]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Member not found');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Member status updated successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

