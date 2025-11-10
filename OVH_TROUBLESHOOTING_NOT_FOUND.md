# 🔍 Troubleshooting "Not Found" on OVH

## Current Issue
`https://www.elektr-ame.com/api/config-ovh-verification.php` returns "Not Found"

## Possible Causes

### 1. Files Not Uploaded
**Check:** Are the files actually on the server?

**Via FTP/File Manager:**
- Navigate to `/home/elektry/www/api/`
- Verify `config-ovh-verification.php` exists
- Verify `test-api-access.php` exists

**Via SSH (if available):**
```bash
ls -la /home/elektry/www/api/config-ovh-verification.php
ls -la /home/elektry/www/api/test-api-access.php
```

### 2. Wrong Directory Structure
**OVH might expect files in a different location:**

**Check actual document root:**
- Visit: `https://www.elektr-ame.com/test-api-access.php` (in root)
- If this works, files might need to be in root, not `/api/`

**Alternative structure (if `/api/` doesn't work):**
```
/home/elektry/www/
├── index.html
├── .htaccess
├── api/              ← Files here
└── OR
├── api.php           ← Files in root with api- prefix?
```

### 3. .htaccess Not Working
**Check if .htaccess exists and is correct:**

**Location:** `/home/elektry/www/.htaccess`

**Must contain:**
```apache
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ - [L]
```

**Test:**
1. Temporarily rename `.htaccess` to `.htaccess.bak`
2. Try accessing the API endpoint
3. If it works, the issue is with `.htaccess`

### 4. OVH Specific Configuration
**OVH might need different setup:**

**Option A: Files in root with different naming**
- Some OVH setups require files in root
- Try: `https://www.elektr-ame.com/api-config-ovh-verification.php`

**Option B: Subdomain for API**
- API might need to be on `api.elektr-ame.com`
- Check OVH subdomain configuration

**Option C: Different path**
- OVH might use `/www/` or `/public_html/` instead of `/www/`
- Check actual document root path

### 5. PHP Not Enabled for /api/ Directory
**Check if PHP is enabled:**

Create `/home/elektry/www/api/phpinfo.php`:
```php
<?php phpinfo(); ?>
```

Visit: `https://www.elektr-ame.com/api/phpinfo.php`

- If you see PHP info → PHP works, issue is elsewhere
- If "Not Found" → PHP not configured for this path
- If file downloads → PHP not enabled

## Step-by-Step Diagnosis

### Step 1: Test Simple File
1. Upload `test-api-access.php` to `/home/elektry/www/api/`
2. Visit: `https://www.elektr-ame.com/api/test-api-access.php`
3. **If this works:** API directory is accessible, issue is with specific file
4. **If this fails:** API directory path is wrong

### Step 2: Test Root File
1. Upload `test-api-access.php` to `/home/elektry/www/` (root)
2. Visit: `https://www.elektr-ame.com/test-api-access.php`
3. **If this works:** Files need to be in root, not `/api/`

### Step 3: Check .htaccess
1. Verify `.htaccess` exists at `/home/elektry/www/.htaccess`
2. Check it contains the API passthrough rule
3. Verify `mod_rewrite` is enabled (check with hosting provider)

### Step 4: Check File Permissions
```bash
chmod 644 /home/elektry/www/api/*.php
chmod 755 /home/elektry/www/api
```

### Step 5: Check OVH Control Panel
1. Log into OVH Control Panel
2. Check "Web" or "Hosting" section
3. Verify document root is `/home/elektry/www`
4. Check if there are any path restrictions

## Quick Fixes to Try

### Fix 1: Move Files to Root
If `/api/` doesn't work, try moving files to root with `api-` prefix:
- `api-events-list.php`
- `api-artists-list.php`
- etc.

Then update frontend to call `/api-events-list.php` instead of `/api/events-list.php`

### Fix 2: Use Different .htaccess
If current `.htaccess` doesn't work, try this simpler version:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On

# Allow direct file access
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule . - [L]

# Allow API directory
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule . - [L]

# Everything else to index.html
RewriteRule . /index.html [L]
</IfModule>
```

### Fix 3: Check OVH Documentation
- OVH might have specific requirements for API endpoints
- Check OVH hosting documentation
- Contact OVH support if needed

## What to Check Next

1. **Upload `test-api-access.php`** to `/home/elektry/www/api/`
2. **Visit:** `https://www.elektr-ame.com/api/test-api-access.php`
3. **Share the result:**
   - Does it show JSON? → API works, issue is with specific file
   - Still "Not Found"? → Path/configuration issue
   - Shows PHP code? → PHP not enabled
   - Downloads file? → PHP not configured

## Alternative: Direct File Access Test

Try accessing a file directly without routing:
- `https://www.elektr-ame.com/api/test-api-access.php?direct=1`

If this works but the normal URL doesn't, it's a routing issue.

