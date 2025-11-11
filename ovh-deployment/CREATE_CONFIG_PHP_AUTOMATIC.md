# ✅ Auto-Create config.php

## Problem
`config.php` is in `.gitignore` (for security), so it's not deployed via Git.

## Solution: Auto-Create Script

I've created two options:

### Option 1: Run Setup Script Once (Recommended)

**Visit this URL after Git deployment:**
```
https://www.elektr-ame.com/api/setup-config.php
```

This will:
- ✅ Create `config.php` automatically
- ✅ Use OVH production database credentials
- ✅ Test the connection
- ✅ Set secure permissions (600)

### Option 2: Auto-Create on First API Call

If you want `config.php` to be created automatically when any API is called, you can modify API files to use:

```php
require_once __DIR__ . '/config-auto-create.php';
```

Instead of:
```php
require_once __DIR__ . '/config.php';
```

But this requires updating all API files.

## Quick Fix: Manual Creation

**Via OVH File Manager or FTP:**

1. Navigate to: `/home/elektry/www/api/`
2. Create file: `config.php`
3. Paste this content:

```php
<?php
$host = "elektry2025.mysql.db";
$dbname = "elektry2025";
$username = "elektry";
$password = "92Alcolea2025";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
```

4. Set permissions: `chmod 600 config.php`

## After Creating config.php

Test any API endpoint:
```
https://www.elektr-ame.com/api/test-db-connection.php
```

Should return: `{"success":true,"message":"Database connection successful"}`

