# 🔧 OVH PHP Configuration Fix

## Current Status
- ✅ HTML files work
- ✅ Files in correct location (`/www/`)
- ✅ Not an `.htaccess` issue (still 501 after renaming)
- ❌ PHP returns "501 Not Implemented"

## The Problem
501 error means PHP is not properly configured or enabled for this directory.

## Solutions

### Solution 1: Enable PHP in OVH Control Panel
**OVH Control Panel → "Web" → "PHP":**

1. Check if PHP is enabled
2. If disabled, enable it
3. Select PHP version (7.4, 8.0, 8.1, etc.)
4. Save changes

### Solution 2: Check PHP Handler
**OVH Control Panel → "Web" → "Configuration":**

1. Look for "PHP handler" or "PHP version"
2. Make sure it's set (not "None" or "Disabled")
3. Common handlers: `php-fpm`, `mod_php`, `cgi`

### Solution 3: Add .htaccess for PHP
Create a new `.htaccess` with PHP handler:

```apache
# Enable PHP
AddHandler application/x-httpd-php .php
AddType application/x-httpd-php .php

# Or for OVH:
<IfModule mod_php7.c>
    AddType application/x-httpd-php .php
</IfModule>

# Allow API calls
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_URI} ^/api/
RewriteRule . - [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

### Solution 4: Check File Permissions
Via FTP, verify:
- PHP files: `644`
- Directories: `755`

### Solution 5: Contact OVH Support
If nothing works, contact OVH support:
- "PHP files return 501 Not Implemented"
- "HTML works but PHP doesn't"
- "What PHP configuration is needed?"

## Most Likely Fix

**OVH Control Panel → "Web" → "PHP":**
- Enable PHP
- Select a PHP version
- Save

## Immediate Actions

1. **Check OVH PHP settings** - Is PHP enabled?
2. **Try adding PHP handler to .htaccess** (see Solution 3)
3. **Contact OVH support** if needed

