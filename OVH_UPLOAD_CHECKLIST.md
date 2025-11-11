# 📤 OVH Upload Checklist

## ⚠️ CRITICAL: API Files Must Be Uploaded

The "Not Found" error means the API files are **not on the OVH server** or are in the **wrong location**.

## 📁 Required File Structure on OVH

```
/home/elektry/www/              ← Document root (where index.html is)
├── index.html                  ✅ Should exist
├── assets/                     ✅ Should exist
├── api/                        ⚠️ THIS MUST EXIST!
│   ├── events-list.php         ❌ Upload this
│   ├── artists-list.php        ❌ Upload this
│   ├── galleries-list.php      ❌ Upload this
│   ├── config-helper.php        ❌ Upload this
│   ├── test-all-endpoints.php   ❌ Upload this (for testing)
│   └── ... (ALL other .php files from api/ folder)
│   └── config.php               ⚠️ Create manually (not in git)
└── .htaccess                   ✅ Should exist
```

## 🔍 Step 1: Verify Current State

**Via FTP/SFTP or File Manager, check:**

1. Does `/home/elektry/www/api/` directory exist?
   - If NO → Create it: `mkdir /home/elektry/www/api`
   - If YES → Check what's inside

2. List files in API directory:
   ```bash
   ls -la /home/elektry/www/api/
   ```

## 📤 Step 2: Upload API Files

### Option A: Via FTP/SFTP Client

1. **Connect to OVH server:**
   - Host: Your OVH FTP host
   - Username: Your OVH FTP username
   - Password: Your OVH FTP password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Navigate to:** `/home/elektry/www/`

3. **Create `api/` folder** (if it doesn't exist)

4. **Upload ALL files from local `api/` folder:**
   - Select all `.php` files from your local `api/` directory
   - Upload them to `/home/elektry/www/api/`
   - **EXCEPT** `config.php` (create manually)

### Option B: Via OVH File Manager

1. Log into OVH Control Panel
2. Go to File Manager
3. Navigate to `/home/elektry/www/`
4. Create `api/` folder if needed
5. Upload all PHP files from local `api/` folder

## 🔧 Step 3: Create config.php

**Create `/home/elektry/www/api/config.php` manually:**

```php
<?php
// Database configuration for OVH Production
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = 'YOUR_OVH_DATABASE_PASSWORD'; // ⚠️ Replace with actual password

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

## ✅ Step 4: Verify Upload

### Check Files Exist:
```bash
# Via SSH or File Manager, verify:
ls -la /home/elektry/www/api/events-list.php
ls -la /home/elektry/www/api/artists-list.php
ls -la /home/elektry/www/api/galleries-list.php
ls -la /home/elektry/www/api/config-helper.php
ls -la /home/elektry/www/api/config.php
```

### Test in Browser:
1. Visit: `https://www.elektr-ame.com/api/test-all-endpoints.php`
   - Should show JSON diagnostic info
   - NOT "Not Found"

2. Visit: `https://www.elektr-ame.com/api/events-list.php`
   - Should show: `{"success":true,"events":[],"count":0}`
   - NOT "Not Found"

## 🚨 Common Issues

### Issue: "Not Found" persists
**Solution:**
- Verify files are actually uploaded (check file list)
- Check file permissions: `chmod 644 /home/elektry/www/api/*.php`
- Verify `.htaccess` exists in `/home/elektry/www/`
- Check if Apache/PHP is configured correctly

### Issue: Files uploaded but still "Not Found"
**Possible causes:**
1. Files in wrong directory (not `/home/elektry/www/api/`)
2. `.htaccess` not allowing API requests
3. Apache mod_rewrite not enabled
4. File permissions incorrect

### Issue: Blank page when accessing API
**Solution:**
- Check PHP error logs on OVH
- Verify `config.php` has correct credentials
- Test database connection separately

## 📋 Quick Upload Command (if you have SSH access)

```bash
# Navigate to your local project
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website

# Upload all API files (using SCP - adjust username/host)
scp api/*.php your-username@your-ovh-host:/home/elektry/www/api/

# Or use rsync
rsync -avz api/*.php your-username@your-ovh-host:/home/elektry/www/api/
```

## 🎯 Priority Files to Upload

**Minimum required files:**
1. ✅ `config-helper.php` - Environment detection
2. ✅ `events-list.php` - Events API
3. ✅ `artists-list.php` - Artists API
4. ✅ `galleries-list.php` - Galleries API
5. ✅ `test-all-endpoints.php` - Diagnostic tool
6. ⚠️ `config.php` - Create manually

**After these work, upload the rest:**
- All other API endpoints (create, update, delete, etc.)

---

**Once files are uploaded, test again:**
- `https://www.elektr-ame.com/api/test-all-endpoints.php`
- `https://www.elektr-ame.com/api/events-list.php`

If you still get "Not Found", the files are not in the correct location.

