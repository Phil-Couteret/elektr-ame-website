<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

// Include database configuration
require_once __DIR__ . '/config.php';

try {
    
    // Get all members ordered by creation date (newest first)
    $stmt = $pdo->query("
        SELECT 
            id,
            first_name,
            last_name,
            second_name,
            email,
            phone,
            street,
            zip_code,
            city,
            country,
            status,
            membership_type,
            membership_start_date,
            membership_end_date,
            payment_status,
            last_payment_date,
            payment_amount,
            notes,
            created_at,
            updated_at
        FROM members
        ORDER BY created_at DESC
    ");
    
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'members' => $members,
        'total' => count($members)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>

