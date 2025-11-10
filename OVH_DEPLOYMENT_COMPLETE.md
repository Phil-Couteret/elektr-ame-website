# 🚀 Complete OVH Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Files to Upload to `/home/elektry/www/`

#### 1. Root Files
- [ ] `.htaccess` - **CRITICAL** - Must allow API passthrough
- [ ] `index.html` - React app entry point
- [ ] `manifest.json` - PWA manifest
- [ ] `service-worker.js` - Service worker (if exists)

#### 2. Directories
- [ ] `assets/` - All React build assets (JS, CSS, images)
- [ ] `api/` - All PHP API files (see list below)
- [ ] `public/` - Public assets (images, uploads directory structure)

#### 3. API Files (upload ALL to `/home/elektry/www/api/`)
```
api/
├── config.php                    ⚠️ CREATE MANUALLY (see below)
├── config-helper.php             ✅ Upload
├── auth-login.php                ✅ Upload
├── auth-check.php                ✅ Upload
├── auth-logout.php               ✅ Upload
├── events-list.php               ✅ Upload
├── events-create.php             ✅ Upload
├── events-update.php             ✅ Upload
├── events-delete.php             ✅ Upload
├── artists-list.php              ✅ Upload
├── artists-create.php            ✅ Upload
├── artists-update.php            ✅ Upload
├── artists-delete.php            ✅ Upload
├── galleries-list.php            ✅ Upload
├── galleries-create.php          ✅ Upload
├── galleries-update.php          ✅ Upload
├── galleries-delete.php         ✅ Upload
├── get-gallery-images.php        ✅ Upload
├── upload-gallery-images.php     ✅ Upload
├── delete-gallery-image.php      ✅ Upload
├── upload-artist-images.php      ✅ Upload
├── delete-artist-image.php       ✅ Upload
├── upload-event-image.php        ✅ Upload
├── get-artist-images.php         ✅ Upload
├── members-list.php              ✅ Upload
├── join-us.php                   ✅ Upload
└── ... (all other PHP files)
```

#### 4. Create `config.php` Manually
**Location:** `/home/elektry/www/api/config.php`

**Content:**
```php
<?php
// OVH Production Database Configuration
$host = "elektry2025.mysql.db";
$dbname = "elektry2025";
$username = "elektry";
$password = "92Alcolea2025";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
```

**Set permissions:**
```bash
chmod 600 /home/elektry/www/api/config.php
```

## 📁 Required Directory Structure on OVH

```
/home/elektry/www/                    ← Document root
├── .htaccess                        ← Must have API passthrough rule
├── index.html                       ← React app
├── manifest.json                    ← PWA manifest
├── assets/                          ← React build assets
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
├── api/                             ← API directory
│   ├── config.php                   ← CREATE THIS (not in git)
│   ├── config-helper.php
│   ├── *.php                        ← All other PHP files
│   └── classes/                     ← If exists
│       ├── EmailAutomation.php
│       └── TaxCalculator.php
└── public/                          ← Public assets
    ├── gallery-images/              ← Auto-created by API
    │   ├── thumbnails/
    │   └── ...
    ├── artist-images/               ← Auto-created by API
    │   ├── thumbnails/
    │   └── ...
    └── event-images/                ← Auto-created by API
        └── ...
```

## 🔧 File Permissions

After uploading, set correct permissions:

```bash
# API directory
chmod 755 /home/elektry/www/api
chmod 644 /home/elektry/www/api/*.php
chmod 600 /home/elektry/www/api/config.php

# Root files
chmod 644 /home/elektry/www/.htaccess
chmod 644 /home/elektry/www/index.html

# Public upload directories (will be created by API, but set if needed)
chmod 755 /home/elektry/www/public
chmod 755 /home/elektry/www/public/gallery-images
chmod 755 /home/elektry/www/public/artist-images
chmod 755 /home/elektry/www/public/event-images
```

## ✅ Verification Steps

### 1. Test Database Connection
Visit: `https://www.elektr-ame.com/api/config-ovh-verification.php`

**Expected:** JSON with database connection status and table information

### 2. Test API Endpoints
- `https://www.elektr-ame.com/api/events-list.php` → Should return `{"success":true,"events":[],"count":0}`
- `https://www.elektr-ame.com/api/artists-list.php` → Should return `{"success":true,"artists":[],"count":0}`
- `https://www.elektr-ame.com/api/galleries-list.php` → Should return `{"success":true,"galleries":[],"count":0}`

### 3. Test Admin Portal
- Visit: `https://www.elektr-ame.com/admin`
- Login with admin credentials
- Check if Events, Artists, and Galleries load without errors

### 4. Test File Uploads
- Try uploading an image in Gallery
- Try uploading an image for an Artist
- Verify files are saved in `/home/elektry/www/public/`

## 🚨 Common Issues & Solutions

### Issue: "Not Found" for API endpoints
**Solution:**
1. Verify `.htaccess` has the API passthrough rule:
   ```apache
   RewriteCond %{REQUEST_URI} ^/api/
   RewriteRule ^(.*)$ - [L]
   ```
2. Verify files exist at `/home/elektry/www/api/*.php`
3. Check file permissions (644 for PHP files)

### Issue: Database connection failed
**Solution:**
1. Verify `config.php` has correct credentials
2. Check database host is accessible from OVH server
3. Verify username is `elektry` (not `elektry2025`)
4. Check password is correct

### Issue: CORS errors in browser
**Solution:**
1. Verify `config-helper.php` is uploaded
2. Check API files use `setCorsHeaders()` from `config-helper.php`
3. Verify production origin is `https://www.elektr-ame.com`

### Issue: File uploads fail
**Solution:**
1. Verify `/home/elektry/www/public/` directory exists
2. Check write permissions (755 for directories)
3. Verify `config-helper.php` `getUploadDirectory()` function works

## 📝 Quick Upload Commands (if you have SSH access)

```bash
# Navigate to local project
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website

# Upload .htaccess
scp .htaccess your-username@ovh-host:/home/elektry/www/

# Upload all API files (excluding config.php)
scp api/*.php your-username@ovh-host:/home/elektry/www/api/
scp -r api/classes your-username@ovh-host:/home/elektry/www/api/ 2>/dev/null || true

# Upload React build (if you have dist/ folder)
scp -r dist/* your-username@ovh-host:/home/elektry/www/
```

## 🎯 Post-Deployment Checklist

- [ ] `.htaccess` uploaded and has API passthrough rule
- [ ] All API files uploaded to `/home/elektry/www/api/`
- [ ] `config.php` created with correct credentials
- [ ] File permissions set correctly
- [ ] Database connection test passes
- [ ] API endpoints return JSON (not "Not Found")
- [ ] Admin portal loads without errors
- [ ] File uploads work
- [ ] Public website displays correctly

---

**After deployment, delete these test files:**
- `api/config-ovh-verification.php` (optional, useful for debugging)
- `api/test-*.php` files (optional)

