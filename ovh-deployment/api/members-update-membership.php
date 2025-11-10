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
// Include database configuration
require_once __DIR__ . '/config.php';

try {
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['member_id'])) {
        throw new Exception('Member ID is required');
    }
    
    $memberId = $input['member_id'];
    $updates = [];
    $params = [':id' => $memberId];
    
    // Build dynamic UPDATE query based on provided fields
    if (isset($input['phone'])) {
        $updates[] = "phone = :phone";
        $params[':phone'] = $input['phone'];
    }
    
    if (isset($input['artist_name'])) {
        $updates[] = "artist_name = :artist_name";
        $params[':artist_name'] = $input['artist_name'];
    }
    
    if (isset($input['is_dj'])) {
        $updates[] = "is_dj = :is_dj";
        $params[':is_dj'] = $input['is_dj'] ? 1 : 0;
    }
    
    if (isset($input['is_producer'])) {
        $updates[] = "is_producer = :is_producer";
        $params[':is_producer'] = $input['is_producer'] ? 1 : 0;
    }
    
    if (isset($input['is_vj'])) {
        $updates[] = "is_vj = :is_vj";
        $params[':is_vj'] = $input['is_vj'] ? 1 : 0;
    }
    
    if (isset($input['is_visual_artist'])) {
        $updates[] = "is_visual_artist = :is_visual_artist";
        $params[':is_visual_artist'] = $input['is_visual_artist'] ? 1 : 0;
    }
    
    if (isset($input['is_fan'])) {
        $updates[] = "is_fan = :is_fan";
        $params[':is_fan'] = $input['is_fan'] ? 1 : 0;
    }
    
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
    
    // Get member data before update to detect changes
    $stmtBefore = $pdo->prepare("SELECT payment_status, membership_end_date, payment_amount FROM members WHERE id = :id");
    $stmtBefore->execute([':id' => $memberId]);
    $before = $stmtBefore->fetch(PDO::FETCH_ASSOC);
    
    $sql = "UPDATE members SET " . implode(", ", $updates) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Member not found or no changes made');
    }
    
    // Trigger email automation for renewal
    if ($before && isset($input['payment_status']) && $input['payment_status'] === 'paid' && $before['payment_status'] !== 'paid') {
        try {
            require_once __DIR__ . '/classes/EmailAutomation.php';
            $emailAutomation = new EmailAutomation($pdo);
            $emailAutomation->triggerAutomation('membership_renewed', $memberId);
            
            // If sponsor (amount > 40), also send tax receipt
            if (isset($input['payment_amount']) && $input['payment_amount'] > 40) {
                $emailAutomation->triggerAutomation('sponsor_tax_receipt', $memberId);
            }
        } catch (Exception $e) {
            error_log("Renewal email automation failed: " . $e->getMessage());
            // Don't fail the update if email fails
        }
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

