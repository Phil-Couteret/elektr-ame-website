# 🔧 Upgrade PHP from 5.4 to 8.4 on OVH

## Problem
Global PHP version is set to **5.4** (deprecated since 2015). Your code requires **PHP 8.4**.

## Solution: Upgrade PHP in OVH Control Panel

### Step 1: Change Global PHP Version

1. **OVH Control Panel** → **Web** → **General Information**
2. Look for **"PHP version"** or **"Global PHP version"**
3. **Change from 5.4 to 8.4** (or latest 8.x available)
4. **Save changes**
5. **Wait 5-10 minutes** for changes to propagate

### Step 2: Verify Multisite PHP Version

1. **OVH Control Panel** → **Web** → **Multisite**
2. **Click on `www.elektr-ame.com`**
3. Check **"PHP version"**:
   - Should inherit from global (8.4)
   - Or can be set specifically for this domain
4. **Ensure it's set to 8.4**

### Step 3: Verify .ovhconfig

The `.ovhconfig` file should have:
```
app.engine=php
app.engine.version=8.4
app.engine.rewrite=1
```

**Location:** `/home/elektry/www/.ovhconfig`

### Step 4: Test PHP

After upgrading:

1. **Upload** `ovh-deployment/test-php-simple.php` to `/home/elektry/www/`
2. **Visit:** `https://www.elektr-ame.com/test-php-simple.php`
3. **Should show:** PHP version 8.4 (not 5.4)

## ⚠️ Important After Backup Restore

Since you restored from October 2025 backup, verify:

1. **config.php** - Should use production credentials:
   ```php
   $host = "elektry2025.mysql.db";
   ```

2. **.htaccess** - Should have PHP handlers (use `ovh-deployment/.htaccess-production`)

3. **All API files** - Should be present in `/home/elektry/www/api/`

## Quick Checklist

- [ ] Global PHP version changed to 8.4
- [ ] Multisite PHP version is 8.4
- [ ] `.ovhconfig` has `app.engine.version=8.4`
- [ ] `test-php-simple.php` shows PHP 8.4
- [ ] `config.php` uses production database host
- [ ] `.htaccess` has PHP handlers

## Expected Result

After upgrading PHP:
- ✅ `test-php-simple.php` shows PHP 8.4
- ✅ `test-db-connection.php` returns JSON
- ✅ All API endpoints work
- ✅ Site functions normally

## If PHP 8.4 Not Available

If OVH doesn't offer PHP 8.4:
- Use **PHP 8.3** or **PHP 8.2** (should work fine)
- Update `.ovhconfig` to match:
  ```
  app.engine.version=8.3
  ```

## Notes

- PHP 5.4 is **10+ years old** and doesn't support modern PHP syntax
- Your code uses features from PHP 7.4+ (PDO, type hints, etc.)
- PHP 8.4 is required for best performance and security

