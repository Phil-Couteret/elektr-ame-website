# Admin Portal Troubleshooting Guide

## 🔍 Diagnostic Steps

### Step 1: Run the Diagnostic Tool

I've created a diagnostic page to test all admin portal components.

**Upload and visit:** `https://www.elektr-ame.com/api/test-auth.php`

This will test:
- ✅ PHP session functionality
- ✅ Database connection
- ✅ Admin users table
- ✅ API endpoints (auth-check.php, auth-login.php)
- ✅ Current session state

---

### Step 2: Check What You See on /admin

Visit: `https://www.elektr-ame.com/admin`

**What do you see?**

#### A) Login Form (GOOD!)
- This is correct behavior
- Enter your admin credentials
- If login fails, check Step 3

#### B) Blank Page (BAD)
- Open DevTools (F12) → Console tab
- Look for JavaScript errors
- Check Network tab for failed API calls

#### C) 404 Not Found (BAD)
- Frontend files not uploaded correctly
- Re-upload `index.html` and `assets/` folder

#### D) 500 Server Error (BAD)
- PHP error - check server error logs
- Or run the diagnostic tool

---

### Step 3: Common Issues & Solutions

#### Issue 1: "Blank page on /admin"

**Cause:** JavaScript error or failed API call

**Fix:**
1. Open DevTools (F12) → Console
2. Check for errors like:
   - `Failed to fetch`
   - `CORS error`
   - `auth-check.php 404`
3. If auth-check.php is 404: Upload `api/` folder
4. If CORS error: Check `config.php` has correct domain

---

#### Issue 2: "Login form shows but login fails"

**Cause:** Database or API issue

**Fix:**
1. Run diagnostic: `/api/test-auth.php`
2. Check Test 2: Database connection
3. Check Test 3: Admin users exist
4. If no admin users: Create one using `/api/test-db-connection.php`

---

#### Issue 3: "Cannot access /api/test-auth.php"

**Cause:** API files not uploaded

**Fix:**
1. Re-upload the `api/` folder from deployment package
2. Make sure `api/config.php` exists on server
3. Check file permissions: `chmod 644 api/*.php`

---

#### Issue 4: "Database connection failed"

**Cause:** `config.php` missing or incorrect

**Fix:**
1. Check `/home/elektry/www/api/config.php` exists
2. Verify database credentials are correct
3. Test with: `/api/test-db-connection.php`

---

### Step 4: Verify Upload Checklist

Make sure these files/folders were uploaded:

```
/home/elektry/www/
  ├── .htaccess ✅
  ├── index.html ✅
  ├── manifest.json ✅
  ├── service-worker.js ✅
  ├── assets/ ✅
  │   ├── index-Du9GGGrV.css
  │   └── index-B0gdYjOG.js
  └── api/ ✅
      ├── auth-check.php
      ├── auth-login.php
      ├── auth-logout.php
      ├── config.php (IMPORTANT!)
      └── ... (other API files)
```

---

### Step 5: Check Browser Console

1. Visit `/admin`
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for errors (red text)

**Common errors:**

```
Failed to fetch
→ API files missing or CORS issue

auth-check.php 404
→ API folder not uploaded

Unexpected token < in JSON
→ PHP error (server returning HTML instead of JSON)
```

---

### Step 6: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for `/api/auth-check.php` request

**What to check:**
- **Status:** Should be `200 OK`
- **Response:** Should be JSON like `{"authenticated":false}`
- **If 404:** API files not uploaded
- **If 500:** PHP error - check server logs

---

## 🔧 Quick Fixes

### Fix 1: Re-upload API Files

```bash
# From deployment package, upload:
api/auth-check.php
api/auth-login.php
api/auth-logout.php
api/config.php (if missing)
```

### Fix 2: Check config.php

```bash
# SSH to server:
cat /home/elektry/www/api/config.php

# Should contain:
$host = 'localhost';
$dbname = 'elektrame_db';
$username = 'your_db_user';
$password = 'your_db_pass';
```

### Fix 3: Test Database

Visit: `https://www.elektr-ame.com/api/test-db-connection.php`

Should show: "✅ Database connection successful"

### Fix 4: Clear Browser Cache

Sometimes the browser caches old JavaScript files:
1. Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete`)
2. Clear cache
3. Hard refresh: `Ctrl+Shift+R`

---

## 📋 Step-by-Step Diagnosis

Run these tests in order:

1. ✅ **Visit:** `/api/test-auth.php`
   - All tests should pass

2. ✅ **Visit:** `/admin`
   - Should show login form

3. ✅ **Try login:**
   - Use your admin credentials
   - Should redirect to admin panel

4. ✅ **Check DevTools:**
   - No red errors in Console
   - API calls return 200 status

---

## 🆘 If Still Not Working

**Please provide:**

1. **Screenshot** of what you see when visiting `/admin`

2. **DevTools Console errors:**
   - Open DevTools (F12)
   - Console tab
   - Screenshot any red errors

3. **Results from** `/api/test-auth.php`
   - Which tests pass?
   - Which tests fail?

4. **What you uploaded:**
   - Did you upload the entire `api/` folder?
   - Did you upload `index.html` and `assets/`?
   - Is `config.php` on the server?

---

## 🎯 Most Likely Causes

Based on "admin portal not accessible":

### 1. API Files Not Uploaded (80% likely)
**Solution:** Upload `api/` folder from deployment package

### 2. config.php Missing (15% likely)
**Solution:** Check `/api/config.php` exists with correct credentials

### 3. JavaScript Build Issue (4% likely)
**Solution:** Clear browser cache and hard refresh

### 4. Server Configuration (1% likely)
**Solution:** Check PHP version >= 7.4, mod_rewrite enabled

---

## 📞 Next Steps

1. **First:** Visit `/api/test-auth.php` and tell me what you see
2. **Second:** Visit `/admin` and tell me what you see
3. **Third:** Open DevTools Console and tell me if there are errors

With this information, I can pinpoint the exact issue! 🎯

