<?php
/**
 * Password Hash Generator
 * Use this script to generate password hashes for admin users
 * 
 * Usage: Run this script once to generate the hash, then copy it to your SQL insert
 * After use, DELETE THIS FILE for security
 */

header('Content-Type: text/plain');

// Change this to your desired password
$password = '92Alcolea2025';

// Generate the hash
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password Hash Generator\n";
echo "=======================\n\n";
echo "Password: $password\n";
echo "Hash: $hash\n\n";
echo "Copy this hash and use it in your SQL INSERT statement.\n";
echo "Then DELETE this file for security!\n";
?>

