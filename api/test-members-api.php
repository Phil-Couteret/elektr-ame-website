<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Credentials: true');

$response = [
    'test' => 'Members API test',
    'session_exists' => isset($_SESSION['user_id']),
    'session_user_id' => $_SESSION['user_id'] ?? null,
    'php_version' => phpversion()
];

echo json_encode($response);
?>

