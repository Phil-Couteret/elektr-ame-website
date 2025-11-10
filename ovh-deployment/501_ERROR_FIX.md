# 🔧 Fix 501 "Not Implemented" Error

## Current Status
- ✅ HTML files work
- ✅ Files are in correct location (`/www/`)
- ❌ PHP files return "501 Not Implemented"

## What 501 Error Means
"501 Not Implemented" means:
- The server found the file
- But can't execute/process it
- Usually means PHP isn't configured correctly

## Solutions

### Solution 1: Check .htaccess Rules
The `.htaccess` might have rules blocking PHP. Check if it has:
- Rules that block `.php` files
- Rules that redirect PHP requests
- Rules that change request methods

**Test:**
1. Rename `.htaccess` to `.htaccess.backup`
2. Test: `https://www.elektr-ame.com/test-simple.php`
3. If it works → `.htaccess` is the problem

### Solution 2: Check PHP File Extension
Make sure PHP files have `.php` extension:
- ✅ `test-simple.php` (correct)
- ❌ `test-simple.PHP` (wrong)
- ❌ `test-simple` (wrong)

### Solution 3: Check OVH PHP Configuration
OVH Control Panel → "Web" → "PHP":
- Is PHP enabled?
- What PHP version?
- Are there any restrictions on PHP execution?

### Solution 4: Check File Permissions
Via FTP, check permissions:
- PHP files should be: `644`
- Directories should be: `755`

### Solution 5: Test with Minimal PHP
Create a super simple PHP file:

```php
<?php echo "PHP works"; ?>
```

Save as `test-minimal.php` and test.

## Most Likely Fix

Since HTML works but PHP gives 501, the `.htaccess` likely has rules interfering with PHP execution.

**Try:**
1. Rename `.htaccess` to `.htaccess.backup`
2. Test PHP file
3. If it works, we'll fix `.htaccess` to allow PHP

## Immediate Action

1. **Rename `.htaccess`** to `.htaccess.backup`
2. **Test:** `https://www.elektr-ame.com/test-simple.php`
3. **Report result**

