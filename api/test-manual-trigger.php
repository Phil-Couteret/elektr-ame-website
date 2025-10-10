<?php
// Simple test to verify the concept works
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/classes/EmailAutomation.php';

try {
    $emailAutomation = new EmailAutomation($pdo);
    
    $expiringResults = $emailAutomation->checkExpiringMemberships();
    $queueResults = $emailAutomation->processQueue(10);
    
    echo json_encode([
        'success' => true,
        'message' => 'Email automation test successful',
        'expiring_memberships' => $expiringResults,
        'queue_processing' => $queueResults,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>

