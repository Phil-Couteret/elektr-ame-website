# 🔧 Production Troubleshooting Guide

## Admin Portal API Errors

If you're seeing errors like:
- "Error loading events: Failed to load events"
- "Error loading artists: Failed to load artists"
- "Failed to load galleries"

### Step 1: Check API Endpoints Directly

Test these URLs directly in your browser:

1. **Events API:**
   ```
   https://www.elektr-ame.com/api/events-list.php
   ```
   Should return JSON like: `{"success":true,"events":[...]}`

2. **Artists API:**
   ```
   https://www.elektr-ame.com/api/artists-list.php
   ```
   Should return JSON like: `{"success":true,"artists":[...]}`

3. **Galleries API:**
   ```
   https://www.elektr-ame.com/api/galleries-list.php
   ```
   Should return JSON like: `{"success":true,"galleries":[...]}`

### Step 2: Check for PHP Errors

If you see a blank page or PHP errors:

1. **Check PHP error logs** on OVH
2. **Enable error display** temporarily (for debugging only):
   ```php
   // Add to top of api/events-list.php temporarily
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```

### Step 3: Verify Database Connection

Create a test file: `api/test-db.php`

```php
<?php
require_once __DIR__ . '/config.php';
try {
    $pdo->query("SELECT 1");
    echo json_encode(['success' => true, 'message' => 'Database connected']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
```

Visit: `https://www.elektr-ame.com/api/test-db.php`

**If this fails:**
- Check `api/config.php` exists
- Verify database credentials
- Check database host is accessible

### Step 4: Check File Permissions

On OVH server:
```bash
# API directory
chmod 755 www/api/
chmod 644 www/api/*.php
chmod 600 www/api/config.php

# Check if config-helper.php exists
ls -la www/api/config-helper.php
```

### Step 5: Check CORS Configuration

The API endpoints should use `config-helper.php` for CORS. Verify:

1. `api/config-helper.php` is uploaded
2. API files include it:
   ```php
   require_once __DIR__ . '/config-helper.php';
   setCorsHeaders();
   ```

### Step 6: Check Browser Console

Open browser DevTools (F12) → Console tab:
- Look for CORS errors
- Look for 404 errors (API files not found)
- Look for 500 errors (server errors)

### Step 7: Verify API Files Are Uploaded

Check these files exist on OVH:
- ✅ `www/api/events-list.php`
- ✅ `www/api/artists-list.php`
- ✅ `www/api/galleries-list.php`
- ✅ `www/api/config.php` (with correct credentials)
- ✅ `www/api/config-helper.php`

### Step 8: Test Database Tables

In phpMyAdmin, verify tables exist:
```sql
USE elektry2025;
SHOW TABLES;
```

Should show:
- ✅ `events`
- ✅ `artists`
- ✅ `galleries`
- ✅ `gallery_images`
- ✅ `artist_images`

### Common Issues and Solutions

#### Issue: "Database connection failed"
**Solution:**
- Check `api/config.php` has correct OVH credentials
- Verify database host: `elektry2025.mysql.db`
- Check database name: `elektry2025`

#### Issue: "Table doesn't exist"
**Solution:**
- Run database schema files in phpMyAdmin
- Check `database/schema.sql` was imported

#### Issue: CORS errors in browser console
**Solution:**
- Verify `config-helper.php` is uploaded
- Check API files use `setCorsHeaders()`
- Verify origin is `https://www.elektr-ame.com`

#### Issue: 404 Not Found for API endpoints
**Solution:**
- Check API files are in `www/api/` directory
- Verify `.htaccess` allows PHP execution
- Check file permissions (644 for PHP files)

#### Issue: Blank response from API
**Solution:**
- Check PHP error logs
- Verify `config.php` doesn't have syntax errors
- Test database connection separately

### Quick Test Script

Create `api/test-all.php`:

```php
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config-helper.php';
setCorsHeaders();
require_once __DIR__ . '/config.php';

$results = [];

// Test database
try {
    $pdo->query("SELECT 1");
    $results['database'] = 'OK';
} catch (Exception $e) {
    $results['database'] = 'FAIL: ' . $e->getMessage();
}

// Test tables
$tables = ['events', 'artists', 'galleries', 'artist_images', 'gallery_images'];
foreach ($tables as $table) {
    try {
        $pdo->query("SELECT 1 FROM $table LIMIT 1");
        $results["table_$table"] = 'OK';
    } catch (Exception $e) {
        $results["table_$table"] = 'FAIL: ' . $e->getMessage();
    }
}

echo json_encode($results);
?>
```

Visit: `https://www.elektr-ame.com/api/test-all.php`

This will show you exactly what's working and what's not.

---

**After fixing issues, remember to:**
1. Remove test files (`test-db.php`, `test-all.php`)
2. Remove `display_errors` if you added it
3. Test admin portal again

