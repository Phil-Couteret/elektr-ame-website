# 🔧 Fix 501 Error - PHP Not Executing on OVH

## Problem
Even after adding PHP handlers to `.htaccess`, PHP files still return `501 Not Implemented`.

## Root Cause
OVH Multisite might be configured incorrectly, or PHP needs to be enabled in OVH Control Panel.

## Solution 1: Check OVH Control Panel PHP Settings

### Step 1: Verify PHP is Enabled
1. **OVH Control Panel** → **Web** → **Multisite**
2. Click on `www.elektr-ame.com`
3. Check **"PHP version"** - should be **8.4** or **8.x**
4. If PHP is disabled, **enable it**

### Step 2: Check Document Root
1. In Multisite settings, verify **"Root folder"**
2. Should be: `/home/elektry/www` or `www`
3. Make sure it points to where your files are

### Step 3: Check .ovhconfig
The `.ovhconfig` file should exist in `/home/elektry/www/.ovhconfig` with:
```
app.engine=php
app.engine.version=8.4
app.engine.rewrite=1
```

## Solution 2: Try Alternative .htaccess

If PHP handlers don't work, try this minimal version:

```apache
# Minimal .htaccess for OVH
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Allow API to pass through
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule . - [L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# PHP Handler (try different methods)
AddHandler php8.4-script .php
AddType application/x-httpd-php .php
```

## Solution 3: Test with Simple PHP File

1. Upload `ovh-deployment/test-php-simple.php` to `/home/elektry/www/`
2. Visit: `https://www.elektr-ame.com/test-php-simple.php`
3. If this works → PHP is working, issue is with API path
4. If this fails → PHP is not enabled in OVH

## Solution 4: Check OVH PHP Configuration

### Via OVH Control Panel:
1. **Web** → **Multisite** → `www.elektr-ame.com`
2. Look for **"PHP"** or **"Engine"** section
3. Enable PHP if disabled
4. Set PHP version to **8.4**

### Via .ovhconfig (if you have SSH):
```bash
cd /home/elektry/www
cat > .ovhconfig << 'EOF'
app.engine=php
app.engine.version=8.4
app.engine.rewrite=1
EOF
```

## Solution 5: Contact OVH Support

If nothing works, the issue might be:
- PHP not enabled for your hosting plan
- Multisite misconfiguration
- Server-level PHP configuration issue

**Ask OVH:**
- "Why are PHP files returning 501 Not Implemented?"
- "Is PHP enabled for my Multisite domain?"
- "What PHP version is configured for www.elektr-ame.com?"

## Quick Diagnostic

1. **Test simple PHP:** `https://www.elektr-ame.com/test-php-simple.php`
2. **Check .ovhconfig:** Should exist and have `app.engine=php`
3. **Check Multisite:** PHP should be enabled
4. **Check file permissions:** PHP files should be 644

## Expected Results

✅ **If PHP works:**
- `test-php-simple.php` shows PHP info
- `test-db-connection.php` returns JSON (even if DB fails)

❌ **If PHP doesn't work:**
- Both files return 501 error
- Need to enable PHP in OVH Control Panel

