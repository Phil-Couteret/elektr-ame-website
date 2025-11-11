<?php
// Simple PHP test - no database, just PHP execution
header('Content-Type: text/plain');
echo "PHP is working!\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
phpinfo();
?>

