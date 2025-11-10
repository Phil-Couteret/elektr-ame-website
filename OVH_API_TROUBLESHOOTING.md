# 🔍 OVH API Troubleshooting Guide

## ❌ Current Issue: "Not Found" for API endpoints

If you're getting "The requested URL was not found on this server" for API endpoints, check the following:

## ✅ Step 1: Verify File Locations

**On OVH server, check these paths exist:**

```bash
# Check if api directory exists
ls -la /home/elektry/www/api/

# Check if specific files exist
ls -la /home/elektry/www/api/config-ovh-verification.php
ls -la /home/elektry/www/api/events-list.php
ls -la /home/elektry/www/api/config.php
```

**Expected output:** You should see all PHP files listed.

**If files don't exist:** Upload them to `/home/elektry/www/api/`

## ✅ Step 2: Verify .htaccess Configuration

**The `.htaccess` file MUST be in `/home/elektry/www/.htaccess`**

**Check if it exists:**
```bash
ls -la /home/elektry/www/.htaccess
```

**The `.htaccess` should contain this rule to allow API requests:**

```apache
# Allow API calls to pass through
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ - [L]
```

**Full `.htaccess` content should be:**

```apache
# Force HTTPS - Required for PWA
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Allow API calls to pass through
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ - [L]

# React Router - Serve index.html for all other routes
# Don't rewrite if the file/directory exists
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

**If `.htaccess` is missing or incorrect:**
1. Upload the correct `.htaccess` from `public/.htaccess` to `/home/elektry/www/.htaccess`
2. Set permissions: `chmod 644 /home/elektry/www/.htaccess`

## ✅ Step 3: Verify File Permissions

**Set correct permissions for API files:**

```bash
# Make API directory accessible
chmod 755 /home/elektry/www/api

# Make PHP files readable
chmod 644 /home/elektry/www/api/*.php

# Make config.php secure (readable only by owner)
chmod 600 /home/elektry/www/api/config.php
```

## ✅ Step 4: Test PHP Execution

**Create a simple test file to verify PHP works:**

Create `/home/elektry/www/api/test-php.php`:

```php
<?php
phpinfo();
?>
```

**Visit:** `https://www.elektr-ame.com/api/test-php.php`

**Expected:** PHP information page
**If "Not Found":** Files are in wrong location or `.htaccess` is blocking

## ✅ Step 5: Check Apache/PHP Configuration

**Verify PHP is enabled and working:**

1. Check if PHP files are being executed (not downloaded)
2. Check Apache error logs: `/var/log/apache2/error.log` or OVH error logs
3. Verify `mod_rewrite` is enabled

## 🎯 Quick Diagnostic Checklist

- [ ] Files exist at `/home/elektry/www/api/*.php`
- [ ] `.htaccess` exists at `/home/elektry/www/.htaccess`
- [ ] `.htaccess` contains the API passthrough rule
- [ ] File permissions are correct (644 for PHP files, 755 for directories)
- [ ] `config.php` exists and has correct credentials
- [ ] PHP is working (test with `phpinfo()`)
- [ ] `mod_rewrite` is enabled on Apache

## 🚨 Common Issues

### Issue: Files uploaded but still "Not Found"
**Solution:**
- Verify files are in `/home/elektry/www/api/` (not a subdirectory)
- Check `.htaccess` has the API passthrough rule
- Verify file permissions

### Issue: PHP files download instead of execute
**Solution:**
- PHP might not be configured correctly
- Check Apache/PHP configuration
- Contact OVH support if needed

### Issue: 500 Internal Server Error
**Solution:**
- Check PHP error logs
- Verify `config.php` syntax is correct
- Check database connection credentials

## 📋 File Structure Verification

**Correct structure on OVH:**

```
/home/elektry/www/                    ← Document root
├── .htaccess                         ← MUST exist with API rule
├── index.html                        ← React app entry point
├── assets/                           ← React build assets
│   ├── index-*.js
│   └── index-*.css
└── api/                              ← API directory
    ├── config.php                    ← Database config
    ├── config-helper.php
    ├── events-list.php
    ├── artists-list.php
    ├── galleries-list.php
    └── ... (all other PHP files)
```

## 🔧 Manual Test Commands

**Via SSH (if you have access):**

```bash
# Test if file exists
test -f /home/elektry/www/api/events-list.php && echo "EXISTS" || echo "NOT FOUND"

# Test PHP syntax
php -l /home/elektry/www/api/events-list.php

# Test database connection
php -r "require '/home/elektry/www/api/config.php'; echo 'Connection OK';"
```

---

**After fixing these issues, test:**
- `https://www.elektr-ame.com/api/test-php.php` (should show PHP info)
- `https://www.elektr-ame.com/api/config-ovh-verification.php` (should show JSON)
- `https://www.elektr-ame.com/api/events-list.php` (should show JSON)

