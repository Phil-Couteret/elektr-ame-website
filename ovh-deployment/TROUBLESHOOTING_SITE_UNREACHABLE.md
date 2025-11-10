# 🔍 Troubleshooting: Site Unreachable

## Immediate Checks

### 1. Verify Files Are in Correct Location
**Check via FTP:**
- Navigate to `/home/elektry/www/`
- Verify `index.html` exists
- Verify `.htaccess` exists
- Verify `assets/` folder exists

### 2. Check File Permissions
**Set correct permissions:**
```bash
chmod 644 /home/elektry/www/index.html
chmod 644 /home/elektry/www/.htaccess
chmod 755 /home/elektry/www/assets
chmod 644 /home/elektry/www/assets/*
```

### 3. Check .htaccess
**Verify `.htaccess` is uploaded and not corrupted:**
- File should exist at `/home/elektry/www/.htaccess`
- Should contain the API passthrough rule
- If site is completely unreachable, try temporarily renaming `.htaccess` to `.htaccess.bak` to test

### 4. Check OVH Control Panel
- Log into OVH Control Panel
- Check if domain is pointing to correct directory
- Verify hosting is active
- Check for any error messages

### 5. Test with Simple File
**Create a test file on OVH:**
Create `/home/elektry/www/test.html`:
```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Server is working!</h1></body>
</html>
```

Visit: `https://www.elektr-ame.com/test.html`
- If this works → Issue is with index.html or .htaccess
- If this doesn't work → Server/hosting issue

## Common Issues & Fixes

### Issue 1: Wrong Document Root
**Symptom:** 404 or "Not Found"
**Fix:** Verify document root is `/home/elektry/www/` in OVH control panel

### Issue 2: .htaccess Blocking Everything
**Symptom:** 500 error or blank page
**Fix:** Temporarily rename `.htaccess` to test:
```bash
mv /home/elektry/www/.htaccess /home/elektry/www/.htaccess.bak
```
If site works, the issue is with `.htaccess` rules

### Issue 3: Missing index.html
**Symptom:** Directory listing or 403 error
**Fix:** Verify `index.html` exists and has correct permissions

### Issue 4: PHP Errors
**Symptom:** Blank page or 500 error
**Fix:** Check PHP error logs in OVH control panel

## Quick Fix: Minimal .htaccess

If current `.htaccess` is causing issues, try this minimal version:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Allow API calls
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule . - [L]

# Serve index.html for all other routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

## Step-by-Step Recovery

1. **Backup current .htaccess:**
   ```bash
   mv /home/elektry/www/.htaccess /home/elektry/www/.htaccess.backup
   ```

2. **Test if site loads:**
   - Visit: `https://www.elektr-ame.com`
   - If it loads → Issue was with `.htaccess`
   - If it doesn't → Issue is elsewhere

3. **If site loads without .htaccess:**
   - Upload the minimal `.htaccess` above
   - Test again
   - Gradually add rules back

4. **If site still doesn't load:**
   - Check OVH control panel for errors
   - Verify domain DNS settings
   - Contact OVH support if needed

