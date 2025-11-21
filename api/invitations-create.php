<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once __DIR__ . '/config.php';

try {
    // Check if member is logged in
    if (!isset($_SESSION['member_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated. Please log in.'
        ]);
        exit;
    }

    $inviterId = $_SESSION['member_id'];

    // Verify member is approved and has paid
    $stmt = $pdo->prepare("SELECT status, payment_status FROM members WHERE id = ?");
    $stmt->execute([$inviterId]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$member) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Member not found'
        ]);
        exit;
    }

    if ($member['status'] !== 'approved' || $member['payment_status'] !== 'paid') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'You must be an approved member with paid membership to send invitations'
        ]);
        exit;
    }

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    if (empty($input['first_name']) || empty($input['email'])) {
        throw new Exception('First name and email are required');
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    $inviteeFirstName = trim($input['first_name']);
    $inviteeEmail = strtolower(trim($input['email']));

    // Check if invitation already exists
    $stmt = $pdo->prepare("SELECT id FROM member_invitations WHERE inviter_id = ? AND invitee_email = ?");
    $stmt->execute([$inviterId, $inviteeEmail]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'You have already sent an invitation to this email address'
        ]);
        exit;
    }

    // Check if email is already a member
    $stmt = $pdo->prepare("SELECT id FROM members WHERE email = ?");
    $stmt->execute([$inviteeEmail]);
    $existingMember = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingMember) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'This email address is already registered as a member'
        ]);
        exit;
    }

    // Create invitation
    $stmt = $pdo->prepare("
        INSERT INTO member_invitations (
            inviter_id,
            invitee_first_name,
            invitee_email,
            status,
            sent_at
        ) VALUES (?, ?, ?, 'sent', NOW())
    ");

    $stmt->execute([$inviterId, $inviteeFirstName, $inviteeEmail]);
    $invitationId = $pdo->lastInsertId();

    // Fetch the created invitation
    $stmt = $pdo->prepare("
        SELECT 
            id,
            inviter_id,
            invitee_first_name,
            invitee_email,
            status,
            sent_at,
            registered_at,
            payed_at,
            approved_at,
            created_at
        FROM member_invitations
        WHERE id = ?
    ");
    $stmt->execute([$invitationId]);
    $invitation = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Invitation sent successfully',
        'invitation' => $invitation
    ]);

} catch (PDOException $e) {
    error_log("Database error in invitations-create.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

