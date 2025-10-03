<?php
session_start();

header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Credentials: true');

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Database configuration
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = '92Alcolea2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get all members
    $stmt = $pdo->query("
        SELECT 
            id,
            first_name,
            last_name,
            second_name,
            email,
            phone,
            street,
            zip_code,
            city,
            country,
            status,
            created_at
        FROM members
        ORDER BY created_at DESC
    ");
    
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="elektr-ame-members-' . date('Y-m-d') . '.csv"');
    
    // Create output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for UTF-8 (helps Excel recognize UTF-8)
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Add CSV headers
    fputcsv($output, [
        'ID',
        'First Name',
        'Last Name',
        'Second Name',
        'Email',
        'Phone',
        'Street',
        'Zip Code',
        'City',
        'Country',
        'Status',
        'Registration Date'
    ]);
    
    // Add member data
    foreach ($members as $member) {
        fputcsv($output, [
            $member['id'],
            $member['first_name'],
            $member['last_name'],
            $member['second_name'],
            $member['email'],
            $member['phone'],
            $member['street'],
            $member['zip_code'],
            $member['city'],
            $member['country'],
            $member['status'],
            $member['created_at']
        ]);
    }
    
    fclose($output);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Database error: ' . $e->getMessage();
}
?>

