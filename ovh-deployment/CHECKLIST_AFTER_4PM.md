# ✅ Checklist: What to Check After 4pm Issue

## ✅ .htaccess - VERIFIED
Your `.htaccess` file is correct and has:
- ✅ API passthrough rule
- ✅ HTTPS redirect
- ✅ React Router rules
- ✅ Security headers

**This is NOT the problem.**

## 🔍 What to Check Next

### 1. Check if Files Still Exist
Via FTP, verify these exist in `/home/elektry/www/`:

**Critical Files:**
- [ ] `index.html` - Does it exist?
- [ ] `api/` folder - Does it exist?
- [ ] `api/config.php` - Does it exist?
- [ ] `assets/` folder - Does it exist?

**What to do:**
1. Connect via FTP
2. Navigate to `/home/elektry/www/`
3. List all files
4. Check if these exist

### 2. Check Multisite Configuration
OVH Control Panel → "Web" → "Multisite":

- [ ] Is `www.elektr-ame.com` listed?
- [ ] What does "Root folder" say? (Should be `/www`)
- [ ] Is it active/enabled?

**If domain is NOT in Multisite:**
- That's the problem!
- Add it with root folder `/www`

### 3. Check File Permissions
Via FTP, check permissions:

- [ ] `index.html` - Should be 644
- [ ] `.htaccess` - Should be 644
- [ ] `api/` folder - Should be 755
- [ ] `api/*.php` files - Should be 644

**If permissions wrong:**
```bash
chmod 644 /home/elektry/www/index.html
chmod 644 /home/elektry/www/.htaccess
chmod 755 /home/elektry/www/api
chmod 644 /home/elektry/www/api/*.php
```

### 4. Check OVH Logs
OVH Control Panel → "Web" → "Statistics and logs":

- [ ] Check error logs
- [ ] Check access logs
- [ ] Look for errors around 4pm

### 5. Check Domain DNS
OVH Control Panel → "Domain" → "DNS Zone":

- [ ] A record for `www.elektr-ame.com` exists
- [ ] Points to correct IP
- [ ] Not expired

### 6. Check if OVH Did Maintenance
OVH Control Panel:

- [ ] Check for notifications
- [ ] Check for maintenance messages
- [ ] Check hosting status (active/expired)

## 🎯 Most Likely Issues (in order)

### Issue 1: Multisite Configuration Changed
**Symptom:** Everything returns "Not Found"
**Check:** Is domain in Multisite?
**Fix:** Re-add domain with root folder `/www`

### Issue 2: Files Were Deleted/Moved
**Symptom:** Files missing from `/home/elektry/www/`
**Check:** List files via FTP
**Fix:** Re-upload from `ovh-deployment/`

### Issue 3: File Permissions Changed
**Symptom:** Files exist but not accessible
**Check:** Check permissions
**Fix:** Reset permissions (see above)

### Issue 4: config.php Missing
**Symptom:** API endpoints fail
**Check:** Does `/home/elektry/www/api/config.php` exist?
**Fix:** Create it (see CREATE_CONFIG_PHP.txt)

## 🔧 Quick Test

1. **Upload simple-test.html to `/home/elektry/www/`**
2. **Visit:** `https://www.elektr-ame.com/simple-test.html`
3. **Result:**
   - ✅ Works → Files are there, check Multisite
   - ❌ Not Found → Multisite not configured OR files in wrong place

## 📋 Action Items

**Do these in order:**

1. ✅ Check if files exist in `/home/elektry/www/`
2. ✅ Check Multisite configuration
3. ✅ Test with simple-test.html
4. ✅ Check file permissions
5. ✅ Check OVH logs

**Share results and we'll fix it!**

