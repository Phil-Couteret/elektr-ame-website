<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Include database configuration
require_once __DIR__ . '/config.php';

try {
    
    // Get JSON input
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input. Raw: ' . substr($rawInput, 0, 100));
    }
    
    // Validate required fields
    $requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required. Received: " . json_encode($input));
        }
    }
    
    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format: ' . $input['email']);
    }
    
    // Validate phone format (international format)
    if (!preg_match('/^\+\d{1,3}\d{4,14}$/', $input['phone'])) {
        throw new Exception('Invalid phone format. Use international format (e.g., +1234567890). Received: ' . $input['phone']);
    }
    
    // Generate a temporary password for new member
    $tempPassword = bin2hex(random_bytes(4)); // 8 character random password
    $passwordHash = password_hash($tempPassword, PASSWORD_DEFAULT);
    
    // Generate email verification token
    $verificationToken = bin2hex(random_bytes(32)); // 64 character token
    
    // Check if registration is from an invitation
    // Check both GET (URL parameter) and POST (form data) for invitation token
    $invitationToken = null;
    if (isset($_GET['invite'])) {
        $invitationToken = $_GET['invite'];
    } elseif (isset($input['invite'])) {
        $invitationToken = $input['invite'];
    }
    
    $inviterId = null;
    
    if ($invitationToken) {
        // Find invitation by token
        $invStmt = $pdo->prepare("SELECT inviter_id, invitee_email FROM member_invitations WHERE invitation_token = ?");
        $invStmt->execute([$invitationToken]);
        $invitation = $invStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($invitation) {
            $inviterId = $invitation['inviter_id'];
            error_log("Registration from invitation: token=$invitationToken, inviter_id=$inviterId");
        }
    }
    
    // Prepare SQL statement
    $sql = "INSERT INTO members (
        first_name, 
        last_name, 
        second_name,
        artist_name,
        email,
        email_verified,
        email_verification_token,
        password_hash,
        phone, 
        street, 
        zip_code, 
        city, 
        country,
        inviter_id,
        is_dj,
        is_producer,
        is_vj,
        is_visual_artist,
        is_fan,
        created_at
    ) VALUES (
        :firstName, 
        :lastName, 
        :secondName,
        :artistName,
        :email,
        0,
        :verificationToken,
        :passwordHash,
        :phone, 
        :street, 
        :zipCode, 
        :city, 
        :country,
        :inviterId,
        :isDj,
        :isProducer,
        :isVj,
        :isVisualArtist,
        :isFan,
        NOW()
    )";
    
    $stmt = $pdo->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':firstName', $input['firstName']);
    $stmt->bindParam(':lastName', $input['lastName']);
    $secondName = $input['secondName'] ?? null;
    $stmt->bindParam(':secondName', $secondName);
    $artistName = $input['artistName'] ?? null;
    $stmt->bindParam(':artistName', $artistName);
    $stmt->bindParam(':email', $input['email']);
    $stmt->bindParam(':verificationToken', $verificationToken);
    $stmt->bindParam(':passwordHash', $passwordHash);
    $stmt->bindParam(':phone', $input['phone']);
    $street = $input['street'] ?? null;
    $stmt->bindParam(':street', $street);
    $zipCode = $input['zipCode'] ?? null;
    $stmt->bindParam(':zipCode', $zipCode);
    $stmt->bindParam(':city', $input['city']);
    $stmt->bindParam(':country', $input['country']);
    $stmt->bindParam(':inviterId', $inviterId, PDO::PARAM_INT);
    $isDj = isset($input['isDj']) && $input['isDj'] ? 1 : 0;
    $stmt->bindParam(':isDj', $isDj, PDO::PARAM_INT);
    $isProducer = isset($input['isProducer']) && $input['isProducer'] ? 1 : 0;
    $stmt->bindParam(':isProducer', $isProducer, PDO::PARAM_INT);
    $isVj = isset($input['isVj']) && $input['isVj'] ? 1 : 0;
    $stmt->bindParam(':isVj', $isVj, PDO::PARAM_INT);
    $isVisualArtist = isset($input['isVisualArtist']) && $input['isVisualArtist'] ? 1 : 0;
    $stmt->bindParam(':isVisualArtist', $isVisualArtist, PDO::PARAM_INT);
    $isFan = isset($input['isFan']) && $input['isFan'] ? 1 : 0;
    $stmt->bindParam(':isFan', $isFan, PDO::PARAM_INT);
    
    // Execute the statement
    $stmt->execute();
    
    // Get the new member ID
    $memberId = $pdo->lastInsertId();
    
    // Check if this registration is from an invitation and update invitation status
    $inviteeEmail = strtolower(trim($input['email']));
    
    // Update invitation - try by token first, then by email
    if ($invitationToken) {
        // Update by token (most reliable)
        $stmt = $pdo->prepare("
            UPDATE member_invitations 
            SET status = 'registered',
                invitee_member_id = ?,
                registered_at = NOW()
            WHERE invitation_token = ?
        ");
        $stmt->execute([$memberId, $invitationToken]);
        $rowsUpdated = $stmt->rowCount();
        error_log("Registration: Updated invitation by token: $invitationToken, member_id: $memberId, rows: $rowsUpdated");
    } else {
        // Fallback: Update by email (case-insensitive, trimmed)
        // Try to update any invitation with matching email, even if already linked
        $stmt = $pdo->prepare("
            UPDATE member_invitations 
            SET status = 'registered',
                invitee_member_id = COALESCE(invitee_member_id, ?),
                registered_at = COALESCE(registered_at, NOW())
            WHERE LOWER(TRIM(invitee_email)) = ? 
            AND status = 'sent'
        ");
        $stmt->execute([$memberId, $inviteeEmail]);
        $rowsUpdated = $stmt->rowCount();
        
        if ($rowsUpdated > 0) {
            error_log("Registration: Updated $rowsUpdated invitation(s) for email: $inviteeEmail, member_id: $memberId");
        } else {
            // If no rows updated with status='sent', try updating any invitation with this email
            $stmt = $pdo->prepare("
                UPDATE member_invitations 
                SET invitee_member_id = COALESCE(invitee_member_id, ?),
                    registered_at = COALESCE(registered_at, NOW()),
                    status = CASE 
                        WHEN status = 'sent' THEN 'registered'
                        ELSE status
                    END
                WHERE LOWER(TRIM(invitee_email)) = ?
                AND (invitee_member_id IS NULL OR invitee_member_id = 0)
            ");
            $stmt->execute([$memberId, $inviteeEmail]);
            $rowsUpdated = $stmt->rowCount();
            
            if ($rowsUpdated > 0) {
                error_log("Registration: Updated $rowsUpdated invitation(s) for email: $inviteeEmail (any status), member_id: $memberId");
            } else {
                // Debug: Check if invitation exists
                $debugStmt = $pdo->prepare("
                    SELECT id, invitee_email, invitee_member_id, status 
                    FROM member_invitations 
                    WHERE LOWER(TRIM(invitee_email)) = ?
                ");
                $debugStmt->execute([$inviteeEmail]);
                $debugInvitations = $debugStmt->fetchAll(PDO::FETCH_ASSOC);
                error_log("Registration: No invitation updated for email: $inviteeEmail. Found " . count($debugInvitations) . " invitation(s): " . json_encode($debugInvitations));
            }
        }
    }
    
    // Set session for member portal access
    $_SESSION['member_id'] = $memberId;
    $_SESSION['member_email'] = $input['email'];
    $_SESSION['member_name'] = $input['firstName'] . ' ' . $input['lastName'];
    
    // Trigger welcome email automation
    try {
        require_once __DIR__ . '/classes/EmailAutomation.php';
        $emailAutomation = new EmailAutomation($pdo);
        $emailAutomation->triggerAutomation('member_registered', $memberId);
    } catch (Exception $e) {
        error_log("Welcome email automation failed: " . $e->getMessage());
        // Don't fail the registration if email fails
    }
    
    // Send email verification
    try {
        $verificationLink = "https://www.elektr-ame.com/verify-email?token=" . $verificationToken;
        
        $subject = "Verify Your Email - Elektr-Âme";
        $message = "Hello {$input['firstName']},\n\n";
        $message .= "Thank you for registering with Elektr-Âme!\n\n";
        $message .= "Please click the link below to verify your email address:\n";
        $message .= $verificationLink . "\n\n";
        $message .= "Your temporary login password is: {$tempPassword}\n\n";
        $message .= "Once your email is verified and your membership is approved, you can log in at:\n";
        $message .= "https://www.elektr-ame.com/member-login\n\n";
        $message .= "If you didn't create an account with us, please ignore this email.\n\n";
        $message .= "Best regards,\n";
        $message .= "The Elektr-Âme Team";
        
        $headers = "From: noreply@elektr-ame.com\r\n";
        $headers .= "Reply-To: info@elektr-ame.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        mail($input['email'], $subject, $message, $headers);
        error_log("Verification email sent to: {$input['email']}");
    } catch (Exception $e) {
        error_log("Failed to send verification email: " . $e->getMessage());
        // Don't fail registration if email fails
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Member registration successful',
        'member_id' => $memberId,
        'temporary_password' => $tempPassword, // Send to frontend to display to user
        'debug' => [
            'received_data' => $input,
            'php_version' => phpversion(),
            'session_set' => true
        ]
    ]);
    
} catch (PDOException $e) {
    // Database error
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage(),
        'code' => $e->getCode(),
        'trace' => $e->getTraceAsString()
    ]);
} catch (Exception $e) {
    // Validation or other error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>


