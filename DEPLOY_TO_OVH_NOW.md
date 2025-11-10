# 🚀 DEPLOY TO OVH - Step-by-Step Guide

## ✅ Everything is Ready!

All files have been reviewed and are production-ready. Follow these steps:

## 📋 Step 1: Upload Files to `/home/elektry/www/`

### A. Upload Root Files
- [ ] `.htaccess` - **CRITICAL** - Already fixed with API passthrough
- [ ] `index.html` - React app entry point
- [ ] `manifest.json` - PWA manifest
- [ ] `assets/` directory - All React build files

### B. Upload API Files
Upload **ALL** files from `api/` directory to `/home/elektry/www/api/`

**Total: 74 PHP files** (see `OVH_FILES_TO_UPLOAD.txt` for complete list)

**Important:** Do NOT upload `api/config.php` from local - create it manually (see Step 2)

### C. Upload Subdirectories (if they exist)
- [ ] `api/classes/` - EmailAutomation.php, TaxCalculator.php

## 📝 Step 2: Create `config.php` on OVH

**Location:** `/home/elektry/www/api/config.php`

**Content:**
```php
<?php
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

**OR** copy from: `api/config-ovh-production.php` (it has the correct credentials)

## 🔧 Step 3: Set File Permissions

After uploading, set permissions:

```bash
# API directory
chmod 755 /home/elektry/www/api
chmod 644 /home/elektry/www/api/*.php
chmod 600 /home/elektry/www/api/config.php

# Root files
chmod 644 /home/elektry/www/.htaccess
chmod 644 /home/elektry/www/index.html
```

## ✅ Step 4: Verify Deployment

### Test 1: Database Connection
Visit: `https://www.elektr-ame.com/api/config-ovh-verification.php`

**Expected:** JSON showing database connection status

### Test 2: API Endpoints
- `https://www.elektr-ame.com/api/events-list.php` → Should return JSON
- `https://www.elektr-ame.com/api/artists-list.php` → Should return JSON
- `https://www.elektr-ame.com/api/galleries-list.php` → Should return JSON

### Test 3: Admin Portal
- Visit: `https://www.elektr-ame.com/admin`
- Login
- Check if Events, Artists, and Galleries load

## 📁 Final Directory Structure

```
/home/elektry/www/
├── .htaccess                    ✅ Upload (has API passthrough)
├── index.html                   ✅ Upload
├── manifest.json                ✅ Upload
├── assets/                      ✅ Upload (React build)
│   ├── index-*.js
│   └── index-*.css
└── api/                         ✅ Upload all PHP files
    ├── config.php               ⚠️ CREATE MANUALLY (see Step 2)
    ├── config-helper.php        ✅ Upload
    ├── events-list.php          ✅ Upload
    ├── artists-list.php         ✅ Upload
    ├── galleries-list.php       ✅ Upload
    └── ... (all other PHP files)
```

## 🚨 If You Get "Not Found" Errors

1. **Verify `.htaccess` has this rule:**
   ```apache
   RewriteCond %{REQUEST_URI} ^/api/
   RewriteRule ^(.*)$ - [L]
   ```

2. **Verify files exist:**
   ```bash
   ls -la /home/elektry/www/api/events-list.php
   ```

3. **Check file permissions:**
   ```bash
   ls -la /home/elektry/www/api/
   ```

4. **Verify `config.php` exists and has correct credentials**

## 📚 Reference Documents

- `OVH_DEPLOYMENT_COMPLETE.md` - Detailed deployment guide
- `OVH_FILES_TO_UPLOAD.txt` - Complete file list
- `api/config-ovh-production.php` - Ready-to-use config template

---

## ✅ Quick Checklist

- [ ] All API files uploaded to `/home/elektry/www/api/`
- [ ] `.htaccess` uploaded to `/home/elektry/www/`
- [ ] `config.php` created with correct credentials
- [ ] File permissions set correctly
- [ ] Database connection test passes
- [ ] API endpoints return JSON
- [ ] Admin portal works

**You're ready to deploy!** 🎉

