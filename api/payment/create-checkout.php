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

// Check if user is logged in
if (!isset($_SESSION['member_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in to make a payment.'
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
    
    $memberId = $_SESSION['member_id'];
    $membershipType = $data['membership_type'] ?? null;
    $amount = isset($data['amount']) ? floatval($data['amount']) : null;
    
    // Validate membership type
    $validTypes = ['basic', 'sponsor', 'lifetime'];
    if (!in_array($membershipType, $validTypes)) {
        throw new Exception('Invalid membership type. Must be: basic, sponsor, or lifetime');
    }
    
    // Determine amount based on membership type if not provided
    if ($amount === null || $amount <= 0) {
        switch ($membershipType) {
            case 'basic':
                $amount = 20.00; // €20/year
                break;
            case 'sponsor':
                throw new Exception('Amount is required for sponsor/custom membership');
            default:
                throw new Exception('Invalid membership type');
        }
    }
    
    // Validate minimum amounts
    if ($amount < 20) {
        throw new Exception('Minimum amount is €20');
    }
    
    // If amount is exactly €20, it's basic membership
    if ($amount == 20.00 && $membershipType !== 'basic') {
        $membershipType = 'basic';
    }
    
    // If amount is above €20, it's sponsor membership (for tax deduction)
    if ($amount > 20.00 && $membershipType === 'basic') {
        $membershipType = 'sponsor';
    }
    
    // Initialize Stripe
    $stripe = new StripePayment($pdo);
    
    // Create checkout session
    $checkout = $stripe->createCheckoutSessionHosted(
        $memberId,
        $membershipType,
        $amount,
        'EUR'
    );
    
    echo json_encode([
        'success' => true,
        'session_id' => $checkout['session_id'],
        'checkout_url' => $checkout['url'],
        'amount' => $checkout['amount'],
        'currency' => $checkout['currency'],
        'membership_type' => $membershipType
    ]);
    
} catch (PDOException $e) {
    error_log("Create checkout PDO error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Create checkout error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

