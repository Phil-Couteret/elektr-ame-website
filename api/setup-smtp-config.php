<?php
/**
 * One-time setup: Create smtp-config.php from template
 * Run via: php api/setup-smtp-config.php
 * Or in browser: https://www.elektr-ame.com/api/setup-smtp-config.php
 *
 * Then edit smtp-config.php with your real SMTP password.
 * Delete this file after use.
 */
$template = __DIR__ . '/smtp-config-template.php';
$target = __DIR__ . '/smtp-config.php';

if (file_exists($target)) {
    die("smtp-config.php already exists. Edit it directly with your password.\n");
}

if (!file_exists($template)) {
    die("Template not found.\n");
}

$content = file_get_contents($template);
if (file_put_contents($target, $content)) {
    echo "Created smtp-config.php. Now edit it and set your SMTP password (YOUR_MAILBOX_PASSWORD).\n";
    echo "OVH: use your mailbox password for noreply@elektr-ame.com\n";
} else {
    die("Failed to create smtp-config.php. Check permissions.\n");
}
