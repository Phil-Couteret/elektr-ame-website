<?php
/**
 * Stripe Webhook Handler
 * Processes webhook events from Stripe
 * 
 * IMPORTANT: This endpoint should be publicly accessible (no session check)
 * Security is handled via webhook signature verification
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../classes/StripePayment.php';
require_once __DIR__ . '/../classes/EmailAutomation.php';

header('Content-Type: application/json');

// Get raw POST data
$payload = @file_get_contents('php://input');
$signature = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (empty($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty payload']);
    exit;
}

try {
    // Initialize Stripe
    $stripe = new StripePayment($pdo);
    
    // Verify webhook signature
    try {
        $stripe->verifyWebhookSignature($payload, $signature);
    } catch (Exception $e) {
        error_log("Webhook signature verification failed: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['error' => 'Invalid signature']);
        exit;
    }
    
    // Parse event
    $event = json_decode($payload, true);
    
    if (!$event || !isset($event['type'])) {
        throw new Exception('Invalid event data');
    }
    
    $eventType = $event['type'];
    $eventId = $event['id'];
    
    // Check if event already processed
    $checkStmt = $pdo->prepare("
        SELECT id, processed FROM payment_webhooks 
        WHERE event_id = ?
    ");
    $checkStmt->execute([$eventId]);
    $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing && $existing['processed']) {
        // Event already processed, return success
        http_response_code(200);
        echo json_encode(['received' => true, 'message' => 'Event already processed']);
        exit;
    }
    
    // Store webhook event
    if (!$existing) {
        $storeStmt = $pdo->prepare("
            INSERT INTO payment_webhooks (gateway, event_type, event_id, payload)
            VALUES ('stripe', ?, ?, ?)
        ");
        $storeStmt->execute([$eventType, $eventId, $payload]);
    }
    
    // Process event
    $processed = false;
    $errorMessage = null;
    
    try {
        switch ($eventType) {
            case 'checkout.session.completed':
                $processed = handleCheckoutCompleted($pdo, $stripe, $event['data']['object']);
                break;
                
            case 'payment_intent.succeeded':
                $processed = handlePaymentIntentSucceeded($pdo, $stripe, $event['data']['object']);
                break;
                
            case 'payment_intent.payment_failed':
                $processed = handlePaymentIntentFailed($pdo, $stripe, $event['data']['object']);
                break;
                
            case 'charge.refunded':
                $processed = handleChargeRefunded($pdo, $stripe, $event['data']['object']);
                break;
                
            default:
                // Unknown event type, log but don't error
                error_log("Unhandled webhook event type: " . $eventType);
                $processed = true; // Mark as processed to avoid reprocessing
        }
    } catch (Exception $e) {
        $errorMessage = $e->getMessage();
        error_log("Webhook processing error: " . $errorMessage);
    }
    
    // Update webhook record
    $updateStmt = $pdo->prepare("
        UPDATE payment_webhooks 
        SET processed = ?, 
            processed_at = CURRENT_TIMESTAMP,
            error_message = ?
        WHERE event_id = ?
    ");
    $updateStmt->execute([$processed ? 1 : 0, $errorMessage, $eventId]);
    
    if ($processed) {
        http_response_code(200);
        echo json_encode(['received' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Processing failed', 'message' => $errorMessage]);
    }
    
} catch (Exception $e) {
    error_log("Webhook error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

/**
 * Handle checkout.session.completed event
 */
function handleCheckoutCompleted($pdo, $stripe, $session) {
    $sessionId = $session['id'];
    $metadata = $session['metadata'] ?? [];
    $memberId = isset($metadata['member_id']) ? (int)$metadata['member_id'] : null;
    
    if (!$memberId) {
        throw new Exception('Member ID not found in session metadata');
    }
    
    // Update transaction status
    $stripe->updateTransactionStatus(
        $sessionId,
        'completed',
        null,
        json_encode($session)
    );
    
    // Update member
    $membershipType = $metadata['membership_type'] ?? null;
    $membershipStartDate = $metadata['membership_start_date'] ?? date('Y-m-d');
    $membershipEndDate = $metadata['membership_end_date'] ?? null;
    $amount = $session['amount_total'] / 100;
    
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
    
    return true;
}

/**
 * Handle payment_intent.succeeded event
 */
function handlePaymentIntentSucceeded($pdo, $stripe, $paymentIntent) {
    $paymentIntentId = $paymentIntent['id'];
    $metadata = $paymentIntent['metadata'] ?? [];
    $memberId = isset($metadata['member_id']) ? (int)$metadata['member_id'] : null;
    
    if ($memberId) {
        // Update transaction if exists
        $stripe->updateTransactionStatus(
            $paymentIntentId,
            'completed',
            null,
            json_encode($paymentIntent)
        );
    }
    
    return true;
}

/**
 * Handle payment_intent.payment_failed event
 */
function handlePaymentIntentFailed($pdo, $stripe, $paymentIntent) {
    $paymentIntentId = $paymentIntent['id'];
    $errorMessage = $paymentIntent['last_payment_error']['message'] ?? 'Payment failed';
    
    $stripe->updateTransactionStatus(
        $paymentIntentId,
        'failed',
        $errorMessage,
        json_encode($paymentIntent)
    );
    
    return true;
}

/**
 * Handle charge.refunded event
 */
function handleChargeRefunded($pdo, $stripe, $charge) {
    $paymentIntentId = $charge['payment_intent'] ?? null;
    
    if ($paymentIntentId) {
        $stripe->updateTransactionStatus(
            $paymentIntentId,
            'refunded',
            'Charge refunded',
            json_encode($charge)
        );
    }
    
    return true;
}

