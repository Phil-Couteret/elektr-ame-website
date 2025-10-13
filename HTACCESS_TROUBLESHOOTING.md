# .htaccess Troubleshooting Guide

## Current Status

✅ HTTPS redirect is working!

## Common Issues & Solutions

### Issue 1: PWA Install Prompt Still Not Showing

**Cause:** Browser cache or old service worker

**Solution:**
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Unregister old service worker:**
   - Open DevTools (F12)
   - Application → Service Workers
   - Click "Unregister" on old service worker
   - Refresh page
4. **Test in incognito/private mode**

---

### Issue 2: API Calls Failing

**Cause:** .htaccess might be blocking API routes

**Solution:** I've updated the .htaccess to explicitly allow API calls.

If still failing, use the minimal version:
1. Upload `.htaccess.minimal` instead of `.htaccess`
2. Rename it to `.htaccess` on server

---

### Issue 3: Pages Not Loading / 500 Errors

**Cause:** Server doesn't support certain .htaccess directives

**Solutions:**

**Option A: Use Minimal .htaccess (Safest)**
```apache
# Just HTTPS redirect, nothing else
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

**Option B: Let OVH Handle HTTPS**
1. Delete .htaccess from server
2. In OVH Control Panel → Enable "Force HTTPS" option
3. PWA will still work!

**Option C: No .htaccess at All**
If your OVH hosting already forces HTTPS:
- Don't upload .htaccess
- PWA will work fine!

---

## How to Test What's Working

### 1. Check HTTPS
```
Visit: http://www.elektr-ame.com
Should redirect to: https://www.elektr-ame.com
Look for padlock 🔒 in address bar
```

### 2. Check Service Worker
```
1. Open DevTools (F12)
2. Console tab
3. Look for: "[PWA] Service Worker registered successfully"
4. Application tab → Service Workers
5. Should see service-worker.js status: activated
```

### 3. Check Manifest
```
1. DevTools → Application → Manifest
2. Should show:
   - Name: Elektr-Âme
   - Start URL: /
   - Icons: 8 icons loaded
   - No errors
```

### 4. Check Install Prompt
```
Desktop:
- Visit site
- Wait 5 seconds
- Custom install prompt appears (electric blue box)
- OR: Look in address bar for install icon

Mobile:
- Visit site in Chrome/Safari
- Browser menu → "Add to Home Screen" / "Install"
```

---

## Which .htaccess to Use?

### Use FULL VERSION (current) if:
- ✅ Everything works
- ✅ You want security headers
- ✅ You want optimized caching

### Use MINIMAL VERSION if:
- ⚠️ Getting 500 errors
- ⚠️ API calls failing
- ⚠️ Pages not loading

### Use NO .htaccess if:
- ✅ OVH already forces HTTPS
- ✅ You want maximum compatibility

---

## Current Files Available

1. **`.htaccess`** (Full version)
   - HTTPS redirect
   - Security headers
   - Caching rules
   - API protection

2. **`.htaccess.minimal`** (Backup)
   - Just HTTPS redirect
   - Maximum compatibility

---

## Quick Fixes

### Fix 1: Clear Everything and Start Fresh

```bash
# On server, delete:
- .htaccess (if causing issues)
- service-worker.js (old version)

# Re-upload from deployment package:
- .htaccess.minimal (rename to .htaccess)
- service-worker.js
- manifest.json
- index.html
```

### Fix 2: Browser Cache

```
Chrome/Edge:
Ctrl+Shift+Delete → Clear cache → Hard reload

Safari iOS:
Settings → Safari → Clear History and Website Data

Firefox:
Ctrl+Shift+Delete → Clear cache
```

### Fix 3: Test in Incognito

```
1. Open incognito/private window
2. Visit https://www.elektr-ame.com
3. Should see install prompt after 5 seconds
4. If works here = browser cache issue
```

---

## What Should Work Now

With HTTPS redirect working:
- ✅ Service worker should register
- ✅ Install prompt should appear
- ✅ "Add to Home Screen" in browser menu
- ✅ PWA features enabled

---

## Next Steps

1. **If everything works:** Great! You're done! 🎉

2. **If install prompt not showing:**
   - Clear browser cache
   - Test in incognito mode
   - Wait full 5 seconds

3. **If pages broken:**
   - Use .htaccess.minimal
   - Or remove .htaccess entirely

4. **If API broken:**
   - Check if API calls use HTTPS
   - Check browser console for errors

---

## Need Help?

**Tell me specifically what's happening:**
1. What error do you see? (screenshot?)
2. What page/feature isn't working?
3. Browser console errors? (F12 → Console)
4. Does it work in incognito mode?

I'll help you debug! 🔧

