# PWA Not Working - Diagnostic Guide

## 🔍 **RUN THE PWA DIAGNOSTIC TOOL**

**First step:** Visit this page to see exactly what's wrong:

```
https://www.elektr-ame.com/api/test-pwa.php
```

This will run 8 automated tests and tell you exactly what's blocking the PWA.

---

## 🚨 **MOST LIKELY ISSUE: HTTPS**

**90% of the time, PWA doesn't work because HTTPS isn't properly configured.**

### Quick Check:

1. Visit: `https://www.elektr-ame.com`
2. Look at the address bar
3. **Do you see a padlock 🔒?**

- ✅ **YES** → HTTPS is working, issue is something else
- ❌ **NO** (warning icon ⚠️) → **THIS IS THE PROBLEM**

---

## ❌ **If You See "Not Secure" Warning**

This means HTTPS is not active, even though you have the `.htaccess` redirect.

### Why This Happens:

The `.htaccess` file says "redirect to HTTPS", but:
- Your server doesn't have an SSL certificate installed, OR
- The SSL certificate isn't properly configured

### How to Fix:

You need to **enable SSL on your OVH hosting**:

#### Option 1: Let's Encrypt (Free SSL)

1. Log in to **OVH Control Panel**
2. Go to your hosting plan → **SSL/TLS**
3. Click **"Order an SSL certificate"**
4. Choose **"Free (Let's Encrypt)"**
5. Follow the wizard
6. Wait 10-30 minutes for activation

#### Option 2: Force HTTPS in OVH Panel

1. Log in to **OVH Control Panel**
2. Go to **Multisite** section
3. Click the gear icon ⚙️ next to your domain
4. Check **"Force HTTPS"**
5. Save

#### Option 3: Check if SSL is Already There

Maybe SSL is installed but not activated:

1. OVH Control Panel → **SSL/TLS**
2. Check status: Should say "Active" or "Valid"
3. If not: Regenerate or reinstall

---

## ✅ **If HTTPS IS Working (Padlock Shows)**

Then the issue is something else. Run the diagnostic tool to find out:

### Common Issues When HTTPS Works:

#### Issue 1: Files Not Uploaded

**Check these files exist on server:**
```
/manifest.json
/service-worker.js
/offline.html
/pwa-icons/icon-192x192.png
/pwa-icons/icon-512x512.png
/.htaccess
```

**How to check:** Visit `/api/test-pwa.php` → Test 2

#### Issue 2: Browser Cache

**Solution:**
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
- Or: Open incognito/private mode
- Or: Clear browser cache completely

#### Issue 3: Service Worker Not Registering

**How to check:**
1. F12 → Console tab
2. Look for: `[PWA] Service Worker registered successfully`
3. If error: Read the error message

**Or:**
1. F12 → Application tab
2. Left sidebar → Service Workers
3. Should show: `service-worker.js` with status "activated"

#### Issue 4: PWA Icons Missing

**Check:** `/api/test-pwa.php` → Test 3 → Click "Check PWA Icons"

If icons are missing:
- Upload the `pwa-icons/` folder
- Or regenerate icons using the guide in `PWA_ICONS_GUIDE.md`

---

## 📋 **Complete PWA Requirements Checklist**

For PWA to work, you need **ALL** of these:

### 1. HTTPS ✓
- [ ] SSL certificate installed
- [ ] Site accessible via `https://`
- [ ] Padlock 🔒 shows in address bar
- [ ] No "Not secure" warning

### 2. Manifest File ✓
- [ ] `/manifest.json` exists
- [ ] Contains: name, short_name, start_url, display, icons
- [ ] Linked in `index.html`: `<link rel="manifest" href="/manifest.json">`

### 3. Service Worker ✓
- [ ] `/service-worker.js` exists
- [ ] Registered in `main.tsx`
- [ ] F12 → Application → Service Workers shows "activated"

### 4. Icons ✓
- [ ] At least 192x192 and 512x512 icons
- [ ] Referenced in `manifest.json`
- [ ] Files exist at specified paths

### 5. Additional Files ✓
- [ ] `/offline.html` (fallback page)
- [ ] `/.htaccess` (React Router + HTTPS redirect)

### 6. Browser Requirements ✓
- [ ] Using modern browser (Chrome, Firefox, Safari, Edge)
- [ ] Not in incognito mode for testing
- [ ] Visited site before (browser caches manifest)

---

## 🔧 **Step-by-Step Diagnosis**

### Step 1: Run Diagnostic

Visit: `https://www.elektr-ame.com/api/test-pwa.php`

Look at **Test 1: HTTPS Status**
- ✅ Green? Continue to Step 2
- ❌ Red? Fix HTTPS first (see above)

### Step 2: Check Files

Still on test-pwa.php, look at **Test 2: Required PWA Files**
- All ✅? Continue to Step 3
- Some ❌? Upload missing files

### Step 3: Test Service Worker

Click **"Test Service Worker"** button

- ✅ Registered? Continue to Step 4
- ❌ Error? Read the error message carefully

### Step 4: Check Manifest

Click **"Check Manifest"** button

- ✅ Found? Continue to Step 5
- ❌ Error? Upload `manifest.json`

### Step 5: Browser DevTools

1. F12 → Console tab
2. Look for errors (red text)
3. Common errors:
   - `Failed to register service worker` → HTTPS issue
   - `Manifest: ... failed to load` → File missing/wrong path
   - `CORS error` → Check server headers

### Step 6: Install Prompt

If all above pass:
- Wait 5 seconds on the homepage
- Custom install prompt should appear
- OR: Browser menu → "Install Elektr-Âme"

---

## 🎯 **Most Common Solutions**

### 80% of Cases: Enable SSL on OVH

**Problem:** "Not secure" warning  
**Solution:** OVH Control Panel → SSL/TLS → Order Let's Encrypt (free)

### 10% of Cases: Clear Browser Cache

**Problem:** Old files cached  
**Solution:** Hard refresh (Ctrl+Shift+R) or incognito mode

### 5% of Cases: Files Not Uploaded

**Problem:** manifest.json or service-worker.js missing  
**Solution:** Re-upload deployment package

### 5% of Cases: Wrong File Paths

**Problem:** Files in wrong location  
**Solution:** Ensure files are in root: `/manifest.json`, `/service-worker.js`

---

## 💬 **Tell Me What You See**

After visiting `/api/test-pwa.php`, tell me:

1. **Test 1 (HTTPS):** ✅ or ❌?
2. **Test 2 (Files):** All ✅ or some ❌?
3. **Test 4 (Service Worker):** What does it say after clicking the button?
4. **Browser Console (F12):** Any red errors?

With this info, I can tell you exactly what to fix! 🎯

---

## 🔗 **OVH SSL Setup Links**

**Enable Let's Encrypt (Free SSL):**
1. Go to: [OVH Control Panel](https://www.ovh.com/manager/)
2. Your hosting → SSL/TLS
3. Order certificate → Free (Let's Encrypt)

**OVH SSL Guide:**
- English: https://help.ovhcloud.com/csm/en-gb-web-hosting-ssl-certificate?id=kb_article_view
- Español: https://help.ovhcloud.com/csm/es-es-web-hosting-ssl-certificate?id=kb_article_view

---

## 📞 **Need Help?**

If the diagnostic tool shows all ✅ but PWA still doesn't work:

1. Screenshot the diagnostic tool results
2. Screenshot your browser console (F12 → Console)
3. Screenshot Application tab → Service Workers
4. Tell me your browser and version

I'll help debug it! 🚀

