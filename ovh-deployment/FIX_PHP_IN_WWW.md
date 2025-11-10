# 🔧 Fix PHP in /www/ Directory

## Current Status
- ✅ Git disabled in Multisite
- ✅ HTML works in `/www/`
- ✅ PHP 8.4 enabled
- ❌ PHP returns 501 error

## The Issue
PHP files in `/www/` return 501 error, which means PHP isn't being processed correctly.

## Solutions

### Solution 1: Upload .htaccess with PHP Handler
1. Upload `.htaccess-with-php` from `ovh-deployment/` to `/www/`
2. Rename it to `.htaccess` (overwrite existing)
3. Test: `https://www.elektr-ame.com/test-simple.php`

### Solution 2: Check PHP File Location
Via FTP, verify:
- Is `test-simple.php` in `/www/`? (same location as `test-plain.html`)
- Are all PHP files in `/www/api/`?

### Solution 3: Check OVH PHP Configuration for Directory
OVH Control Panel → "Web" → "PHP":
- Is PHP enabled for the `/www/` directory?
- Are there any directory-specific restrictions?

### Solution 4: Create Minimal PHP Test
Create a super simple test file:

**File: `phpinfo.php`**
```php
<?php phpinfo(); ?>
```

Upload to `/www/` and test:
- `https://www.elektr-ame.com/phpinfo.php`

If this works, PHP is configured. If not, it's a server configuration issue.

### Solution 5: Check File Permissions
Via FTP, check permissions in `/www/`:
- PHP files should be: `644`
- Directories should be: `755`

## Most Likely Fix

Upload `.htaccess-with-php` as `.htaccess` to `/www/`. This includes PHP handler directives that should fix the 501 error.

## Immediate Actions

1. **Upload `.htaccess-with-php`** to `/www/` as `.htaccess`
2. **Verify `test-simple.php`** is in `/www/`
3. **Test:** `https://www.elektr-ame.com/test-simple.php`
4. **If still 501, create `phpinfo.php`** and test

