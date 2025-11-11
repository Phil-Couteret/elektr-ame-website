# 🔧 Fix: Files in Wrong Folder

## Problem Found
Files are being uploaded to `/home/elektry/www/` but the site is using `/home/www/` (or just `www`).

## Solution: Upload to Correct Location

### Step 1: Verify Multisite Root Folder

1. **OVH Control Panel** → **Web** → **Multisite**
2. **Click on `www.elektr-ame.com`**
3. **Check "Root folder"** - What does it show exactly?
   - Is it `www`?
   - Is it `/home/www`?
   - Is it `/home/elektry/www`?

### Step 2: Upload to Correct Location

Based on the root folder:

**If root folder is `www`:**
- Upload to: `/home/www/index.html`
- Or: `www/index.html` (relative path in File Manager)

**If root folder is `/home/www`:**
- Upload to: `/home/www/index.html`

**If root folder is `/home/elektry/www`:**
- Upload to: `/home/elektry/www/index.html`

### Step 3: Copy Files from Wrong Location

If you've been uploading to `/home/elektry/www/` but need `/home/www/`:

1. **Via OVH File Manager:**
   - Navigate to `/home/elektry/www/`
   - Copy all files
   - Navigate to `/home/www/`
   - Paste files

2. **Or upload directly:**
   - Upload `dist/index.html` to the correct location
   - Upload all `assets/` files to the correct location
   - Upload `api/` folder to the correct location

### Step 4: Verify Files Are in Correct Location

After uploading:
1. **Check** the root folder path from Multisite
2. **Verify** `index.html` exists in that location
3. **Check** file content - should have `/assets/index-BsA5j1bS.js`

## Quick Check

**In OVH File Manager:**
1. Navigate to the root folder shown in Multisite
2. Check if `index.html` exists there
3. Check if `assets/` folder exists there
4. Check if `api/` folder exists there

## Files to Move/Copy

If files are in wrong location, move these:
- ✅ `index.html`
- ✅ `assets/` folder (with all JS/CSS files)
- ✅ `api/` folder
- ✅ `.htaccess`
- ✅ `manifest.json`
- ✅ `service-worker.js`
- ✅ `public/` folder (upload directories)

## After Fixing

1. **Wait 1-2 minutes**
2. **Hard refresh:** Ctrl+Shift+R
3. **Test:** Site should load correctly

The root folder in Multisite tells you exactly where files should be!

