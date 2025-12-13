<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Include database configuration
require_once 'config.php';

try {
    // Check if member is logged in
    if (!isset($_SESSION['member_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated'
        ]);
        exit;
    }

    $member_id = $_SESSION['member_id'];

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Sanitize and validate required fields
    $firstName = trim($input['first_name'] ?? '');
    $secondName = trim($input['second_name'] ?? '');
    $emailInputRaw = trim($input['email'] ?? '');
    $emailInputNormalized = strtolower($emailInputRaw);
    if (empty($firstName) || empty($secondName) || empty($emailInputRaw)) {
        throw new Exception('First name, last name, and email are required');
    }

    if (!filter_var($emailInputRaw, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    $artistName = isset($input['artist_name']) ? trim($input['artist_name']) : null;
    $phone = isset($input['phone']) ? trim($input['phone']) : null;
    $address = isset($input['address']) ? trim($input['address']) : null;
    $city = isset($input['city']) ? trim($input['city']) : null;
    $postalCode = isset($input['postal_code']) ? trim($input['postal_code']) : null;
    $country = isset($input['country']) ? trim($input['country']) : null;

    if ($phone && !preg_match('/^\+?[0-9\s\-().]{7,20}$/', $phone)) {
        throw new Exception('Invalid phone format');
    }

    // Fetch current member data
    $memberStmt = $pdo->prepare("SELECT email, first_name FROM members WHERE id = ?");
    $memberStmt->execute([$member_id]);
    $currentMember = $memberStmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentMember) {
        throw new Exception('Member not found');
    }

    $currentEmail = $currentMember['email'];
    $currentEmailNormalized = strtolower($currentEmail);
    $emailChanged = $emailInputNormalized !== $currentEmailNormalized;

    if ($emailChanged) {
        // Ensure email is not being used by another member
        $stmt = $pdo->prepare("SELECT id FROM members WHERE LOWER(email) = ? AND id != ?");
        $stmt->execute([$emailInputNormalized, $member_id]);
        if ($stmt->fetch()) {
            throw new Exception('Email address is already in use by another member');
        }
    }

    $pdo->beginTransaction();

    // Get bio and social_links from input
    $bio = isset($input['bio']) ? trim($input['bio']) : null;
    $socialLinks = isset($input['social_links']) ? $input['social_links'] : null;
    
    // Validate social_links is JSON if provided
    if ($socialLinks !== null && !is_array($socialLinks)) {
        // Try to decode if it's a JSON string
        if (is_string($socialLinks)) {
            $decoded = json_decode($socialLinks, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $socialLinks = $decoded;
            } else {
                $socialLinks = null;
            }
        } else {
            $socialLinks = null;
        }
    }
    
    // Convert social_links array to JSON string for storage
    $socialLinksJson = $socialLinks ? json_encode($socialLinks) : null;

    // Update profile fields (excluding email for now)
    $stmt = $pdo->prepare("
        UPDATE members 
        SET 
            first_name = ?,
            second_name = ?,
            artist_name = ?,
            phone = ?,
            street = ?,
            city = ?,
            zip_code = ?,
            country = ?,
            bio = ?,
            social_links = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $firstName,
        $secondName,
        $artistName ?: null,
        $phone ?: null,
        $address ?: null,
        $city ?: null,
        $postalCode ?: null,
        $country ?: null,
        $bio ?: null,
        $socialLinksJson,
        $member_id
    ]);

    $pendingEmailChange = null;

    if ($emailChanged) {
        try {
            // Cancel any previous pending requests
            $cancelStmt = $pdo->prepare("UPDATE member_email_change_requests SET status = 'cancelled' WHERE member_id = ? AND status = 'pending'");
            $cancelStmt->execute([$member_id]);

            $token = bin2hex(random_bytes(32));
            $expiresAt = (new DateTime('+48 hours'))->format('Y-m-d H:i:s');

            $insertStmt = $pdo->prepare("
                INSERT INTO member_email_change_requests (member_id, current_email, new_email, token, expires_at)
                VALUES (?, ?, ?, ?, ?)
            ");
            $insertStmt->execute([$member_id, $currentEmail, $emailInputRaw, $token, $expiresAt]);
            
            error_log("Email change request created: member_id=$member_id, new_email=$emailInputRaw, token=" . substr($token, 0, 8) . "...");
        } catch (PDOException $e) {
            // If table doesn't exist, log error and throw exception
            error_log("Failed to create email change request: " . $e->getMessage());
            if (strpos($e->getMessage(), "doesn't exist") !== false || strpos($e->getMessage(), "Unknown table") !== false) {
                throw new Exception('Email change feature is not available. Please contact support.');
            }
            throw $e;
        }

        $verificationLink = "https://www.elektr-ame.com/verify-email?token=" . $token;

        $subject = "Confirm your new email address - Elektr-Âme";
        $message = "Hello {$firstName},\n\n";
        $message .= "We received a request to update your Elektr-Âme email address to {$emailInputRaw}.\n\n";
        $message .= "Please confirm this change by clicking the link below:\n";
        $message .= $verificationLink . "\n\n";
        $message .= "If you did not request this change, you can ignore this email and your address will remain the same.\n\n";
        $message .= "This link will expire in 48 hours.\n\n";
        $message .= "Best regards,\nThe Elektr-Âme Team";

        $headers = "From: noreply@elektr-ame.com\r\n";
        $headers .= "Reply-To: info@elektr-ame.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        if (!mail($emailInputRaw, $subject, $message, $headers)) {
            error_log("Failed to send email change confirmation to {$emailInputRaw}");
        }

        // Inform old email about the change request
        if ($currentEmail && strcasecmp($currentEmail, $emailInputRaw) !== 0) {
            $noticeSubject = "Elektr-Âme email change requested";
            $noticeMessage = "Hello {$currentMember['first_name']},\n\n";
            $noticeMessage .= "We received a request to change the email associated with your Elektr-Âme membership.\n";
            $noticeMessage .= "If you did not make this request, please contact support immediately.\n\n";
            $noticeMessage .= "Best regards,\nThe Elektr-Âme Team";
            if (!mail($currentEmail, $noticeSubject, $noticeMessage, $headers)) {
                error_log("Failed to send email change notice to {$currentEmail}");
            }
        }

        $pendingEmailChange = [
            'new_email' => $emailInputRaw,
            'expires_at' => $expiresAt
        ];
    } else {
        // Update session email if nothing changed but casing might have
        if (isset($_SESSION['member_email']) && strcasecmp($_SESSION['member_email'], $emailInputRaw) !== 0) {
            $_SESSION['member_email'] = $emailInputRaw;
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => $emailChanged 
            ? 'Profile updated. Please confirm your new email address.' 
            : 'Profile updated successfully.',
        'pending_email_change' => $pendingEmailChange
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in member-profile-update.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

