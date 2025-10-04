<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = '92Alcolea2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all active subscribers (not unsubscribed)
    $stmt = $pdo->query("
        SELECT 
            id,
            email,
            subscribed_at,
            ip_address,
            unsubscribed_at
        FROM newsletter_subscribers
        ORDER BY subscribed_at DESC
    ");

    $subscribers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get statistics
    $statsStmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN unsubscribed_at IS NULL THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 ELSE 0 END) as unsubscribed
        FROM newsletter_subscribers
    ");
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'subscribers' => $subscribers,
        'stats' => $stats
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>

