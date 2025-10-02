# 🔐 Secure Authentication with Role-Based Access Deployment Guide

This guide will help you deploy the new secure backend authentication system with superadmin capabilities.

## 📋 What Changed

✅ **Before:** Admin credentials were hardcoded in frontend JavaScript (visible to anyone)  
✅ **After:** Credentials stored securely in database with hashed passwords, verified by backend  
✅ **Role-Based Access:** Superadmin can create/manage other admin users
✅ **Domain Restriction:** Only @elektr-ame.com email addresses allowed

---

## 🚀 Deployment Steps

### **Step 1: Generate Password Hash**

1. **Upload the hash generator:**
   - Via FTP, upload `api/generate-password-hash.php` to `www/api/`

2. **Visit the script:**
   - Go to: `https://www.elektr-ame.com/api/generate-password-hash.php`
   - **Copy the generated hash** (long string starting with `$2y$`)

3. **DELETE the script immediately for security:**
   - Delete `www/api/generate-password-hash.php` from your server

---

### **Step 2: Create Admin Users Table**

1. **Access phpMyAdmin** from OVH Control Panel

2. **Select your database** (`elektry2025`)

3. **Go to SQL tab** and run this (replace `YOUR_HASH_HERE` with the hash from Step 1):

```sql
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert SUPERADMIN user (tech@elektr-ame.com)
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('tech@elektr-ame.com', 'YOUR_HASH_HERE', 'Super Admin', 'superadmin');
```

4. **Verify:** Check that the `admin_users` table was created with 1 row

---

### **Step 3: Update Database Credentials in API Files**

**Edit these files via FTP and update with YOUR OVH credentials:**

#### **File 1: `www/api/auth-login.php`**
Lines 28-31, change:
```php
$host = 'elektry2025.mysql.db';        // Your OVH database server
$dbname = 'elektry2025';                // Your database name
$username = 'elektry2025';              // Your database username
$password = 'your_password';            // Your database password
```

---

### **Step 4: Upload New API Files**

**Via FTP, upload these NEW files to `www/api/`:**
- ✅ `api/auth-login.php`
- ✅ `api/auth-logout.php`
- ✅ `api/auth-check.php`

---

### **Step 5: Build and Deploy Frontend**

**On your laptop:**

```bash
# Navigate to project
cd elektr-ame-website

# Commit changes to Git (recommended)
git add .
git commit -m "Implement secure backend authentication"
git push

# Build production version
npm run build
```

**Upload via FTP:**
- Upload contents of `dist/` to `www/` (replace existing files)

---

### **Step 6: Test the Authentication**

1. **Visit:** `https://www.elektr-ame.com/admin`

2. **Login with Superadmin:**
   - Email: `tech@elektr-ame.com`
   - Password: `92Alcolea2025`

3. **Verify:**
   - ✅ Login works
   - ✅ Admin panel loads
   - ✅ You see 4 tabs: Events, Artists, Gallery, **Users**
   - ✅ Users tab allows you to create new admins
   - ✅ Logout works
   - ✅ After logout, you can't access admin without logging in again

4. **Check security:**
   - Open browser DevTools (F12) → Network tab
   - Try logging in
   - Check that passwords are NOT visible in plain text in requests

---

## 🔒 Security Features Implemented

✅ **Password Hashing:** Uses PHP's `password_hash()` with bcrypt  
✅ **Session Management:** PHP sessions with secure cookies  
✅ **No Credentials Exposed:** Credentials never sent to browser  
✅ **Session Timeout:** 24-hour automatic logout  
✅ **CORS Protection:** Proper headers configured  
✅ **SQL Injection Protection:** Prepared statements with PDO  
✅ **Role-Based Access Control:** Superadmin vs Admin permissions  
✅ **Domain Restriction:** Only @elektr-ame.com emails allowed  
✅ **User Management:** Superadmins can create/manage other admins  

---

## 🛡️ Additional Security Recommendations

### **For Production:**

1. **Enable HTTPS** (OVH usually provides free SSL)
2. **Secure PHP sessions** - Add to `php.ini` or `.htaccess`:
   ```apache
   php_value session.cookie_httponly 1
   php_value session.cookie_secure 1
   php_value session.use_strict_mode 1
   ```

3. **Rate Limiting:** Consider adding login attempt limits
4. **Two-Factor Authentication:** For extra security (future enhancement)

---

## 🆘 Troubleshooting

### **Problem: Login shows "Network error"**
- Check that API files are uploaded to `www/api/`
- Verify database credentials are correct in `auth-login.php`
- Check browser console for specific error messages

### **Problem: "Invalid email or password"**
- Verify the password hash was generated correctly
- Check that the admin_users table has the user
- Make sure email matches exactly (case-sensitive)

### **Problem: Session doesn't persist**
- Check that PHP sessions are enabled on OVH
- Verify cookies are allowed in browser
- Check session timeout settings

---

## 📝 Managing Admin Users

### **Method 1: Using the Admin Panel (Recommended - Superadmin Only)**

1. Login as superadmin (`tech@elektr-ame.com`)
2. Go to the **Users** tab
3. Click **"Add Admin User"**
4. Fill in:
   - Email (must be @elektr-ame.com)
   - Full Name
   - Password
   - Role (Admin or Superadmin)
5. Click **"Create User"**

You can also activate/deactivate users from this panel!

### **Method 2: Manually via phpMyAdmin**

**Add a New Admin User:**

1. Generate hash for new password (use the generator script)
2. In phpMyAdmin, run:
```sql
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('newadmin@elektr-ame.com', 'HASH_HERE', 'Admin Name', 'admin');
```

**Change Password:**

1. Generate new hash
2. In phpMyAdmin:
```sql
UPDATE admin_users 
SET password_hash = 'NEW_HASH_HERE' 
WHERE email = 'admin@elektr-ame.com';
```

**Disable an Admin:**

```sql
UPDATE admin_users 
SET is_active = FALSE 
WHERE email = 'admin@elektr-ame.com';
```

---

## 🎉 Success!

Once deployed, your admin authentication is now secure! The credentials are:
- ✅ Hashed in the database
- ✅ Verified server-side only
- ✅ Never exposed to frontend code
- ✅ Protected with PHP sessions

**Your site is now production-ready from a security standpoint!** 🚀

---

## 👥 User Roles Explained

### **Superadmin** (`tech@elektr-ame.com`)
- ✅ Full access to all admin features
- ✅ Can create new admin users
- ✅ Can activate/deactivate users
- ✅ Can manage events, artists, gallery
- ✅ See the "Users" tab in admin panel

### **Regular Admin**
- ✅ Can manage events, artists, gallery
- ❌ Cannot see the "Users" tab
- ❌ Cannot create or manage other admins

