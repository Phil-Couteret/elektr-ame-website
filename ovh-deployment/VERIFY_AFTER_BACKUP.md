# ✅ Verify Files After Backup Restore

## Files to Check After Restoring October 2025 Backup

### 1. .ovhconfig
**Location:** `/home/elektry/www/.ovhconfig`

**Should contain:**
```
app.engine=php
app.engine.version=8.4
app.engine.rewrite=1
```

**If missing or wrong:** Copy from `ovh-deployment/.ovhconfig` or create manually.

### 2. config.php
**Location:** `/home/elektry/www/api/config.php`

**Should contain:**
```php
<?php
$host = "elektry2025.mysql.db";
$dbname = "elektry2025";
$username = "elektry2025";
$password = "92Alcolea2025";
// ... rest of file
```

**❌ WRONG if it has:**
```php
$host = "127.0.0.1";  // This is for local development only!
```

**Fix:** Use `ovh-deployment/api-config-production.php`

### 3. .htaccess
**Location:** `/home/elektry/www/.htaccess`

**Should have:**
- HTTPS redirect
- API passthrough rule
- React Router rewrite
- PHP handlers

**Fix:** Use `ovh-deployment/.htaccess-production`

### 4. Test Files
Upload these to test:
- `ovh-deployment/test-php-simple.php` → Test PHP execution
- `ovh-deployment/api/test-db-connection.php` → Test database

## Quick Fix Commands

If you have SSH access:

```bash
# Fix .ovhconfig
cd /home/elektry/www
cat > .ovhconfig << 'EOF'
app.engine=php
app.engine.version=8.4
app.engine.rewrite=1
EOF

# Fix config.php (if needed)
# Copy from ovh-deployment/api-config-production.php
```

## After PHP Upgrade

1. **Test PHP:** `https://www.elektr-ame.com/test-php-simple.php`
   - Should show PHP 8.4 (not 5.4)

2. **Test Database:** `https://www.elektr-ame.com/api/test-db-connection.php`
   - Should return JSON (not 501 error)

3. **Test Homepage:** `https://www.elektr-ame.com/`
   - Should load React app

## Most Important

**UPGRADE PHP FROM 5.4 TO 8.4 IN OVH CONTROL PANEL!**

This is the root cause of all PHP issues.

