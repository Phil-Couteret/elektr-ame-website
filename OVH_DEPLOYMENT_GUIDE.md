# 🚀 OVH Production Deployment Guide

This guide covers deploying the Elektr-Âme website to OVH production server.

## 📋 Prerequisites

- OVH hosting account with database access
- FTP/SFTP access to OVH server
- Database credentials from OVH Control Panel

## 🔧 Step 1: Database Configuration

### 1.1 Get OVH Database Credentials

From OVH Control Panel → Databases:
- **Host**: `elektry2025.mysql.db`
- **Database**: `elektry2025`
- **Username**: `elektry2025`
- **Password**: (your OVH database password)

### 1.2 Create Production Config File

**On your local machine:**

```bash
cd api
cp config-ovh-template.php config.php
```

**Edit `api/config.php` and update:**

```php
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = 'YOUR_OVH_DATABASE_PASSWORD'; // ⚠️ Update this!
```

**⚠️ IMPORTANT:** `config.php` is in `.gitignore` - it will NOT be committed to GitHub. You must manually upload it to OVH.

## 📁 Step 2: File Structure on OVH

Your OVH server structure should be:

```
www/
├── api/
│   ├── config.php              # ⚠️ Upload manually (not in git)
│   ├── config-helper.php      # ✅ Auto-deployed
│   ├── *.php                   # ✅ All API files
│   └── ...
├── public/
│   ├── gallery-images/         # ✅ Auto-created on first upload
│   │   └── thumbnails/
│   └── ...
├── index.html                  # ✅ Frontend build
├── assets/                     # ✅ Frontend assets
└── ...
```

## 🔄 Step 3: Deployment Process

### Option A: GitHub Actions (Recommended)

If you have GitHub Actions set up:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

3. **GitHub Actions will:**
   - Build the frontend
   - Deploy to OVH via FTP
   - Upload all files except `config.php`

4. **Manually upload `config.php`:**
   - Use FTP/SFTP to upload `api/config.php` to OVH
   - Place it in `www/api/config.php`

### Option B: Manual Deployment

1. **Build production version:**
   ```bash
   npm run build
   ```

2. **Upload via FTP:**
   - Upload contents of `dist/` to `www/` on OVH
   - Upload all files from `api/` to `www/api/` on OVH
   - **Manually upload `api/config.php`** with OVH credentials

3. **Set permissions:**
   ```bash
   chmod 755 www/api/
   chmod 644 www/api/*.php
   chmod 600 www/api/config.php  # Secure config file
   chmod 755 www/public/gallery-images/
   ```

## 🗄️ Step 4: Database Setup on OVH

### 4.1 Import Database Schema

1. **Access phpMyAdmin** from OVH Control Panel
2. **Select database** `elektry2025`
3. **Import schema:**
   - Go to "Import" tab
   - Upload `database/schema.sql`
   - Click "Go"

### 4.2 Create Additional Tables

Import these additional schema files:
- `database/gallery_images_schema.sql`
- `database/artist_images_schema.sql`
- `database/admin-users.sql`

### 4.3 Verify Tables

Check that these tables exist:
- ✅ `members`
- ✅ `events`
- ✅ `artists`
- ✅ `gallery_images`
- ✅ `artist_images`
- ✅ `admin_users`
- ✅ `newsletter_subscribers`
- ✅ `newsletter_campaigns`

## 🔐 Step 5: Admin User Setup

### 5.1 Create Admin User

**Option A: Via phpMyAdmin**

Run this SQL (replace `YOUR_HASH` with password hash):

```sql
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('tech@elektr-ame.com', 'YOUR_HASH', 'Super Admin', 'superadmin');
```

**Option B: Via API Script**

1. Upload `api/setup-admin-local.php` temporarily
2. Visit: `https://www.elektr-ame.com/api/setup-admin-local.php`
3. **Delete the file immediately after use!**

### 5.2 Generate Password Hash

Use PHP to generate hash:

```php
<?php
echo password_hash('YOUR_PASSWORD', PASSWORD_DEFAULT);
?>
```

## 📂 Step 6: Upload Directories

### 6.1 Create Gallery Directories

On OVH server, create:

```bash
mkdir -p www/public/gallery-images/thumbnails
chmod 755 www/public/gallery-images
chmod 755 www/public/gallery-images/thumbnails
```

Or they will be auto-created on first upload.

### 6.2 Verify Permissions

```bash
# API directory
chmod 755 www/api/

# Upload directories (must be writable)
chmod 755 www/public/gallery-images/
chmod 755 www/public/gallery-images/thumbnails/
```

## ✅ Step 7: Verification Checklist

### 7.1 Test API Endpoints

Visit these URLs (should return JSON):

- ✅ `https://www.elektr-ame.com/api/events-list.php`
- ✅ `https://www.elektr-ame.com/api/artists-list.php`
- ✅ `https://www.elektr-ame.com/api/get-gallery-images.php`

### 7.2 Test Admin Panel

1. Visit: `https://www.elektr-ame.com/admin`
2. Login with admin credentials
3. Test:
   - ✅ Events management
   - ✅ Artists management
   - ✅ Gallery multi-image upload
   - ✅ Members management

### 7.3 Test Public Pages

1. Visit: `https://www.elektr-ame.com`
2. Verify:
   - ✅ Events display correctly
   - ✅ Artists show with pictures and links
   - ✅ Gallery displays images
   - ✅ Join Us form works

## 🔒 Step 8: Security Checklist

- [ ] `config.php` is NOT in git (check `.gitignore`)
- [ ] `config.php` has correct file permissions (600)
- [ ] Database password is strong
- [ ] Admin user password is strong
- [ ] Upload directories have correct permissions
- [ ] CORS is configured for production only
- [ ] Error messages don't expose sensitive info

## 🐛 Troubleshooting

### Database Connection Fails

**Check:**
1. Database credentials in `config.php`
2. Database host is accessible from OVH
3. Database user has correct permissions
4. Firewall allows connections

**Test connection:**
```php
// Create test file: api/test-db-connection.php
<?php
require_once __DIR__ . '/config.php';
echo "Connected successfully!";
?>
```

### Images Not Uploading

**Check:**
1. `public/gallery-images/` directory exists
2. Directory permissions are 755 or 777
3. PHP `upload_max_filesize` and `post_max_size` settings
4. Check PHP error logs

### CORS Errors

**Check:**
1. `config-helper.php` is uploaded
2. CORS headers are set correctly
3. Origin matches `https://www.elektr-ame.com`

### Admin Login Fails

**Check:**
1. `admin_users` table exists
2. Admin user exists in database
3. Password hash is correct
4. Session storage is writable

## 📝 Environment Differences

### Local Development
- Database: `localhost` / `elektr_ame`
- Frontend: `http://localhost:8080`
- Upload path: `../public/gallery-images/`
- CORS: Allows localhost

### OVH Production
- Database: `elektry2025.mysql.db` / `elektry2025`
- Frontend: `https://www.elektr-ame.com`
- Upload path: `public/gallery-images/` (from document root)
- CORS: Only allows `www.elektr-ame.com`

## 🎯 Quick Deployment Commands

```bash
# 1. Build
npm run build

# 2. Commit (config.php is ignored)
git add .
git commit -m "Deploy to production"
git push

# 3. Manually upload config.php via FTP
# 4. Verify on production
```

## 📞 Support

If you encounter issues:
1. Check OVH error logs
2. Check PHP error logs
3. Verify database connection
4. Test API endpoints individually
5. Check browser console for frontend errors

---

**Last Updated:** November 2025
**Environment:** OVH Production Server

