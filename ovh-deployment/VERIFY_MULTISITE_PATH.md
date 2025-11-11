# ✅ Verify Multisite Root Folder Path

## Understanding OVH Paths

When Multisite shows root folder as `www`, it usually means:
- **Full path:** `/home/elektry/www/`
- **Displayed as:** `www` (relative to home directory)

## Verify Current Setup

### Step 1: Check Multisite Configuration

1. **OVH Control Panel** → **Web** → **Multisite**
2. **Click on `www.elektr-ame.com`**
3. **Check "Root folder"** field:
   - What does it show exactly?
   - Is it just `www`?
   - Or does it show the full path?

### Step 2: Verify Files Are in Correct Location

**Files should be in:** `/home/elektry/www/`

**Check via OVH File Manager:**
1. Navigate to `www` folder (or `/home/elektry/www`)
2. Verify these files exist:
   - ✅ `index.html`
   - ✅ `assets/` folder
   - ✅ `api/` folder
   - ✅ `.htaccess`

### Step 3: If Root Folder is Wrong

**If Multisite root folder shows something other than `www` or `/home/elektry/www`:**

1. **Edit** the Multisite entry
2. **Change root folder** to: `www` (or `/home/elektry/www`)
3. **Save**
4. **Wait 5-10 minutes** for changes to propagate

### Step 4: Test Direct Access

**After verifying:**
1. Visit: `https://www.elektr-ame.com/index.html`
2. **View page source** (Right-click → View Page Source)
3. **Search for** `main.tsx` or `index-BsA5j1bS.js`
4. Should find `index-BsA5j1bS.js` (NOT `main.tsx`)

## Common OVH Path Scenarios

**Scenario 1: Root folder = `www`**
- Files go to: `/home/elektry/www/` ✅ (This is your case)

**Scenario 2: Root folder = `/home/elektry/www`**
- Files go to: `/home/elektry/www/` ✅ (Same)

**Scenario 3: Root folder = `/home/www`**
- Files go to: `/home/www/` ❌ (Doesn't exist in your case)

## Quick Fix

**If files are in `/home/elektry/www/` but site isn't using them:**

1. **Check Multisite root folder** - Should be `www` or `/home/elektry/www`
2. **If different, update it** to `www`
3. **Wait 5-10 minutes**
4. **Test the site**

The root folder in Multisite must match where your files are!

