# 🔧 Fix 501 "Not Implemented" Error

## Problem
PHP files return `501 Not Implemented` - PHP is not executing on OVH.

## Solution: Update .htaccess with PHP Handlers

### Step 1: Update .htaccess on OVH

**Via OVH File Manager or FTP:**

1. Navigate to: `/home/elektry/www/.htaccess`
2. Replace the entire content with the content from `ovh-deployment/.htaccess-production`

**Or manually add these lines after the RewriteModule section:**

```apache
# Enable PHP (OVH specific - CRITICAL for API to work)
<IfModule mod_php7.c>
    AddType application/x-httpd-php .php
</IfModule>
<IfModule mod_php8.c>
    AddType application/x-httpd-php .php
</IfModule>
<IfModule mod_php.c>
    AddType application/x-httpd-php .php
</IfModule>
AddHandler application/x-httpd-php .php
```

### Step 2: Fix config.php

**CRITICAL:** The production `config.php` must use production database host, NOT `127.0.0.1`!

**Via OVH File Manager:**

1. Navigate to: `/home/elektry/www/api/config.php`
2. Replace content with the content from `ovh-deployment/api-config-production.php`

**Or manually set:**
```php
$host = "elektry2025.mysql.db";  // ✅ Correct for OVH
// NOT: $host = "127.0.0.1";     // ❌ This is for local development only!
```

### Step 3: Test

1. **Test PHP:** `https://www.elektr-ame.com/api/test-db-connection.php`
   - Should return: `{"success":true,"message":"Database connection successful"}`
   - NOT: `501 Not Implemented`

2. **Test Homepage:** `https://www.elektr-ame.com/`
   - Should load the React app

## Files to Update

1. `/home/elektry/www/.htaccess` → Use `ovh-deployment/.htaccess-production`
2. `/home/elektry/www/api/config.php` → Use `ovh-deployment/api-config-production.php`

## Why This Happens

OVH requires explicit PHP handler directives in `.htaccess` to execute PHP files. The current `.htaccess` is missing these directives.

## Alternative: Check OVH PHP Configuration

If `.htaccess` doesn't work:

1. **OVH Control Panel** → **Web** → **Multisite**
2. Check PHP version (should be 8.4)
3. Verify PHP is enabled for your domain
4. Check if `.ovhconfig` exists (it should: `app.engine=php`)

## Quick Copy Commands

If you have SSH access:

```bash
# Copy .htaccess
cp ovh-deployment/.htaccess-production /home/elektry/www/.htaccess

# Copy config.php
cp ovh-deployment/api-config-production.php /home/elektry/www/api/config.php
```

