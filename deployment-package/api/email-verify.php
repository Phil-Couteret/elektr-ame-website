<?php
/**
 * Email Verification API
 * Verifies email address using token from email link
 */

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once __DIR__ . '/config.php';

try {
    // Get token from GET or POST
    $token = null;
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
        $token = trim($_GET['token']);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input && isset($input['token'])) {
            $token = trim($input['token']);
        }
    }
    
    if (!$token) {
        throw new Exception('Verification token is required');
    }
    
    // Find member with this verification token
    $stmt = $pdo->prepare("
        SELECT 
            id, 
            email, 
            first_name, 
            email_verified,
            status
        FROM members 
        WHERE email_verification_token = :token
    ");
    $stmt->execute([':token' => $token]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$member) {
        throw new Exception('Invalid verification link');
    }
    
    // Check if already verified
    if ($member['email_verified'] == 1) {
        echo json_encode([
            'success' => true,
            'already_verified' => true,
            'message' => 'Email address already verified. You can log in now.'
        ]);
        exit();
    }
    
    // Verify the email
    $updateStmt = $pdo->prepare("
        UPDATE members 
        SET 
            email_verified = 1,
            email_verified_at = NOW(),
            email_verification_token = NULL
        WHERE id = :member_id
    ");
    $updateStmt->execute([':member_id' => $member['id']]);
    
    // Log the action
    error_log("Email verified for member ID: {$member['id']} ({$member['email']})");
    
    // Send welcome email
    $subject = "Welcome to Elektr-Âme!";
    $message = "Hello {$member['first_name']},\n\n";
    $message .= "Thank you for verifying your email address!\n\n";
    $message .= "Your email has been confirmed and your account is now active.\n\n";
    
    if ($member['status'] === 'pending') {
        $message .= "Your membership application is currently under review. You will receive an email once it has been approved.\n\n";
    } else {
        $message .= "You can now log in to your member portal at: https://www.elektr-ame.com/member-login\n\n";
    }
    
    $message .= "Best regards,\n";
    $message .= "The Elektr-Âme Team";
    
    $headers = "From: noreply@elektr-ame.com\r\n";
    $headers .= "Reply-To: info@elektr-ame.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    mail($member['email'], $subject, $message, $headers);
    
    // Return success
    echo json_encode([
        'success' => true,
        'already_verified' => false,
        'message' => 'Email verified successfully! You can now log in.',
        'member_status' => $member['status']
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in email-verify: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A server error occurred. Please try again later.'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

