<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
header('Access-Control-Allow-Credentials: true');

$response = [
    'test' => 'Members API test',
    'admin_logged_in' => isset($_SESSION['admin_logged_in']) ? $_SESSION['admin_logged_in'] : false,
    'admin_id' => $_SESSION['admin_id'] ?? null,
    'admin_email' => $_SESSION['admin_email'] ?? null,
    'session_data' => $_SESSION,
    'php_version' => phpversion()
];

echo json_encode($response);
?>

