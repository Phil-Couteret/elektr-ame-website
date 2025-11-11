# 🔧 Fix Service Worker Caching Old index.html

## Problem
Network tab shows `main.tsx` is being requested, but server's `index.html` is correct. This means a **service worker is serving cached content**.

## Solution: Unregister Service Worker

### Step 1: Unregister Service Worker

1. **DevTools** → **Application** tab
2. **Service Workers** (left sidebar)
3. **Click "Unregister"** on any service workers listed
4. If you see "See all registrations" → Click it → Unregister all

### Step 2: Clear Service Worker Cache

1. **Application** tab → **Cache Storage** (left sidebar)
2. **Delete all caches:**
   - Right-click each cache → Delete
   - Or: Click cache → Delete button

### Step 3: Clear All Storage

1. **Application** tab → **Storage** section
2. **Click "Clear site data"**
3. **Check all boxes:**
   - Cookies
   - Cache
   - Service workers
   - Local storage
   - Session storage
4. **Click "Clear site data"**

### Step 4: Hard Refresh

1. **Close DevTools**
2. **Hard refresh:** Ctrl+Shift+R (or Cmd+Shift+R)
3. **Or:** Right-click refresh → "Empty Cache and Hard Reload"

### Step 5: Verify

After clearing:
1. **Open Network tab**
2. **Check "Disable cache"**
3. **Refresh page**
4. **Check:** Should now request `index-BsA5j1bS.js` (NOT `main.tsx`)

## Alternative: Update Service Worker

If service worker keeps re-registering:

1. **Update** `service-worker.js` on OVH
2. **Increment** `CACHE_VERSION` in the file
3. **Upload** new version
4. **Unregister** old service worker
5. **Refresh** - new service worker will register

## Quick Test

**After clearing service worker:**
- Network tab should show `index-BsA5j1bS.js` (NOT `main.tsx`)
- Console should have no MIME type errors
- Site should load

The service worker is the culprit - it's serving a cached development `index.html`!

