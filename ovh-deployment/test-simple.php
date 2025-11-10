<?php
echo "PHP WORKS!";
echo "<br>Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown');
echo "<br>Script Path: " . __FILE__;
phpinfo();
?>

