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
    
    if (!isset($input['member_id'])) {
        throw new Exception('Member ID is required');
    }
    
    $memberId = $input['member_id'];
    $updates = [];
    $params = [':id' => $memberId];
    
    // Build dynamic UPDATE query based on provided fields
    if (isset($input['membership_type'])) {
        $validTypes = ['free_trial', 'monthly', 'yearly', 'lifetime'];
        if (!in_array($input['membership_type'], $validTypes)) {
            throw new Exception('Invalid membership type');
        }
        $updates[] = "membership_type = :membership_type";
        $params[':membership_type'] = $input['membership_type'];
    }
    
    if (isset($input['membership_start_date'])) {
        $updates[] = "membership_start_date = :membership_start_date";
        $params[':membership_start_date'] = $input['membership_start_date'];
    }
    
    if (isset($input['membership_end_date'])) {
        $updates[] = "membership_end_date = :membership_end_date";
        $params[':membership_end_date'] = $input['membership_end_date'];
    }
    
    if (isset($input['payment_status'])) {
        $validStatuses = ['unpaid', 'paid', 'overdue'];
        if (!in_array($input['payment_status'], $validStatuses)) {
            throw new Exception('Invalid payment status');
        }
        $updates[] = "payment_status = :payment_status";
        $params[':payment_status'] = $input['payment_status'];
    }
    
    if (isset($input['last_payment_date'])) {
        $updates[] = "last_payment_date = :last_payment_date";
        $params[':last_payment_date'] = $input['last_payment_date'];
    }
    
    if (isset($input['payment_amount'])) {
        $updates[] = "payment_amount = :payment_amount";
        $params[':payment_amount'] = $input['payment_amount'];
    }
    
    if (isset($input['notes'])) {
        $updates[] = "notes = :notes";
        $params[':notes'] = $input['notes'];
    }
    
    if (empty($updates)) {
        throw new Exception('No fields to update');
    }
    
    // Always update the updated_at timestamp
    $updates[] = "updated_at = NOW()";
    
    $sql = "UPDATE members SET " . implode(", ", $updates) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Member not found or no changes made');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Member updated successfully'
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

