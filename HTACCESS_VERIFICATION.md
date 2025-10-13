# .htaccess Verification Guide

## ✅ Latest Fix Applied (Commit: ceb83cf)

**Root Cause Identified:**
1. ❌ Vite plugin only copied `.htaccess`, not `.htaccess.minimal`
2. ❌ GitHub Actions `cp -r dist/.*` didn't work reliably
3. ❌ No verification steps to catch the issue

**Fixes Applied:**
1. ✅ Vite plugin now copies BOTH files
2. ✅ GitHub Actions explicitly copies each file
3. ✅ Added verification steps at each stage

---

## 🔍 How to Verify It's Fixed

### Step 1: Check GitHub Actions Output

Go to: https://github.com/Phil-Couteret/elektr-ame-website/actions

Look for the latest workflow run and check these sections:

#### Section: "Verify build output"
```
📁 Checking dist/ folder contents:
...
-rw-r--r-- ... .htaccess
-rw-r--r-- ... .htaccess.minimal
...

🔍 Looking for .htaccess:
✅ .htaccess found!
```

#### Section: "Create deployment package"
```
✓ Copied .htaccess
✓ Copied .htaccess.minimal
```

#### Section: "Show artifact info"
```
🔍 Checking for .htaccess in package:
✅ .htaccess is in the package!
```

**If you see all these ✅ checkmarks, the package is correct!**

---

### Step 2: Download and Extract Package

1. Download the artifact from GitHub Actions
2. Extract the ZIP file
3. Check root directory:

```
deployment-package/
  ├── .htaccess          ← MUST be here!
  ├── .htaccess.minimal  ← MUST be here!
  ├── index.html
  ├── manifest.json
  ├── service-worker.js
  ├── offline.html
  ├── assets/
  ├── pwa-icons/
  └── api/
```

**To see hidden files on your computer:**

**Windows:**
- File Explorer → View → Show hidden files

**Mac:**
- Finder → Press `Cmd + Shift + .`
- Or in terminal: `ls -la deployment-package/`

**Linux:**
- Terminal: `ls -la deployment-package/`

---

### Step 3: Verify Upload to Server

After uploading to OVH:

```bash
# SSH to your server, then:
cd /home/elektry/www/
ls -la | grep htaccess

# Should show:
# -rw-r--r-- ... .htaccess
# -rw-r--r-- ... .htaccess.minimal
```

---

### Step 4: Test HTTPS Redirect

**Method 1: Browser**
1. Visit: `http://www.elektr-ame.com` (HTTP, not HTTPS)
2. Should automatically redirect to: `https://www.elektr-ame.com`
3. Check address bar for padlock 🔒

**Method 2: Command Line**
```bash
curl -I http://www.elektr-ame.com

# Should show:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.elektr-ame.com
```

---

### Step 5: Test PWA Features

1. **Visit site with HTTPS** (must have padlock 🔒)
2. **Open DevTools** (F12)
3. **Check Console tab:**
   - Should see: `[PWA] Service Worker registered successfully`
   - No errors about manifest or service worker
4. **Check Application tab → Service Workers:**
   - Status: `activated`
   - Should show `service-worker.js`
5. **Check Application tab → Manifest:**
   - Name: Elektr-Âme
   - 8 icons loaded
   - No errors
6. **Wait 5 seconds on the homepage**
   - Custom install prompt should appear
   - OR: Browser menu → "Add to Home Screen" / "Install"

---

## 🐛 Troubleshooting

### Issue: GitHub Actions shows "❌ .htaccess NOT found!"

**Cause:** Vite build didn't copy files

**Solution:**
1. Check `vite.config.ts` has the custom plugin
2. Check `public/.htaccess` exists
3. Re-run workflow

---

### Issue: Files in dist/ but not in deployment-package/

**Cause:** GitHub Actions copy command failed

**Solution:**
1. Check `.github/workflows/deploy.yml` has explicit copy commands
2. Check workflow log for "✓ Copied .htaccess"
3. Re-run workflow

---

### Issue: Files in package but not on server

**Cause:** Upload didn't include hidden files

**Solution:**

**If using FTP client (FileZilla, etc):**
1. Settings → Force showing hidden files
2. Re-upload root directory

**If using cPanel File Manager:**
1. Settings → Show Hidden Files (dotfiles)
2. Re-upload

**If using SSH/command line:**
```bash
scp -r deployment-package/.htaccess user@server:/home/elektry/www/
scp -r deployment-package/.htaccess.minimal user@server:/home/elektry/www/
```

---

### Issue: .htaccess on server but HTTPS not working

**Possible causes:**

1. **mod_rewrite not enabled**
   - Contact OVH support to enable `mod_rewrite`

2. **Wrong file permissions**
   ```bash
   chmod 644 .htaccess
   ```

3. **OVH panel overriding .htaccess**
   - Check OVH control panel → Apache configuration
   - Disable any conflicting redirects

4. **Syntax error in .htaccess**
   - Check server error logs
   - Try `.htaccess.minimal` (simpler version)

---

## 📋 Quick Checklist

Before reporting issues, verify:

- [ ] GitHub Actions workflow completed successfully
- [ ] Workflow log shows "✅ .htaccess is in the package!"
- [ ] Downloaded package contains `.htaccess` in root
- [ ] `.htaccess` uploaded to server root directory
- [ ] File permissions: `644` (readable)
- [ ] Site accessible via HTTPS with padlock
- [ ] Tested in incognito/private mode (no cache)
- [ ] Waited full 5 seconds for install prompt

---

## 🎯 Expected Result

After this fix:

✅ `.htaccess` in `dist/` after build  
✅ `.htaccess` in deployment package  
✅ `.htaccess` uploaded to server  
✅ HTTP → HTTPS redirect works  
✅ PWA service worker registers  
✅ Install prompt appears  
✅ "Add to Home Screen" available  

---

## 📊 Build Pipeline Flow

```
public/.htaccess
    ↓
[Vite Build + Custom Plugin]
    ↓
dist/.htaccess
    ↓
[GitHub Actions - Explicit Copy]
    ↓
deployment-package/.htaccess
    ↓
[Download Artifact]
    ↓
[Upload to OVH]
    ↓
/home/elektry/www/.htaccess
    ↓
✅ HTTPS + PWA Working!
```

---

## 🔗 Useful Links

- **GitHub Actions:** https://github.com/Phil-Couteret/elektr-ame-website/actions
- **Latest Workflow:** Click on the most recent "Build and Deploy" run
- **Download Artifact:** In workflow run → Artifacts section → Download "deployment"

---

**Last Updated:** 2025-10-13  
**Status:** ✅ Fixed and verified locally  
**Next:** Wait for GitHub Actions build to complete

