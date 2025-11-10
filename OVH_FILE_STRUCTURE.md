# 📁 OVH Production File Structure

## Correct Directory Structure on OVH

Your OVH server (`www/` directory) should have this structure:

```
www/
├── index.html                    # From dist/
├── assets/                       # From dist/assets/
│   ├── index-*.js
│   └── index-*.css
├── api/                          # ⚠️ CRITICAL: API directory must exist here
│   ├── events-list.php
│   ├── artists-list.php
│   ├── galleries-list.php
│   ├── config.php                # ⚠️ Create manually with OVH credentials
│   ├── config-helper.php
│   └── ... (all other API files)
├── public/                       # Upload directories
│   ├── artist-images/
│   │   └── thumbnails/
│   ├── gallery-images/
│   │   └── thumbnails/
│   └── event-images/
├── .htaccess                     # From dist/.htaccess
├── service-worker.js
├── manifest.json
└── ... (other files from dist/)
```

## ⚠️ Common Issue: "API Not Found"

If you get "Not Found" errors, check:

### 1. API Directory Exists
```bash
# On OVH server, verify:
ls -la www/api/
```

Should show all PHP files.

### 2. File Permissions
```bash
# Set correct permissions:
chmod 755 www/api/
chmod 644 www/api/*.php
chmod 600 www/api/config.php
```

### 3. .htaccess is in Root
The `.htaccess` file must be in `www/` (document root), not in `www/api/`.

### 4. Test Direct Access
Try accessing directly:
- `https://www.elektr-ame.com/api/events-list.php`
- `https://www.elektr-ame.com/api/artists-list.php`

If these return "Not Found", the files aren't uploaded correctly.

## 📤 Upload Checklist

### Frontend Files (from `dist/`)
- [ ] Upload `dist/index.html` → `www/index.html`
- [ ] Upload `dist/assets/` → `www/assets/`
- [ ] Upload `dist/.htaccess` → `www/.htaccess`
- [ ] Upload `dist/service-worker.js` → `www/service-worker.js`
- [ ] Upload `dist/manifest.json` → `www/manifest.json`

### Backend Files (from `api/`)
- [ ] Upload `api/*.php` → `www/api/*.php`
- [ ] **Create** `www/api/config.php` manually (not from git)
- [ ] Verify `www/api/config-helper.php` exists

### Directories
- [ ] Create `www/public/artist-images/thumbnails/`
- [ ] Create `www/public/gallery-images/thumbnails/`
- [ ] Set permissions: `chmod 755` on directories

## 🔍 Verification Steps

### Step 1: Check API Directory
```bash
# SSH into OVH or use File Manager
cd www
ls -la api/
```

Should show:
```
events-list.php
artists-list.php
galleries-list.php
config.php
config-helper.php
...
```

### Step 2: Test API File Directly
Visit in browser:
```
https://www.elektr-ame.com/api/events-list.php
```

**Expected:**
- ✅ JSON response: `{"success":true,"events":[...]}`
- ❌ "Not Found" = files not uploaded
- ❌ Blank page = PHP error (check error logs)
- ❌ "Database error" = config.php issue

### Step 3: Check .htaccess
```bash
# Verify .htaccess exists in root
ls -la www/.htaccess
```

### Step 4: Test File Permissions
```bash
# Check if web server can read files
ls -la www/api/events-list.php
```

Should show: `-rw-r--r--` (644)

## 🚨 Quick Fix: If API Directory Missing

If `www/api/` doesn't exist:

1. **Create the directory:**
   ```bash
   mkdir -p www/api
   chmod 755 www/api
   ```

2. **Upload all API files:**
   - Upload all `.php` files from `api/` to `www/api/`
   - Create `www/api/config.php` with OVH credentials

3. **Set permissions:**
   ```bash
   chmod 644 www/api/*.php
   chmod 600 www/api/config.php
   ```

4. **Test:**
   ```
   https://www.elektr-ame.com/api/events-list.php
   ```

## 📝 Notes

- The `api/` directory must be at the same level as `index.html` (in `www/`)
- The `.htaccess` file tells Apache to pass `/api/` requests through
- If API files are in wrong location, you'll get "Not Found"
- Always test API endpoints directly in browser first

