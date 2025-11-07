# 🔧 Admin Database Connection Troubleshooting

Guide to fix database connection issues for the admin panel at `www.elektr-ame.com/admin`.

---

## 🔍 **STEP 1: DIAGNOSE THE ISSUE**

### **Test Database Connection**

Visit this URL in your browser:
```
https://www.elektr-ame.com/api/test-db-connection.php
```

**Expected Result:**
- ✅ "Database connection successful!"
- ✅ Shows database name and server info

**If you see an error:**
- ❌ "Database connection failed" → Go to Step 2
- ❌ "config.php not found" → Go to Step 3
- ❌ "Table 'admin_users' doesn't exist" → Go to Step 4

---

## 🔧 **STEP 2: FIX CONFIG.PHP**

### **Problem: Database credentials are wrong or missing**

### **Solution:**

1. **Access your OVH server via FTP/SSH**

2. **Navigate to:** `/home/elektry/www/api/` (or your web root)

3. **Check if `config.php` exists:**
   ```bash
   ls -la api/config.php
   ```

4. **If it doesn't exist, create it:**
   ```bash
   cp api/config-template.php api/config.php
   # OR
   cp api/config-ovh-template.php api/config.php
   ```

5. **Edit `api/config.php` with your OVH database credentials:**

   **Get credentials from OVH Control Panel:**
   - Login to OVH → Web Cloud → Hosting → Databases
   - Find your database and note:
     - **Server/Host**: Usually `mysql.cluster0XX.hosting.ovh.net` or `elektry2025.mysql.db`
     - **Database name**: e.g., `elektry2025`
     - **Username**: e.g., `elektry2025`
     - **Password**: The password you set

6. **Update `api/config.php`:**
   ```php
   <?php
   // Database configuration
   $host = 'elektry2025.mysql.db';        // Your OVH database server
   $dbname = 'elektry2025';                // Your database name
   $username = 'elektry2025';              // Your database username
   $password = 'YOUR_ACTUAL_PASSWORD';    // Your database password

   try {
       // Create PDO connection
       $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
       $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
       $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
   } catch (PDOException $e) {
       error_log("Database connection failed: " . $e->getMessage());
       die(json_encode(['success' => false, 'message' => 'Database connection failed']));
   }
   ?>
   ```

7. **Set correct permissions:**
   ```bash
   chmod 644 api/config.php
   ```

8. **Test again:**
   ```
   https://www.elektr-ame.com/api/test-db-connection.php
   ```

---

## 🗄️ **STEP 3: CREATE ADMIN_USERS TABLE**

### **Problem: Table 'admin_users' doesn't exist**

### **Solution:**

1. **Access phpMyAdmin:**
   - OVH Control Panel → Databases → Your database → "Access to phpMyAdmin"
   - Or: `https://www.elektr-ame.com/phpmyadmin` (if available)

2. **Select your database** in the left panel

3. **Import the admin_users table:**

   **Option A: Via phpMyAdmin SQL tab**
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
   ```

   **Option B: Import SQL file**
   - In phpMyAdmin, go to "Import" tab
   - Upload `database/admin-users.sql` from your repository

4. **Create your first admin user:**

   **Generate password hash:**
   - Create a temporary PHP file on your server:
   ```php
   <?php
   echo password_hash('YOUR_PASSWORD', PASSWORD_DEFAULT);
   ?>
   ```
   - Visit it in browser to get the hash

   **Insert admin user:**
   ```sql
   INSERT INTO admin_users (email, password_hash, name, role) VALUES 
   ('tech@elektr-ame.com', '$2y$10$YOUR_GENERATED_HASH_HERE', 'Super Admin', 'superadmin');
   ```

   **Or use the provided script:**
   - Upload `api/test-set-password.php` to your server
   - Visit it in browser to set password

---

## ✅ **STEP 4: VERIFY SETUP**

### **Checklist:**

- [ ] `api/config.php` exists on server
- [ ] Database credentials are correct in `config.php`
- [ ] `test-db-connection.php` shows "Database connection successful"
- [ ] `admin_users` table exists in database
- [ ] At least one admin user exists in `admin_users` table
- [ ] Admin user has `is_active = 1`

### **Test Admin Login:**

1. **Visit:** `https://www.elektr-ame.com/admin`

2. **Check browser console (F12):**
   - Look for errors in Console tab
   - Check Network tab for failed API calls

3. **Test API endpoints directly:**
   ```
   https://www.elektr-ame.com/api/auth-check.php
   ```
   Should return: `{"authenticated":false}`

4. **Try logging in:**
   - Email: `tech@elektr-ame.com` (or your admin email)
   - Password: Your admin password

---

## 🐛 **COMMON ERRORS & FIXES**

### **Error 1: "Database connection failed"**

**Causes:**
- Wrong host/server address
- Wrong database name
- Wrong username/password
- Database server is down

**Fix:**
- Double-check credentials in OVH Control Panel
- Test connection via phpMyAdmin first
- Verify database is active in OVH

---

### **Error 2: "config.php not found"**

**Causes:**
- File wasn't uploaded to server
- Wrong file path
- File permissions issue

**Fix:**
```bash
# Via SSH or FTP:
# 1. Check if file exists
ls -la /home/elektry/www/api/config.php

# 2. If missing, create from template
cp /home/elektry/www/api/config-template.php /home/elektry/www/api/config.php

# 3. Edit with correct credentials
nano /home/elektry/www/api/config.php

# 4. Set permissions
chmod 644 /home/elektry/www/api/config.php
```

---

### **Error 3: "Table 'admin_users' doesn't exist"**

**Causes:**
- Database schema not imported
- Table was dropped
- Wrong database selected

**Fix:**
- Import `database/admin-users.sql` via phpMyAdmin
- Or run the CREATE TABLE SQL manually

---

### **Error 4: "Invalid email or password" (but credentials are correct)**

**Causes:**
- Password hash is wrong
- User doesn't exist
- User is inactive (`is_active = 0`)

**Fix:**
```sql
-- Check if user exists
SELECT * FROM admin_users WHERE email = 'tech@elektr-ame.com';

-- If exists but password wrong, update password hash
-- Generate new hash using PHP, then:
UPDATE admin_users 
SET password_hash = '$2y$10$NEW_HASH_HERE' 
WHERE email = 'tech@elektr-ame.com';

-- If user is inactive, activate:
UPDATE admin_users 
SET is_active = 1 
WHERE email = 'tech@elektr-ame.com';
```

---

### **Error 5: "Only @elektr-ame.com email addresses are allowed"**

**Causes:**
- You're trying to login with wrong email domain

**Fix:**
- Use an email ending with `@elektr-ame.com`
- Or update the allowed domain in `api/auth-login.php` (line 50)

---

## 🔐 **QUICK FIX SCRIPT**

Create a file `api/fix-admin-setup.php` on your server:

```php
<?php
/**
 * Quick Admin Setup Fix Script
 * Run this ONCE to set up admin access
 * DELETE THIS FILE after use for security!
 */

// Include database config
require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Admin Setup Fix</h1>";

try {
    // Test connection
    echo "<p>✅ Database connection: OK</p>";
    
    // Check if admin_users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() == 0) {
        echo "<p>❌ admin_users table doesn't exist. Creating...</p>";
        
        // Create table
        $pdo->exec("
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
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "<p>✅ admin_users table created</p>";
    } else {
        echo "<p>✅ admin_users table exists</p>";
    }
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute(['tech@elektr-ame.com']);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo "<p>❌ Admin user doesn't exist. Creating...</p>";
        
        // Generate password hash
        $password = '92Alcolea2025'; // Change this!
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert admin user
        $stmt = $pdo->prepare("
            INSERT INTO admin_users (email, password_hash, name, role) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            'tech@elektr-ame.com',
            $hash,
            'Super Admin',
            'superadmin'
        ]);
        echo "<p>✅ Admin user created</p>";
        echo "<p>📧 Email: tech@elektr-ame.com</p>";
        echo "<p>🔑 Password: $password</p>";
    } else {
        echo "<p>✅ Admin user exists</p>";
        echo "<p>📧 Email: " . $user['email'] . "</p>";
        echo "<p>👤 Name: " . $user['name'] . "</p>";
        echo "<p>🔐 Role: " . $user['role'] . "</p>";
        echo "<p>✅ Active: " . ($user['is_active'] ? 'Yes' : 'No') . "</p>";
    }
    
    echo "<hr>";
    echo "<h2>✅ Setup Complete!</h2>";
    echo "<p><a href='/admin'>Go to Admin Panel</a></p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Check your config.php database credentials.</p>";
}
?>
```

**Usage:**
1. Upload to: `www/api/fix-admin-setup.php`
2. Visit: `https://www.elektr-ame.com/api/fix-admin-setup.php`
3. **DELETE the file after use!**

---

## 📞 **STILL HAVING ISSUES?**

### **Check Server Logs:**

**OVH Error Logs:**
- OVH Control Panel → Web Cloud → Hosting → Logs
- Check PHP error logs

**Via SSH:**
```bash
tail -f /home/elektry/logs/error.log
```

### **Test Individual Components:**

1. **Database connection:**
   ```
   https://www.elektr-ame.com/api/test-db-connection.php
   ```

2. **Auth check:**
   ```
   https://www.elektr-ame.com/api/auth-check.php
   ```

3. **Admin login (via curl):**
   ```bash
   curl -X POST https://www.elektr-ame.com/api/auth-login.php \
     -H "Content-Type: application/json" \
     -d '{"email":"tech@elektr-ame.com","password":"YOUR_PASSWORD"}'
   ```

---

## ✅ **SUCCESS INDICATORS**

When everything is working:
- ✅ `test-db-connection.php` shows success
- ✅ `auth-check.php` returns JSON (even if not authenticated)
- ✅ Admin login page loads without errors
- ✅ Login works and redirects to admin panel
- ✅ Admin panel shows all tabs (Events, Artists, Gallery, Users)

---

**Last Updated:** 2025-01-XX


