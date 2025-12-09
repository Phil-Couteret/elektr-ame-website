<?php
require_once 'config.php';
require_once 'classes/SessionManager.php';

header('Content-Type: application/json');

$sessionManager = new SessionManager();
$sessionManager->startSession();

// Check if user is logged in
if (!isset($_SESSION['member_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit;
}

$memberId = $_SESSION['member_id'];

try {
    // Get payment history from members table
    // For now, we'll use existing payment fields
    // When payment gateway is integrated, this will query payment_transactions table
    $stmt = $pdo->prepare("
        SELECT 
            id,
            payment_amount,
            last_payment_date,
            payment_status,
            membership_type,
            membership_start_date,
            membership_end_date,
            created_at,
            updated_at
        FROM members
        WHERE id = ?
    ");
    
    $stmt->execute([$memberId]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$member) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Member not found'
        ]);
        exit;
    }
    
    // Build payment history array
    $paymentHistory = [];
    
    // If there's a payment record, add it to history
    if ($member['last_payment_date'] && $member['payment_amount']) {
        $paymentHistory[] = [
            'id' => $member['id'],
            'date' => $member['last_payment_date'],
            'amount' => floatval($member['payment_amount']),
            'status' => $member['payment_status'],
            'membership_type' => $member['membership_type'],
            'membership_start' => $member['membership_start_date'],
            'membership_end' => $member['membership_end_date'],
            'type' => 'membership',
            'description' => ucfirst($member['membership_type']) . ' membership payment',
            'created_at' => $member['created_at']
        ];
    }
    
    // TODO: When payment_transactions table is created, query it here:
    // SELECT * FROM payment_transactions WHERE member_id = ? ORDER BY created_at DESC
    
    echo json_encode([
        'success' => true,
        'payments' => $paymentHistory,
        'total_payments' => count($paymentHistory),
        'total_amount' => array_sum(array_column($paymentHistory, 'amount')),
        'message' => count($paymentHistory) > 0 
            ? 'Payment history retrieved successfully' 
            : 'No payment history available. Payment history will be available once online payments are enabled.'
    ]);
    
} catch (PDOException $e) {
    error_log("Payment history error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to retrieve payment history'
    ]);
}

