# 🚨 URGENT: Fix Cache Issue - Still Loading main.tsx

## Problem
Console shows `main.tsx:1` error - browser is loading **cached development index.html** even though server has correct file.

## Immediate Fix: Force Bypass Cache

### Step 1: Enable Network Bypass in DevTools

1. **In DevTools** → **Application** tab → **Service Workers**
2. **Check "Bypass for network"** ✅
   - This forces browser to always fetch fresh files
   - Bypasses all caches including service workers

### Step 2: Disable Cache in Network Tab

1. **Open DevTools** → **Network** tab
2. **Check "Disable cache"** ✅ (at the top)
3. **Keep DevTools open** while testing

### Step 3: Hard Refresh with Cache Bypass

1. **With DevTools open** (Network tab, "Disable cache" checked)
2. **Right-click the refresh button**
3. **Select "Empty Cache and Hard Reload"**
   - Or: `Ctrl+Shift+Delete` → Clear cache → Hard reload

### Step 4: Verify .htaccess is Updated

**CRITICAL:** Make sure you've uploaded `ovh-deployment/.htaccess-with-mime` to OVH.

**Check:**
1. Via OVH File Manager, verify `/home/elektry/www/.htaccess` contains:
   ```apache
   AddType application/javascript .js
   AddType application/json .json
   ```

### Step 5: Test Direct URL

**Visit directly:** `https://www.elektr-ame.com/assets/index-BsA5j1bS.js`

**Expected:**
- ✅ Shows JavaScript code
- ✅ Response header: `Content-Type: application/javascript`

**If wrong:**
- ❌ Shows HTML → .htaccess not working
- ❌ 404 error → File missing
- ❌ Wrong MIME type → .htaccess not applied

## Alternative: Use Incognito + Network Tab

1. **Open incognito window**
2. **Open DevTools** → **Network** tab
3. **Check "Disable cache"**
4. **Visit:** `https://www.elektr-ame.com`
5. **Check Network tab:**
   - What file is being requested for the script?
   - Is it `index-BsA5j1bS.js` or `main.tsx`?
   - What's the response?

## Fix Manifest.json Error

The manifest error (line 2, column 1) suggests encoding issue.

**Fix:**
1. **Download** `dist/manifest.json` from your local build
2. **Upload** to `/home/elektry/www/manifest.json` on OVH
3. **Make sure** it's saved as **UTF-8 without BOM**

## Quick Verification

**In Network tab, check:**
1. **Request URL:** Should be `/assets/index-BsA5j1bS.js` (NOT `/src/main.tsx`)
2. **Status:** Should be `200 OK` (NOT 404)
3. **Content-Type:** Should be `application/javascript` (NOT empty or `text/html`)

If any of these are wrong, the issue is:
- Wrong URL → Cached index.html
- 404 → File missing
- Wrong MIME → .htaccess not applied

