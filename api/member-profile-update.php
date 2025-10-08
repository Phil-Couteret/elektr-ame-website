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

    // Validate required fields
    if (empty($input['first_name']) || empty($input['second_name']) || empty($input['email'])) {
        throw new Exception('First name, second name, and email are required');
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Check if email is already taken by another member
    $stmt = $pdo->prepare("SELECT id FROM members WHERE email = ? AND id != ?");
    $stmt->execute([$input['email'], $member_id]);
    if ($stmt->fetch()) {
        throw new Exception('Email address is already in use by another member');
    }

    // Update member data
    $stmt = $pdo->prepare("
        UPDATE members 
        SET 
            first_name = ?,
            second_name = ?,
            artist_name = ?,
            email = ?,
            phone = ?,
            address = ?,
            city = ?,
            postal_code = ?,
            country = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['first_name'],
        $input['second_name'],
        $input['artist_name'] ?? null,
        $input['email'],
        $input['phone'] ?? null,
        $input['address'] ?? null,
        $input['city'] ?? null,
        $input['postal_code'] ?? null,
        $input['country'] ?? null,
        $member_id
    ]);

    // Update session email if changed
    if ($input['email'] !== $_SESSION['member_email']) {
        $_SESSION['member_email'] = $input['email'];
    }

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully'
    ]);

} catch (PDOException $e) {
    error_log("Database error in member-profile-update.php: " . $e->getMessage());
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

