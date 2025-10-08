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

// Database configuration
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = '92Alcolea2025';

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    
    // Prepare SQL statement
    $sql = "INSERT INTO members (
        first_name, 
        last_name, 
        second_name,
        artist_name,
        email, 
        phone, 
        street, 
        zip_code, 
        city, 
        country,
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
        :phone, 
        :street, 
        :zipCode, 
        :city, 
        :country,
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
    $stmt->bindParam(':phone', $input['phone']);
    $street = $input['street'] ?? null;
    $stmt->bindParam(':street', $street);
    $zipCode = $input['zipCode'] ?? null;
    $stmt->bindParam(':zipCode', $zipCode);
    $stmt->bindParam(':city', $input['city']);
    $stmt->bindParam(':country', $input['country']);
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
    
    // Set session for member portal access
    $_SESSION['member_id'] = $memberId;
    $_SESSION['member_email'] = $input['email'];
    $_SESSION['member_name'] = $input['firstName'] . ' ' . $input['lastName'];
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Member registration successful',
        'member_id' => $memberId,
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


