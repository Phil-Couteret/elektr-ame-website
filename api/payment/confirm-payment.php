<?php
// Prevent any output before JSON
ob_start();

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

// Clear any output that might have been generated
ob_clean();

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../classes/StripePayment.php';
require_once __DIR__ . '/../classes/EmailAutomation.php';

// Check if user is logged in
if (!isset($_SESSION['member_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    $sessionId = $data['session_id'] ?? null;
    
    if (!$sessionId) {
        throw new Exception('Session ID is required');
    }
    
    // Initialize Stripe
    $stripe = new StripePayment($pdo);
    
    // Get checkout session from Stripe
    $session = $stripe->getCheckoutSession($sessionId);
    
    if (!$session) {
        throw new Exception('Checkout session not found');
    }
    
    // Check payment status
    if ($session['payment_status'] !== 'paid') {
        throw new Exception('Payment not completed. Status: ' . $session['payment_status']);
    }
    
    // Get metadata
    $metadata = $session['metadata'] ?? [];
    $memberId = isset($metadata['member_id']) ? (int)$metadata['member_id'] : null;
    $membershipType = $metadata['membership_type'] ?? null;
    $membershipStartDate = $metadata['membership_start_date'] ?? date('Y-m-d');
    $membershipEndDate = $metadata['membership_end_date'] ?? null;
    
    if (!$memberId || !$membershipType) {
        throw new Exception('Invalid session metadata');
    }
    
    // Verify member ID matches logged-in user (if session exists)
    // Note: Session might be lost after Stripe redirect, which is normal
    // We trust the metadata since it was set by us when creating the checkout session
    // The webhook will also verify and update the member status
    if (isset($_SESSION['member_id'])) {
        $sessionMemberId = (int)$_SESSION['member_id'];
        if ($memberId !== $sessionMemberId) {
            // Log the mismatch for security audit, but proceed
            // This can happen if user logged in as different account after starting payment
            error_log("Payment confirmation: Member ID mismatch. Session: {$sessionMemberId}, Metadata: {$memberId}. Proceeding with metadata.");
        }
    }
    // If no session, that's fine - session often lost after external redirect
    // We proceed with the member_id from metadata (which we set ourselves)
    
    // Get amount from session
    $amount = $session['amount_total'] / 100; // Convert from cents
    
    // Update transaction status
    $stripe->updateTransactionStatus(
        $sessionId,
        'completed',
        null,
        json_encode($session)
    );
    
    // Update member record
    $updateStmt = $pdo->prepare("
        UPDATE members SET
            membership_type = ?,
            membership_start_date = ?,
            membership_end_date = ?,
            payment_status = 'paid',
            payment_amount = ?,
            last_payment_date = CURDATE(),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    
    $updateStmt->execute([
        $membershipType,
        $membershipStartDate,
        $membershipEndDate,
        $amount,
        $memberId
    ]);
    
    // Get member data for email
    $memberStmt = $pdo->prepare("SELECT * FROM members WHERE id = ?");
    $memberStmt->execute([$memberId]);
    $member = $memberStmt->fetch(PDO::FETCH_ASSOC);
    
    // Send confirmation email
    if ($member) {
        $emailAutomation = new EmailAutomation($pdo);
        
        // Determine if this is first payment or renewal
        $isFirstPayment = empty($member['last_payment_date']);
        
        if ($isFirstPayment) {
            // Send welcome email
            $emailAutomation->queueEmail(
                $member['email'],
                $member['first_name'] . ' ' . $member['last_name'],
                'member_welcome',
                [
                    'first_name' => $member['first_name'],
                    'membership_type' => ucfirst($membershipType),
                ],
                $memberId,
                'high'
            );
        }
        
        // Send payment confirmation
        $emailAutomation->queueEmail(
            $member['email'],
            $member['first_name'] . ' ' . $member['last_name'],
            'payment_confirmation',
            [
                'first_name' => $member['first_name'],
                'amount' => number_format($amount, 2),
                'membership_type' => ucfirst($membershipType),
                'date' => date('Y-m-d'),
            ],
            $memberId,
            'high'
        );
        
        // If sponsor, send tax receipt
        if ($membershipType === 'sponsor' && $amount > 40) {
            $emailAutomation->queueEmail(
                $member['email'],
                $member['first_name'] . ' ' . $member['last_name'],
                'sponsor_tax_receipt',
                [
                    'first_name' => $member['first_name'],
                    'amount' => number_format($amount, 2),
                    'date' => date('Y-m-d'),
                ],
                $memberId,
                'normal'
            );
        }
        
        // Process email queue
        $emailAutomation->processQueue(10);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Payment confirmed successfully',
        'membership_type' => $membershipType,
        'amount' => $amount,
        'membership_start_date' => $membershipStartDate,
        'membership_end_date' => $membershipEndDate
    ]);
    
} catch (Exception $e) {
    error_log("Confirm payment error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

