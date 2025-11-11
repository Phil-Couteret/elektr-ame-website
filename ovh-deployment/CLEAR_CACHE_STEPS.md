# 🧹 Complete Cache Clearing Steps

## Step 1: Check Service Workers from Other Origins

1. **Click "See all registrations"** (blue link in the screenshot)
2. **Unregister any service workers** you find there
3. **Close that panel**

## Step 2: Clear Storage

1. In the left sidebar, click **"Storage"** (under the "Storage" section)
2. Click **"Clear site data"** button (usually at the top)
3. **Check all boxes:**
   - Cookies and other site data
   - Cached images and files
   - Service workers
   - Local storage
   - Session storage
4. Click **"Clear site data"**

## Step 3: Check Network Bypass

1. In the Service Workers panel, **check "Bypass for network"**
   - This forces the browser to always fetch fresh files
   - Useful for testing

## Step 4: Hard Refresh

1. **Close DevTools**
2. **Hard refresh:** 
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - Or: `Ctrl + F5` (Windows) / `Cmd + R` (Mac)

## Step 5: Verify .htaccess is Updated

Make sure you've uploaded `ovh-deployment/.htaccess-with-mime` to OVH.

## Step 6: Test in Incognito

1. **Open incognito/private window**
2. **Visit:** `https://www.elektr-ame.com`
3. **Open DevTools** → **Network** tab
4. **Refresh page**
5. **Check:**
   - `index-BsA5j1bS.js` loads successfully
   - Content-Type header is `application/javascript`
   - No 404 errors
   - No MIME type errors in console

## If Still Not Working

**Check Network tab:**
1. Find `index-BsA5j1bS.js` in the list
2. Click on it
3. Check **"Response Headers"**
4. Look for `Content-Type: application/javascript`
5. If it's missing or wrong → `.htaccess` not applied

## Quick Test URL

Visit directly: `https://www.elektr-ame.com/assets/index-BsA5j1bS.js`

- ✅ Should show JavaScript code
- ❌ Should NOT show HTML or 404 error
- ❌ Should NOT show "Not Found"

