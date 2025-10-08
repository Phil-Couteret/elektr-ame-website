<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    // Check if member is logged in via session
    // For now, we'll check if there's a member_id in session
    // You can implement proper member authentication later
    if (!isset($_SESSION['member_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated. Please log in or register.'
        ]);
        exit;
    }

    $member_id = $_SESSION['member_id'];

    // Fetch member data
    $stmt = $pdo->prepare("
        SELECT 
            id,
            email,
            first_name,
            second_name,
            artist_name,
            phone,
            address,
            city,
            postal_code,
            country,
            status,
            membership_type,
            membership_start_date,
            membership_end_date,
            payment_status,
            last_payment_date,
            payment_amount,
            is_dj,
            is_producer,
            is_vj,
            is_visual_artist,
            is_fan,
            notes,
            created_at,
            updated_at
        FROM members 
        WHERE id = ?
    ");

    $stmt->execute([$member_id]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$member) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Member not found'
        ]);
        exit;
    }

    // Convert boolean fields
    $member['is_dj'] = (bool)$member['is_dj'];
    $member['is_producer'] = (bool)$member['is_producer'];
    $member['is_vj'] = (bool)$member['is_vj'];
    $member['is_visual_artist'] = (bool)$member['is_visual_artist'];
    $member['is_fan'] = (bool)$member['is_fan'];

    // Don't send internal notes to member
    unset($member['notes']);

    echo json_encode([
        'success' => true,
        'member' => $member
    ]);

} catch (PDOException $e) {
    error_log("Database error in member-profile.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred'
    ]);
}
?>

